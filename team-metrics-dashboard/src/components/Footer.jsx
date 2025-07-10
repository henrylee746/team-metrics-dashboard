/*eslint-disable*/
import "../output.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Footer = () => (
  <footer className="flex justify-center items-center p-4 mt-16">
    <Dialog>
      <DialogTrigger>About This Tool</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How to use the tool</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  </footer>
);

export default Footer;
