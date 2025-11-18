import { ConversationApi } from "@/types/types"
import { create } from "zustand"

interface SelectConversationStore {
  conversation: ConversationApi | null
  setConversationStore: (conversation: ConversationApi) => void
}

export const useSelectConversationStore = create<SelectConversationStore>((set) => ({
  conversation: null,
  setConversationStore: (conversation: ConversationApi) => set({
    conversation
  })
}))
