/* eslint-disable*/
import "../output.css";
import { FaSun, FaMoon, FaBars } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronsUp, UserPen, Calculator, Users } from "lucide-react";
import { useEffect, useState } from "react";

const Header = ({ toggleTheme, currentTheme, className }) => {
  const location = useLocation(); //keeps a persistent value on url params
  const navigate = useNavigate();
  const [tab, setTab] = useState(location.pathname);

  const handleChange = (value) => {
    navigate(value);
  };

  useEffect(() => {
    if (/\/\d+/.test(location.pathname)) {
      setTab("/"); // Update the tab when the route changes
    } else {
      setTab(location.pathname);
    }
  }, [location]);

  return (
    <header
      className={`header flex items-center p-8 gap-8 justify-between w-screen ${className}`}
    >
      <div className="left-header-icon flex gap-4 items-center">
        <div className="flex items-center">
          <div className="title space-y-1">
            <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-2xl">
              Team Metrics Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Mock Performance Visual Tool
            </p>
          </div>
        </div>
        <Separator orientation="vertical" className="h-[50px]" />
        <div className="flex gap-2 items-center text-sm text-muted-foreground">
          Velocity Project
          <ChevronsUp />
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-4 right-header-icon cursor-pointer">
        <Tabs value={tab} onValueChange={handleChange}>
          <TabsList>
            <TabsTrigger className="flex gap-2" value="/">
              <UserPen />
              <div className={`hidden lg:block`}>Search</div>
            </TabsTrigger>
            <TabsTrigger className="flex gap-2" value="/team">
              <Users />
              <div className={`hidden lg:block`}>How to Use</div>
            </TabsTrigger>
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
