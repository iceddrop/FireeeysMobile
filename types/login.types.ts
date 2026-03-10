export interface JwtPayload {
  phoneNumber: string;
  name: string;
  role?: string;
  isVerified?: boolean;
}

interface User {
  name: string;
  email?: string;
}

export interface UserData {
  user: User;
  data?: {
    location?: string;
    wifiSsid?: string;
    wifiPassword?: string;
    co2Threshold?: number;
  };
}