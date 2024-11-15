import "../output.css";
import { FaSun, FaMoon, FaBars } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const Header = ({ sidebarToggle, toggleTheme, currentTheme }) => {
  const navigate = useNavigate();

  return (
    <header className="header flex items-center p-8 gap-8 justify-between w-screen">
      <div className="left-header-icon flex gap-4 items-center ">
        <div className="flex items-center">
          <div className="title space-y-1">
            <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-2xl">
              Team Metrics Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">Ericsson Canada</p>
          </div>
        </div>
        <Separator orientation="vertical" className="h-[50px]" />
        <div className="text-sm text-muted-foreground">Velocity Project</div>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-2 right-header-icon cursor-pointer ">
        <Tabs className="w-[450px]" defaultValue="/">
          <TabsList>
            <TabsTrigger value="/">Subject/Owner Search</TabsTrigger>
            <TabsTrigger value="/team">Team Search</TabsTrigger>
            <TabsTrigger value="/leadtime">Leadtime Calculator</TabsTrigger>
          </TabsList>
        </Tabs>
        {currentTheme == "dark" ? (
          <FaSun onClick={toggleTheme} className="toggle-icon w-6 h-6"></FaSun>
        ) : (
          <FaMoon onClick={toggleTheme} className="toggle-icon"></FaMoon>
        )}
      </div>
    </header>
  );
};

export default Header;
