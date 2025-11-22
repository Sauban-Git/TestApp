
import { create } from 'zustand';

type TypingStore = {
  typingUsers: Set<string>;                // userIds currently typing
  addTypingUser: (userId: string) => void;
  removeTypingUser: (userId: string) => void;
  clearTyping: () => void;                // optional
};

export const useTypingStore = create<TypingStore>((set) => ({
  typingUsers: new Set(),

  addTypingUser: (userId) =>
    set((state) => {
      const updated = new Set(state.typingUsers);
      updated.add(userId);
      return { typingUsers: updated };
    }),

  removeTypingUser: (userId) =>
    set((state) => {
      const updated = new Set(state.typingUsers);
      updated.delete(userId);
      return { typingUsers: updated };
    }),

  clearTyping: () => set({ typingUsers: new Set() }),
}));
