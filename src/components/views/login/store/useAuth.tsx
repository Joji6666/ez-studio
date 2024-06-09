import { create } from "zustand";
import { IAuthStore } from "../util/auth_interface";

const useAuth = create<IAuthStore>((set) => ({
  loginInfo: {
    id: 0,
  },

  setLoginInfo: (id: number) => {
    set((prev) => ({ ...prev, loginInfo: { ...prev.loginInfo, id } }));
  },
}));

export default useAuth;
