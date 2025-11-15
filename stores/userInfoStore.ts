
import { create } from "zustand";
import { type UserInfoApi } from "../types/types";

interface UserInfoStore {
  user: UserInfoApi | null;
  setUserInfo: (value: UserInfoApi) => void;
}

export const useUserInfoStore = create<UserInfoStore>((set) => ({
  user: null,
  setUserInfo: (value: UserInfoApi) => set({
    user: value
  })
}))
