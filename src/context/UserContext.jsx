import React, { createContext } from 'react';

const UserContext = createContext({
  user: null,
  setUser: () => {},
  token: null,
  setToken: () => {},
  login: () => {},
  logout: () => {},
});

export default UserContext;
