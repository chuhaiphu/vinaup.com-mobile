import { create, StoreApi } from 'zustand';
import { ModalStore } from '@/interfaces/store-interfaces';

function createModalStore<T extends ModalStore>(
  overrides?: (set: StoreApi<T>['setState']) => Partial<T>
) {
  return create<T>(
    (set) =>
      ({
        isOpen: false,
        mode: 'create',
        editingId: '',
        setCreateMode: () =>
          set({ isOpen: true, mode: 'create', editingId: '' } as Partial<T>),
        setEditMode: (id: string) =>
          set({ isOpen: true, mode: 'update', editingId: id } as Partial<T>),
        setDeleteMode: (id: string) =>
          set({ isOpen: false, mode: 'delete', editingId: id } as Partial<T>),
        closeModal: () => set({ isOpen: false, editingId: '' } as Partial<T>),

        ...(overrides ? overrides(set) : {}),
      }) as T
  );
}

// ==== ORGANIZATION CUSTOMER MODAL STORE ====
export const useOrganizationCustomerModalStore = createModalStore();

// ==== ORGANIZATION CUSTOMER MODAL STORE ====
export const useOrganizationMemberModalStore = createModalStore();

// ==== ORGANIZATION MODAL STORE ====
export const useOrganizationModalStore = createModalStore();

// ==== PROJECT MODAL STORE ====
export const useProjectModalStore = createModalStore();

// ==== RECEIPT PAYMENT MODAL STORE ====
interface ReceiptPaymentModalStore extends ModalStore {
  preselectedDate?: Date;
  setPreselectedDate: (d: Date) => void;
}

export const useReceiptPaymentModalStore =
  createModalStore<ReceiptPaymentModalStore>((set) => ({
    preselectedDate: undefined,
    setPreselectedDate: (date: Date) => set({ preselectedDate: date }),
  }));

// ==== INVOICE MODAL STORE ====
export const useInvoiceModalStore = createModalStore();

// ==== TOUR MODAL STORE ====
export const useTourModalStore = createModalStore();

// ==== BOOKING MODAL STORE ====
export const useBookingModalStore = createModalStore();

// ==== CAR MODAL STORE ====
export const useCarModalStore = createModalStore();
