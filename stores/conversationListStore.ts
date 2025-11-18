import { MessageApi, type ConversationApi, type ConversationsListApi } from "../types/types";
import { create } from "zustand";

interface ConversationListStore {
  conversationsList: ConversationsListApi | null;
  setConversationsList: (value: ConversationsListApi) => void;
  addConversation: (value: ConversationApi) => void;
  updateLastMessage: (message: MessageApi, conversationId: string) => void
}

export const useConversationsListStore = create<ConversationListStore>((set) => ({
  conversationsList: null,
  setConversationsList: (value: ConversationsListApi) => set({
    conversationsList: value
  }),
  addConversation: (conversation) => set((state) => ({
    conversationsList: state.conversationsList
      ? [...state.conversationsList, conversation]
      : [conversation]
  })),
  updateLastMessage: (message: MessageApi, conversationId: string) => set((state) => ({
    conversationsList: state.conversationsList
      ? state.conversationsList.map((conv) => conv.id === conversationId
        ? {
          ...conv, messages: [message]
        }
        : conv
      )
      : null,
  }))
}))
