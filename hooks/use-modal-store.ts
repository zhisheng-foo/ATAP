import { create } from "zustand";
import { Server } from "@prisma/client";

export type ModalType= "createServer" | "invite" | "editServer" | "members";

interface ModelData {
    server?: Server
}

interface ModalStore {
    type: ModalType | null;
    data: ModelData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModelData) => void;
    onClose: () => void;

}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data={}) => set({ isOpen: true, type, data }),
    onClose: () => set({ type: null, isOpen: false })
}));
