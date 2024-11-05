import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface DetailDialogProps {
  titleColor?: string;
  title: string;
  description?: string;
  triggerText: string;
  children?: ReactNode; // Custom content inside the dialog
  className?: string; // Custom className for DialogTrigger
}

const DetailDialog = ({
  titleColor,
  title,
  description,
  triggerText,
  children,
  className,
}: DetailDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className={`${className}`}>{triggerText}</span>
      </DialogTrigger>
      <DialogContent className="max-w-[450px] max-h-[300px] h-[300px] w-full">
        <DialogHeader>
          <DialogTitle className={`${titleColor} font-medium text-md`}>
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children && <div>{children}</div>}
      </DialogContent>
    </Dialog>
  );
};

export default DetailDialog;
