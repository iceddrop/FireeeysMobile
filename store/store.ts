import { create } from "zustand";
import backendInstance from "../api/AxiosInstance";

type GasDetector = { temperature?: number; co2?: number; humidity?: number };
export type GasData = { gasDetector?: GasDetector; [key: string]: any };

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
      const res = await backendInstance.get("/user/user-gas-details", {
        params: { phoneNumber: phone, macAddress: mac },
        signal,
      });
      set({ gasData: res.data, loading: false });
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? e.message, loading: false });
    }
  },
}));