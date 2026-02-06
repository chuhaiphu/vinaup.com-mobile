export interface ModalStore {
  isOpen: boolean;
  editingId: string;
  mode: 'create' | 'update' | 'delete';
  setCreateMode: () => void;
  setEditMode: (id: string) => void;
  setDeleteMode: (id: string) => void;
  closeModal: () => void;
}