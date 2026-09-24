export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  salt?: string;
  hash?: string;
  provider?: 'local' | 'google';
}

export interface Category {
  id: string;
  name: string;
  sub: string;
  icon: string;
}

export interface FilterItem {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  unit: string;
  icon: string;
  color?: string;
  tag?: string;
  image?: any;
  description?: string;
}

export type OrderStatus = 'review' | 'processing' | 'completed' | 'rejected';
export type OrderKind = 'order' | 'deposit';
export type PaymentMethod = 'sham' | 'wallet';

export interface Order {
  id: string;
  product: string;
  productId?: string;
  target: string;
  quantity: number;
  amount: number;
  kind: OrderKind;
  method: PaymentMethod;
  status: OrderStatus;
  date: string;
  transaction?: string;
  proof?: string;
  notes?: string;
  userId?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  date: string;
  type?: 'order' | 'wallet' | 'ticket' | 'promo' | 'system';
}

export interface LinkedAccount {
  id: string;
  platform: string;
  username: string;
}

export interface SupportTicketReply {
  id: string;
  sender: 'user' | 'support' | 'admin';
  message: string;
  date: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  date: string;
  status: 'open' | 'in_progress' | 'closed';
  orderId?: string;
  replies?: SupportTicketReply[];
}

export interface CouponItem {
  code: string;
  percent: number;
  percentText: string;
  title: string;
  desc: string;
  terms: string;
  minAmount?: number;
}

export type HomePosition = 'top' | 'beforeServices' | 'afterServices' | 'beforeFooter' | 'footer';

export interface DeveloperSettings {
  name: string;
  description: string;
  avatar: string;
  icon: string;
  instagram: string;
  tiktok: string;
  x: string;
  website: string;
  enabled: boolean;
  showHome: boolean;
  showAbout: boolean;
  showMenu: boolean;
  showFooter: boolean;
  showSocialIcons: boolean;
  showName: boolean;
  showDescription: boolean;
  homePosition: HomePosition;
}

export interface SystemSettings {
  shamName: string;
  shamNumber: string;
}

export interface AppState {
  user: User | null;
  signedIn: boolean;
  role: UserRole;
  orders: Order[];
  balance: number;
  notifications: NotificationItem[];
  accounts: LinkedAccount[];
  settings: SystemSettings;
  tickets: SupportTicket[];
}

export type RootStackParamList = {
  Main: { screen?: string; params?: any } | undefined;
  Service: { id: string };
  Checkout: { id: string; pack?: number };
  Payment: { order?: Partial<Order>; deposit?: boolean };
  Proof: { order: Partial<Order> };
  OrderDetail: { id: string; created?: boolean };
  Notifications: undefined;
  Coupons: undefined;
  Login: undefined;
  Register: undefined;
  Accounts: undefined;
  Support: { orderId?: string } | undefined;
  About: undefined;
  Developer: undefined;
  Admin: undefined;
  Terms: undefined;
  Privacy: undefined;
  Refund: undefined;
};
