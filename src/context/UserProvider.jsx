import React, { useState, useEffect, useCallback } from 'react';
import UserContext from './UserContext';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUserJSON = localStorage.getItem('user');
    return storedUserJSON ? JSON.parse(storedUserJSON) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('authToken') || null;
  });

  const [loginError, setLoginError] = useState(false);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  }, []);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authToken', token);

      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        console.log('Token expired, logging out');
        logout();
      } else {
        console.log('Token expiration:', new Date(decodedToken.exp * 1000));
      }
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    }
  }, [user, token, logout]);

  const login = async (data) => {
    try {
      const res = await axios.post(
        'http://localhost:3000/api/users/login',
        data
      );
      console.log('Login response:', res);

      const { token } = res.data;
      if (token) {
        setToken(token);
        const decodedToken = jwtDecode(token);

        const user = {
          id: decodedToken.id,
          firstname: decodedToken.firstname,
          lastname: decodedToken.lastname,
          email: decodedToken.email,
          dateOfBirth: decodedToken.dateOfBirth,
          country: decodedToken.country,
          phone: decodedToken.phone,
          gender: decodedToken.gender,
          profilePicture: decodedToken.profilePicture,
          isAdmin: decodedToken.isAdmin,
        };

        setUser(user);
        setLoginError(false);
        console.log('Login successful. Navigating to appropriate page.');
        return { success: true, isAdmin: user.isAdmin };
      } else {
        console.log('Login failed: No token in response');
        setLoginError(true);
        return { success: false };
      }
    } catch (err) {
      console.error('Login error:', err);
      console.log('Error response:', err.response);
      setLoginError(true);
      return { success: false };
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        login,
        logout,
        loginError,
        setLoginError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
