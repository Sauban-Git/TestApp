import { type ConversationApi, type ConversationsListApi } from "../types/types";
import { create } from "zustand";

interface ConversationListStore {
  conversationsList: ConversationsListApi | null;
  setConversationsList: (value: ConversationsListApi) => void;
  addConversation: (value: ConversationApi) => void
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
}))
