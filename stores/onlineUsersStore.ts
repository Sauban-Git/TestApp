import { UserInfoApi } from "@/types/types";
import { create } from "zustand";

interface OnlineUserStore {
  onlineUserList: string[] | null
  setOnlineUserList: (onlineUserList: string[]) => void
}

export const useOnlineUserList = create<OnlineUserStore>((set) => ({
  onlineUserList: null,
  setOnlineUserList: (onlineUserList: string[]) => {
    set({
      onlineUserList
    })
  }
}))
