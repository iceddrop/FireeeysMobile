export interface JwtPayload {
  phoneNumber: string;
  name: string;
  role?: string;
  isVerified?: boolean;
}