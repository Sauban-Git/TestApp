
import { create } from "zustand";
import { type UserInfoApi } from "../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface UserInfoStore {
  user: UserInfoApi | null;
  setUserInfo: (value: UserInfoApi) => void;
  loadUserInfo: () => Promise<void>
}

export const useUserInfoStore = create<UserInfoStore>((set) => ({
  user: null,
  setUserInfo: async (value: UserInfoApi) => {
    set({
      user: value,
    })

    await AsyncStorage.setItem("userInfo", JSON.stringify(value))
  },
  loadUserInfo: async () => {
    const stored = await AsyncStorage.getItem("userInfo")
    if (stored) {
      set({
        user: JSON.parse(stored)
      })
    }
  }
}))
