export interface OwnerInfo {
  name: string;
  phone: string;
  email: string; // Added email field
  wechat: string;
  message: string;
  isRegistered: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'owner'; // 'user' is the finder, 'owner' is the AI proxy
  text: string;
  timestamp: number;
}

export enum AppMode {
  SETUP = 'SETUP', // Owner configuring the drive
  FOUND = 'FOUND', // Finder plugged in the drive
}