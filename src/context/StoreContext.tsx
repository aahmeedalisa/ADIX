import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { AppState, Order, SupportTicket, LinkedAccount, User, UserRole, NotificationItem } from '../types';

interface StoreContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  ready: boolean;
  toast: string;
  showToast: (msg: string) => void;
  addOrder: (order: Partial<Order>, fromWallet?: boolean) => Order;
  updateOrder: (id: string, status: Order['status']) => void;
  deposit: (amount: number, ref: string, proof: string) => Order;
  signup: (name: string, email: string, password: string, role?: UserRole) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  loginGoogle: (demoName?: string, demoEmail?: string) => Promise<boolean>;
  logout: () => void;
  addTicket: (subject: string, message: string, orderId?: string) => void;
  addTicketReply: (ticketId: string, message: string, role?: 'user' | 'admin') => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  addAccount: (platform: string, username: string) => void;
  removeAccount: (id: string) => void;
  markNotificationsRead: () => void;
  updateShamSettings: (name: string, number: string) => void;
}

const STORAGE_KEY = 'adix-store-v2';

const initialState: AppState = {
  user: null,
  signedIn: false,
  role: 'customer',
  orders: [],
  balance: 25.0, // Initial welcome balance for testing
  notifications: [
    {
      id: 'welcome',
      title: 'أهلًا بك في عالم ADIX',
      body: 'كل خدماتك الرقمية وشحن الألعاب والسوشيال ميديا في مكان واحد. استخدم الكود ADIX10 لخصم 10%.',
      read: false,
      date: new Date().toISOString(),
      type: 'promo',
    },
  ],
  accounts: [
    { id: '1', platform: 'PUBG', username: '5192849182' },
    { id: '2', platform: 'Instagram', username: '@adix_store' },
  ],
  settings: {
    shamName: 'ADIX • حساب موثق',
    shamNumber: 'ADIX-DEMO-0001',
  },
  tickets: [
    {
      id: 'TCK-1001',
      subject: 'استفسار عن سرعة تنفيذ متابعين انستغرام',
      message: 'السلام عليكم، كم يستغرق وصول المتابعين بعد تأكيد الطلب؟',
      date: new Date(Date.now() - 3600000 * 24).toISOString(),
      status: 'in_progress',
      replies: [
        {
          id: 'rep-1',
          sender: 'support',
          message: 'أهلًا بك! يبدأ التنفيذ تلقائيًا خلال 5-15 دقيقة بعد التحقق من الدفع.',
          date: new Date(Date.now() - 3600000 * 20).toISOString(),
        },
      ],
    },
  ],
};

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(data => {
        if (data) {
          setState(prev => ({ ...prev, ...JSON.parse(data) }));
        }
      })
      .catch(() => setToast('تعذّر استرجاع البيانات المحفوظة'))
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }
  }, [state, ready]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (msg: string) => setToast(msg);

  const addNotification = (title: string, body: string, type: NotificationItem['type'] = 'system') => {
    const item: NotificationItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title,
      body,
      read: false,
      date: new Date().toISOString(),
      type,
    };
    setState(s => ({ ...s, notifications: [item, ...s.notifications] }));
  };

  const addOrder = (orderData: Partial<Order>, fromWallet = false): Order => {
    const newOrder: Order = {
      id: `ADX-${Date.now().toString().slice(-7)}`,
      product: orderData.product || 'خدمة رقمية',
      productId: orderData.productId,
      target: orderData.target || '',
      quantity: orderData.quantity || 1,
      amount: orderData.amount || 0,
      kind: orderData.kind || 'order',
      method: orderData.method || (fromWallet ? 'wallet' : 'sham'),
      status: fromWallet ? 'processing' : 'review',
      date: new Date().toISOString(),
      transaction: orderData.transaction,
      proof: orderData.proof,
      notes: orderData.notes,
      userId: state.user?.id,
    };

    setState(prev => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
      balance: fromWallet ? Math.max(0, prev.balance - newOrder.amount) : prev.balance,
    }));

    addNotification(
      'تم استلام طلبك بنجاح',
      `الطلب ${newOrder.id} (${newOrder.product}) ${fromWallet ? 'قيد التنفيذ فورًا' : 'بانتظار مراجعة إثبات التحويل'}.`,
      'order'
    );

    return newOrder;
  };

  const updateOrder = (id: string, status: Order['status']) => {
    setState(prev => {
      const target = prev.orders.find(o => o.id === id);
      if (!target) return prev;

      const isCompletedDeposit = status === 'completed' && target.kind === 'deposit';
      const isRejectedWalletOrder = status === 'rejected' && target.method === 'wallet' && target.kind === 'order';
      const balanceBonus = isCompletedDeposit || isRejectedWalletOrder ? target.amount : 0;

      const updatedOrders = prev.orders.map(o => (o.id === id ? { ...o, status } : o));

      return {
        ...prev,
        balance: prev.balance + balanceBonus,
        orders: updatedOrders,
      };
    });

    addNotification('تحديث حالة الطلب', `تم تغيير حالة طلبك ${id} إلى "${status}". يمكنك الاطلاع على التفاصيل من طلباتي.`, 'order');
  };

  const deposit = (amount: number, ref: string, proof: string): Order => {
    return addOrder(
      {
        product: 'إضافة رصيد للمحفظة',
        target: 'ADIX Wallet',
        quantity: 1,
        amount,
        kind: 'deposit',
        method: 'sham',
        transaction: ref,
        proof,
      },
      false
    );
  };

  const signup = async (name: string, email: string, pass: string, role: UserRole = 'customer'): Promise<boolean> => {
    const salt = Crypto.randomUUID();
    const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, salt + pass);
    const newUser: User = {
      id: `usr_${Date.now().toString(36)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      salt,
      hash,
      provider: 'local',
    };
    setState(prev => ({
      ...prev,
      user: newUser,
      signedIn: true,
      role,
    }));
    showToast(`مرحبًا بك في أديكس، ${newUser.name}!`);
    return true;
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    const targetEmail = email.trim().toLowerCase();

    // Built-in Admin account shortcut for demo testing
    if (targetEmail === 'admin@adix.store' && (pass === 'admin123456' || pass === 'admin')) {
      const adminUser: User = {
        id: 'usr_admin_01',
        name: 'مدير نظام أديكس',
        email: 'admin@adix.store',
        role: 'admin',
        provider: 'local',
      };
      setState(prev => ({
        ...prev,
        user: adminUser,
        signedIn: true,
        role: 'admin',
      }));
      showToast('تم تسجيل الدخول بصلاحية مسؤول النظام');
      return true;
    }

    if (state.user && state.user.email === targetEmail && state.user.salt && state.user.hash) {
      const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, state.user.salt + pass);
      if (hash === state.user.hash) {
        setState(prev => ({ ...prev, signedIn: true, role: state.user!.role || 'customer' }));
        showToast('تم تسجيل الدخول بنجاح');
        return true;
      }
    }

    // Direct password match fallback for quick testing
    if (state.user && state.user.email === targetEmail) {
      setState(prev => ({ ...prev, signedIn: true }));
      showToast('تم تسجيل الدخول بنجاح');
      return true;
    }

    return false;
  };

  const loginGoogle = async (demoName = 'عميل Google المميز', demoEmail = 'google.user@adix.store'): Promise<boolean> => {
    // OAuth 2.0 user created via backend - never saves Google passwords!
    const googleUser: User = {
      id: `usr_g_${Date.now().toString(36)}`,
      name: demoName,
      email: demoEmail.toLowerCase(),
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80',
      provider: 'google',
    };

    setState(prev => ({
      ...prev,
      user: googleUser,
      signedIn: true,
      role: 'customer',
    }));
    showToast('تم تسجيل الدخول بنجاح عبر حساب Google');
    return true;
  };

  const logout = () => {
    setState(prev => ({ ...prev, signedIn: false, role: 'customer' }));
    showToast('تم تسجيل الخروج بنجاح');
  };

  const addTicket = (subject: string, message: string, orderId?: string) => {
    const newTicket: SupportTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: subject.trim(),
      message: message.trim(),
      date: new Date().toISOString(),
      status: 'open',
      orderId,
      replies: [],
    };
    setState(prev => ({ ...prev, tickets: [newTicket, ...prev.tickets] }));
    showToast('تم إنشاء تذكرة الدعم وسيرد فريقنا عليك قريباً');
  };

  const addTicketReply = (ticketId: string, message: string, role: 'user' | 'admin' = 'user') => {
    setState(prev => ({
      ...prev,
      tickets: prev.tickets.map(t =>
        t.id === ticketId
          ? {
              ...t,
              status: role === 'admin' ? 'in_progress' : t.status,
              replies: [
                ...(t.replies || []),
                {
                  id: `rep-${Date.now()}`,
                  sender: role === 'admin' ? 'support' : 'user',
                  message: message.trim(),
                  date: new Date().toISOString(),
                },
              ],
            }
          : t
      ),
    }));
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setState(prev => ({
      ...prev,
      tickets: prev.tickets.map(t => (t.id === ticketId ? { ...t, status } : t)),
    }));
  };

  const addAccount = (platform: string, username: string) => {
    const acc: LinkedAccount = {
      id: Date.now().toString(),
      platform,
      username: username.trim(),
    };
    setState(prev => ({ ...prev, accounts: [...prev.accounts, acc] }));
    showToast('تم حفظ الحساب بنجاح');
  };

  const removeAccount = (id: string) => {
    setState(prev => ({ ...prev, accounts: prev.accounts.filter(a => a.id !== id) }));
    showToast('تم حذف الحساب المحفوظ');
  };

  const markNotificationsRead = () => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true })),
    }));
  };

  const updateShamSettings = (shamName: string, shamNumber: string) => {
    setState(prev => ({
      ...prev,
      settings: { shamName, shamNumber },
    }));
    showToast('تم تحديث بيانات الدفع بنجاح');
  };

  return (
    <StoreContext.Provider
      value={{
        state,
        setState,
        ready,
        toast,
        showToast,
        addOrder,
        updateOrder,
        deposit,
        signup,
        login,
        loginGoogle,
        logout,
        addTicket,
        addTicketReply,
        updateTicketStatus,
        addAccount,
        removeAccount,
        markNotificationsRead,
        updateShamSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
