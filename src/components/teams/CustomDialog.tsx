import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

interface CustomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText: string;
  cancelText: string;
  loading?: boolean; // Nueva prop para el estado de carga
  disabled?: boolean; // Nueva prop para deshabilitar el botón
}

export const CustomDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText,
  cancelText,
  loading = false,
  disabled = false, 
}: CustomDialogProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
          <Dialog.Description className="text-sm text-muted-foreground mt-2">
            {description}
          </Dialog.Description>
          <div className="mt-4 flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="outline" disabled={loading}>
                {cancelText}
              </Button>
            </Dialog.Close>
            <Button onClick={onConfirm} disabled={loading || disabled}>
              {loading ? "Loading..." : confirmText} {/* Muestra "Loading..." mientras carga */}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};