export interface Alarm {
  name: string;
  scheduledTime: number;
  periodInMinutes?: number;
}

export interface Notification {
  id: string;
  type: 'basic' | 'image' | 'list' | 'progress';
  title: string;
  message: string;
  iconUrl?: string;
  buttons?: Array<{
    title: string;
    iconUrl?: string;
  }>;
}

export interface StorageChange<T = any> {
  oldValue?: T;
  newValue?: T;
}
