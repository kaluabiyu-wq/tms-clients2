export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  category: string;
  actionUrl?: string | null;
  isRead: boolean;
  createdAt: string;
  readAt?: string | null;
}

export interface NotificationPage {
  items: NotificationItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  unreadCount: number;
}

export interface NotificationPreference {
  category: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  updatedAt?: string;
}

export interface NotificationRealtimeMessage extends Omit<NotificationItem, 'isRead' | 'readAt'> {}
