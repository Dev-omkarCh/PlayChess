import { create } from "zustand";

export const messageStore = create((set) => ({

  messages: [],
  setMessages: (messages, isOne=false) => set((state)=>{
    if(isOne){
      return { messages: [...state.messages, messages] }
    }
    return { messages }
  }),

}));