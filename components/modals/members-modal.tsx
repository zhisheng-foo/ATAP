"use client"; // Ensure this is the first line

import { useModal } from "@/hooks/use-modal-store";

import { 
  Dialog, 
  DialogContent,  
  DialogHeader, 
  DialogTitle,
  DialogDescription, 
} from "@/components/ui/dialog";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";



export const MembersModal = () => {

  const { onOpen, isOpen, onClose, type, data } = useModal();
   
  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMembersWithProfiles};



  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt=8 px-6">
          <DialogTitle className="text-2xl text-center font-bold mt-4">
            Manage Members
          </DialogTitle>
          <DialogDescription
            className="text-center text-zinc-500"
          >
            {server?.members?.length} Members
          </DialogDescription>
          <ScrollArea className="mt-8 max-h-[420px] pr-6">
            {server?.members?.map((member) => (
              <div key={member.id} className="flex items-center gap-x-2 mb-6">
                <UserAvatar src={member.profile.imageUrl} />
              </div>
            ))}
          </ScrollArea>
         
        </DialogHeader>
          
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;
