/*eslint-disable*/
import "../output.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
const Footer = () => (
  <footer className="p-4 mt-16">
    <div className="flex justify-center w-full">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">About this tool</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>Velocity Project</DialogTitle>
            <DialogDescription>
              Please see "How to Use" at the Header if this is your first time.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  </footer>
);

export default Footer;
