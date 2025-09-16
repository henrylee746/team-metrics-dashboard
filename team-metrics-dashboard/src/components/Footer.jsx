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
  <footer className="flex justify-center items-center p-4 mt-16">
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">About this tool</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Velocity Project</DialogTitle>
          <DialogDescription>Henry Lee - Personal Project.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  </footer>
);

export default Footer;
