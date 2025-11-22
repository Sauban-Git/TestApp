import { create } from "zustand"
import { type MessageListApi, type MessageApi } from "../types/types"

interface MessageListStore {
  messagesList: MessageListApi | null
  setMessagesList: (value: MessageListApi | null) => void
  addMessage: (value: MessageApi) => void
}

export const useMessageListStore = create<MessageListStore>((set) => ({
  messagesList: null,
  setMessagesList: (value: MessageListApi | null) => set({
    messagesList: value
  }),
  addMessage: (value: MessageApi) => set((state) => ({
    messagesList: state.messagesList ? [...state.messagesList, value] : [value]
  }))
}))
