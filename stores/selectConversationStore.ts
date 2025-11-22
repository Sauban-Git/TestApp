import { ConversationApi } from "@/types/types"
import { create } from "zustand"

interface SelectConversationStore {
  conversation: ConversationApi | null
  setConversationStore: (conversation: ConversationApi | null) => void
}

export const useSelectConversationStore = create<SelectConversationStore>((set) => ({
  conversation: null,
  setConversationStore: (conversation: ConversationApi | null) => set({
    conversation
  })
}))
