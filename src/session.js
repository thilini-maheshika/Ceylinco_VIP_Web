const setToken = (token) => {
  localStorage.setItem('token', token);
};

const setUserrole = (role) => {
  localStorage.setItem('role', role);
};

const setUserid = (userId) => {
  localStorage.setItem('userId', userId);
}

const getToken = () => {
  return localStorage.getItem('token');
};

const getUserrole = () => {
  return localStorage.getItem('role');
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
  const role = getUserrole();
  return !!token && !!userId && !!role;
}

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
};

export { setToken, getToken, isAuthenticated, logout, isUserAuth, setUserid, getUserid, isLogged, getUserrole, setUserrole };
