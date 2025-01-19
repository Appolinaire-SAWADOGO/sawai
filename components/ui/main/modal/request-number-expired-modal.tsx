"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UseRequestNumberExpiredModal } from "@/lib/actions/store/request-number-expired-modal";

export function RequestNumberExpiredModal() {
  const { isOpen, close } = UseRequestNumberExpiredModal();

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="w-full flex items-center justify-cente sm:max-w-[425px] bg-[#27282A] border-2 border-[#d8d8d8] border-opacity-25">
        <DialogTitle className="text-color text-3xl">Oups 🤭</DialogTitle>
        <div className="flex items-center w-full justify-center">
          <div className="flex items-center w-full justify-center">
            <p className="text-center text-color opacity-75">
              Your daily content generation limit has been reached; please come
              back tomorrow to continue creating!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
