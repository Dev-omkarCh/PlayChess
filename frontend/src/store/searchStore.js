import { create } from 'zustand';

const useSeachedUsers = create((set) =>({
    searchUsers : [],
    setSearchUser : (searchUsers) => set({ searchUsers }),
}));

export default useSeachedUsers;