import "../output.css";
import { FaSun, FaMoon, FaBars } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ChevronsUp } from "lucide-react";
import { useEffect, useState } from "react";

const Header = ({ sidebarToggle, toggleTheme, currentTheme }) => {
  const [tab, setTab] = useState(null);
  const navigate = useNavigate();

  const handleChange = (value) => {
    setTab(value);
  };

  useEffect(() => {
    console.log(tab);
    navigate(tab);
  }, [tab]);

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
        <div className="flex gap-2 items-center text-sm text-muted-foreground">
          Velocity Project
          <ChevronsUp />
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-8 right-header-icon cursor-pointer">
        <Tabs value={tab} onValueChange={handleChange} className="w-[450px]">
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
