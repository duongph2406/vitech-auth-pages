// Utility to clear admin data from localStorage
export const clearAdminData = () => {
  try {
    const users = JSON.parse(localStorage.getItem('vitech_users') || '[]');
    const filteredUsers = users.filter(user => user.username !== 'admin');
    localStorage.setItem('vitech_users', JSON.stringify(filteredUsers));
    
    // Check if current user is admin and logout if so
    const currentUserId = localStorage.getItem('vitech_current_user');
    if (currentUserId && currentUserId !== 'null') {
      const currentUser = users.find(user => user.id.toString() === currentUserId);
      if (currentUser && currentUser.username === 'admin') {
        localStorage.setItem('vitech_current_user', 'null');
      }
    }
    
    console.log('Admin data cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing admin data:', error);
    return false;
  }
};

// Auto-run when imported
clearAdminData();