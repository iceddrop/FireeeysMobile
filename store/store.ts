import { create } from "zustand";
import backendInstance from "../api/AxiosInstance";

type Data = {
  temperature?: number;
  co2?: number;
  humidity?: number;
  co2Threshold?: number;
};
export type GasData = { data?: Data; [key: string]: any };

type State = {
  gasData: GasData | null;
  loading: boolean;
  error?: string;
  fetchGasData: (
    phone: string,
    mac: string,
    signal?: AbortSignal,
  ) => Promise<void>;
};

export const useGasStore = create<State>((set) => ({
  gasData: null,
  loading: false,
  error: undefined,
  fetchGasData: async (phone, mac, signal) => {
    set({ loading: true, error: undefined });
    try {
      const res = await backendInstance.get("/gas-detectors/user/getDetector", {
        params: { phoneNumber: phone, macAddress: mac },
        signal,
      });
      set({ gasData: res.data, loading: false });
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? e.message, loading: false });
    }
  },
}));

// User store to fetch user details
type User = { name: string; email?: string };
export type UserData = {
  user: User;
  data?: {
    location?: string;
    wifiSsid?: string;
    wifiPassword?: string;
    co2Threshold?: number;
  };
};

type UserState = {
  userData: UserData | null;
  loadingUser: boolean;
  userError?: string;
  fetchUserDetails: (
    phone: string,
    mac: string,
    signal?: AbortSignal,
  ) => Promise<void>;
};

export const useUserStore = create<UserState>((set) => ({
  userData: null,
  loadingUser: false,
  userError: undefined,
  fetchUserDetails: async (phone, mac, signal) => {
    set({ loadingUser: true, userError: undefined });
    try {
      const res = await backendInstance.get("/user/user-gas-details", {
        params: { phoneNumber: phone, macAddress: mac },
        signal,
      });
      set({ userData: res.data, loadingUser: false });
    } catch (e: any) {
      set({
        userError: e?.response?.data?.message ?? e.message,
        loadingUser: false,
      });
    }
  },
}));
