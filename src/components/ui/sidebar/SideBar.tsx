"use client";
import { MenuItems, useMenuItems } from "@/hooks/useMenuItems";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import LanguageSwitcher from "../LanguageSwitcher";
import SideBarHeader from "./SideBarHeader";
import SideBarContent from "./SidebarContent";

export default function SideBar({ hidden = false }: { hidden?: boolean }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuItems = useMenuItems();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const handleMouseEnter = () => {
    setIsCollapsed(false);
  };

  const handleMouseLeave = () => {
    setIsCollapsed(true);
  };


  return (
    <div
      style={{
        display: hidden ? "none" : "block",
      }}
    >
      <DesktopSideBar
        isCollapsed={isCollapsed}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        menuItems={menuItems}
      />
      <MobileNavButton
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />
      <MobileSideBar
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        menuItems={menuItems}
      />
    </div>
  );
}

const MobileNavBackdrop = ({
  toggleMobileMenu,
}: {
  toggleMobileMenu: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-40 max-h-screen overflow-hidden bg-black/50 xl:hidden"
    onClick={toggleMobileMenu}
  />
);

const MobileNavButton = ({
  isMobileMenuOpen,
  toggleMobileMenu,
}: {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}) => (
  <button
    onClick={toggleMobileMenu}
    className="fixed top-7 right-5 z-50 rounded-lg bg-white p-2 text-black transition-colors hover:bg-gray-700 xl:hidden"
  >
    {isMobileMenuOpen ? (
      <X className="h-6 w-6" />
    ) : (
      <Menu className="h-6 w-6" />
    )}
  </button>
);

const MobileSideBar = ({
  isMobileMenuOpen,
  toggleMobileMenu,
  menuItems,
}: {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  menuItems: MenuItems[];
}) => {
  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <MobileNavBackdrop toggleMobileMenu={toggleMobileMenu} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed right-0 top-0 z-50 h-full w-[250px] bg-white text-black shadow-xl xl:hidden"
          >
            <div className="flex h-full flex-col">
              <SideBarHeader isCollapsed={false} />
              <SideBarContent isCollapsed={false} menuItems={menuItems} />
              <LanguageSwitcher isCollapsed={false} />
              {/* <div className="absolute bottom-0 left-0 w-full">
                <SideBarFooter isCollapsed={false} />
              </div> */}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const DesktopSideBar = ({
  isCollapsed,
  handleMouseEnter,
  handleMouseLeave,
  menuItems,
}: {
  isCollapsed: boolean;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  menuItems: MenuItems[];
}) => {

  return (
    <motion.div
      initial={{ width: "60px" }}
      animate={{ width: isCollapsed ? "60px" : "280px" }}
      className={`hidden bg-white text-black xl:block`}
      style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 40 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative h-full">
        <div className="flex h-full flex-col">
          <SideBarHeader isCollapsed={isCollapsed} />
          <SideBarContent isCollapsed={isCollapsed} menuItems={menuItems} />
          <LanguageSwitcher isCollapsed={isCollapsed} />
          {/* <div className="absolute bottom-0 left-0 w-full">
            <SideBarFooter isCollapsed={isCollapsed} />
          </div> */}
        </div>
      </div>
    </motion.div>
  );
};
