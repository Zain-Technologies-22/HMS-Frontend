// AuthContext.tsx
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Function to fetch CSRF token from Django
  const fetchCSRFToken = async () => {
    try {
      const response = await fetch('http://localhost:7000/api/csrf/', {
        method: 'GET',
        credentials: 'include', // Ensure cookies are included
      });
      if (!response.ok) {
        console.error('Failed to fetch CSRF token:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  };

  useEffect(() => {
    fetchCSRFToken(); // Fetch the CSRF token on initial load

    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:7000/api/check-auth/', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.isAuthenticated);
          setUsername(data.username || null);
        } else {
          setIsLoggedIn(false);
          setUsername(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoggedIn(false);
        setUsername(null);
      }
    };
    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const csrfToken = getCookie('csrftoken'); // Fetch CSRF token from cookies
      const response = await fetch('http://localhost:7000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken, // Include CSRF token
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Include cookies
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUsername(data.username);
        return true;
      } else {
        const errorData = await response.json(); // Get error message
        console.error('Login failed:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const csrfToken = getCookie('csrftoken'); // Fetch CSRF token from cookies
      const response = await fetch('http://localhost:7000/api/logout/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrfToken, // Include CSRF token
        },
        credentials: 'include', // Include cookies
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setUsername(null);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function getCookie(name: string): string {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
  return '';
}
