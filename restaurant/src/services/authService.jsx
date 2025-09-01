// A simple mock authentication service
export const authService = {
  login: async (username, password) => {
    // In a real app, you'd make an API call here.
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('user', JSON.stringify({ username: 'admin' }));
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
};