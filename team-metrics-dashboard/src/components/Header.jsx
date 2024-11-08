import "../output.css";
import { FaSun, FaMoon, FaBars } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";

const Header = ({ sidebarToggle, toggleTheme, currentTheme }) => (
  <header className="header flex items-center p-8 justify-between w-screen">
    <div className="left-header-icon flex gap-5 items-center ">
      <FaBars
        className="menu-icon cursor-pointer"
        onClick={sidebarToggle}
      ></FaBars>
      <div className="flex items-center space-x-4">
        <div className="title space-y-1">
          <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-2xl">
            Team Metrics Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">Ericsson Canada</p>
        </div>
      </div>
    </div>
    <div className="right-header-icon cursor-pointer" onClick={toggleTheme}>
      {currentTheme == "dark" ? (
        <FaSun className="toggle-icon w-6 h-6"></FaSun>
      ) : (
        <FaMoon className="toggle-icon"></FaMoon>
      )}
    </div>
  </header>
);

export default Header;
