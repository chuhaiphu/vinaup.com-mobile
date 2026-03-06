import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HOME_UTILITY_KEYS, STORAGE_KEYS, type HomeUtilityKey } from '@/constants/app-constant';

interface HomeUtilitiesStore {
  selectedUtilities: HomeUtilityKey[];
  toggleUtility: (key: HomeUtilityKey) => void;
  setUtilities: (utilities: HomeUtilityKey[]) => void;
  resetUtilities: () => void;
}

export const useHomeUtilitiesStore = create<HomeUtilitiesStore>()(
  persist(
    (set) => ({
      selectedUtilities: [
        HOME_UTILITY_KEYS.receiptPaymentSelf,
        HOME_UTILITY_KEYS.receiptPaymentProjectSelf,
        HOME_UTILITY_KEYS.receiptPaymentProjectCompany,
      ],
      toggleUtility: (key) =>
        set((state) => {
          // toggle functionality
          const isUtilitySelected = state.selectedUtilities.includes(key);
          // if the utility is already selected, remove it
          if (isUtilitySelected) {
            return {
              selectedUtilities: state.selectedUtilities.filter(
                (utility) => utility !== key
              ),
            };
          }
          // if the utility is not selected, add it to the list
          else {
            return {
              selectedUtilities: [...state.selectedUtilities, key],
            };
          }
        }),
      setUtilities: (utilities) => set({ selectedUtilities: utilities }),
      resetUtilities: () => set({ selectedUtilities: [] }),
    }),
    {
      name: STORAGE_KEYS.homeUtilities,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
