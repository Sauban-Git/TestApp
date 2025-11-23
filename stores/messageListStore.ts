import { create } from "zustand"
import { type MessageListApi, type MessageApi } from "../types/types"

interface MessageListStore {
  messagesList: MessageListApi | null
  setMessagesList: (value: MessageListApi | null) => void
  addMessage: (value: MessageApi) => void
  markMessagesAsRead: (readAtTime: any) => void
  markMessagesAsDelivered: (deliveredAt: any) => void
}

export const useMessageListStore = create<MessageListStore>((set) => ({
  messagesList: null,
  setMessagesList: (value: MessageListApi | null) => set({
    messagesList: value
  }),
  addMessage: (value: MessageApi) => set((state) => ({
    messagesList: state.messagesList ? [...state.messagesList, value] : [value]
  })),

  markMessagesAsRead: (readAtTime: any) =>
    set((state) => ({
      messagesList: state.messagesList
        ? state.messagesList.map((msg) => {
          if (!msg.readAt) {
            return { ...msg, readAt: readAtTime };
          }
          return msg;
        })
        : null,
    })),

  markMessagesAsDelivered: (deliveredAt: any) =>
    set((state) => ({
      messagesList: state.messagesList
        ? state.messagesList.map((msg) => {
          if (!msg.recievedAt) {
            return { ...msg, recievedAt: deliveredAt }
          }
          return msg;
        })
        : null
    }))


}))
