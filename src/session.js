const setToken = (token) => {
  localStorage.setItem('token', token);
};

const setUserid = (userId) => {
  localStorage.setItem('userId', userId);
}

const getToken = () => {
  return localStorage.getItem('token');
};

const getUserid = (userId) => {
  return localStorage.getItem('userId');
}

const isUserAuth = () => {
  const userId = getUserid();
  return !!userId;
}

const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

const isLogged = () => {
  const token = getToken();
  const userId = getUserid();
  return !!token && !!userId;
}

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
};

export { setToken, getToken, isAuthenticated, logout, isUserAuth, setUserid, getUserid, isLogged };
