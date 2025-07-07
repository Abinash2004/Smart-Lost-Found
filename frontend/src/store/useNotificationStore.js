import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) => {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    set({ notifications, unreadCount });
  },
  markAllAsRead: () => set(state => {
    const updatedNotifications = state.notifications.map(n => ({ ...n, isRead: true }));
    return { 
      notifications: updatedNotifications,
      unreadCount: 0 
    };
  }),
  markAsRead: (id) => set(state => {
    const updatedNotifications = state.notifications.map(n => 
      n._id === id ? { ...n, isRead: true } : n
    );
    const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
    return { 
      notifications: updatedNotifications,
      unreadCount 
    };
  })
}));

export default useNotificationStore;
