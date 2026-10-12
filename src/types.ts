export interface AgencyService {
  id: string;
  name: string;
  tagline: string;
  description: string;
  priceEur: number;
  pricePrefix?: string;
  priceUnit?: string;
  paymentEnabled?: boolean;
  contactUrl?: string;
  deliveryTime: string;
  category: 'audit' | 'maintenance' | 'performance' | 'development';
  popular?: boolean;
  features: string[];
  scope: string[];
}

export interface TelegramUserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface PurchaseOrder {
  orderId: string;
  serviceId: string;
  serviceName: string;
  starsPaid: number;
  priceEur: number;
  currency: 'EUR' | 'XTR';
  timestamp: number;
  status: 'paid' | 'cancelled' | 'failed' | 'pending';
  telegramUserId: number;
  telegramUsername?: string;
  invoiceLink?: string;
  paypalOrderId?: string;
}

export interface TelegramWebAppObject {
  initData: string;
  initDataUnsafe?: {
    query_id?: string;
    user?: TelegramUserData;
    auth_date?: string;
    hash?: string;
    start_param?: string;
  };
  version?: string;
  platform?: string;
  colorScheme?: 'light' | 'dark';
  themeParams?: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded?: boolean;
  viewportHeight?: number;
  viewportStableHeight?: number;
  headerColor?: string;
  backgroundColor?: string;
  ready: () => void;
  expand: () => void;
  close: () => void;
  openInvoice: (url: string, callback?: (status: 'paid' | 'cancelled' | 'failed' | 'pending') => void) => void;
  showPopup: (params: { title?: string; message: string; buttons?: Array<{ id?: string; type?: string; text?: string }> }, callback?: (buttonId: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (ok: boolean) => void) => void;
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  MainButton?: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebAppObject;
    };
  }
}
