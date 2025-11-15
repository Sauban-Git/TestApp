import { create } from "zustand"

interface SelectConversationStore {
  name?: string | null
  id: string | null
  setConversationStore: ({ name, id }: { name: string | null, id: string }) => void
}

export const useSelectConversationStore = create<SelectConversationStore>((set) => ({
  name: null,
  id: null,
  setConversationStore: ({ name, id }: { name: string | null, id: string | null }) => set({
    name,
    id
  })
}))
