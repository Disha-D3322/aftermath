import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, VolunteerProfile } from '../types';
import { SEED_USERS, SEED_VOLUNTEER_PROFILES } from '../lib/seedData';

interface AuthContextType {
  currentUser: UserProfile | null;
  volunteerProfile: VolunteerProfile | null;
  isAuthenticated: boolean;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  toggleVolunteerStatus: () => void;
  updateVolunteerSkills: (skills: string[], languages: string[]) => void;
  updateVolunteerAvailability: (isAvailable: boolean) => void;
  loginDemo: (email: string) => boolean;
  logout: () => void;
  availableUsers: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('aftermath_users');
    return saved ? JSON.parse(saved) : SEED_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('aftermath_current_uid') || 'user_maria_101';
  });

  const [volunteerProfiles, setVolunteerProfiles] = useState<Record<string, VolunteerProfile>>(() => {
    const saved = localStorage.getItem('aftermath_vol_profiles');
    return saved ? JSON.parse(saved) : SEED_VOLUNTEER_PROFILES;
  });

  const currentUser = availableUsers.find(u => u.id === currentUserId) || availableUsers[0] || null;
  const volunteerProfile = currentUser ? (volunteerProfiles[currentUser.id] || null) : null;

  useEffect(() => {
    localStorage.setItem('aftermath_users', JSON.stringify(availableUsers));
  }, [availableUsers]);

  useEffect(() => {
    localStorage.setItem('aftermath_current_uid', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('aftermath_vol_profiles', JSON.stringify(volunteerProfiles));
  }, [volunteerProfiles]);

  const switchUser = (userId: string) => {
    const user = availableUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUserId(userId);
    }
  };

  const switchRole = (role: UserRole) => {
    if (!currentUser) return;
    if (!currentUser.roles.includes(role) && !currentUser.roles.includes('admin')) {
      alert(`Access Restricted: Account does not hold the ${role} privilege.`);
      return;
    }
    setAvailableUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, currentRole: role };
      }
      return u;
    }));
  };

  const toggleVolunteerStatus = () => {
    if (!currentUser) return;
    const newStatus = !currentUser.isVolunteer;
    setAvailableUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, isVolunteer: newStatus };
      }
      return u;
    }));

    if (newStatus && !volunteerProfiles[currentUser.id]) {
      // Initialize volunteer record
      setVolunteerProfiles(prev => ({
        ...prev,
        [currentUser.id]: {
          userId: currentUser.id,
          isAvailable: true,
          skills: ['Community Outreach', 'First Aid Basic'],
          languages: ['English'],
          serviceArea: {
            city: 'Cedar Valley',
            state: 'OR',
            radiusKm: 25,
            coordinates: { lat: 44.0521, lng: -123.0868 }
          },
          verifiedPoints: 0,
          completedTaskCount: 0,
          badges: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }));
    }
  };

  const updateVolunteerSkills = (skills: string[], languages: string[]) => {
    if (!currentUser) return;
    setVolunteerProfiles(prev => {
      const existing = prev[currentUser.id];
      if (!existing) return prev;
      return {
        ...prev,
        [currentUser.id]: {
          ...existing,
          skills,
          languages,
          updatedAt: new Date().toISOString()
        }
      };
    });
  };

  const updateVolunteerAvailability = (isAvailable: boolean) => {
    if (!currentUser) return;
    setVolunteerProfiles(prev => {
      const existing = prev[currentUser.id];
      if (!existing) return prev;
      return {
        ...prev,
        [currentUser.id]: {
          ...existing,
          isAvailable,
          updatedAt: new Date().toISOString()
        }
      };
    });
  };

  const loginDemo = (email: string): boolean => {
    const user = availableUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUserId(user.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    // Return to default user for easy hackathon demo navigation
    setCurrentUserId('user_maria_101');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        volunteerProfile,
        isAuthenticated: Boolean(currentUser),
        switchUser,
        switchRole,
        toggleVolunteerStatus,
        updateVolunteerSkills,
        updateVolunteerAvailability,
        loginDemo,
        logout,
        availableUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
