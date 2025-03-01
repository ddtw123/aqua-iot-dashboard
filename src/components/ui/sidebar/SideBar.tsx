"use client";
import { MenuItems, useMenuItems } from "@/hooks/useMenuItems";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";
import SideBarHeader from "./SideBarHeader";
import SideBarContent from "./SidebarContent";

export default function SideBar({ hidden = false }: { hidden?: boolean }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuItems = useMenuItems();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const toggleSidebarCollapse = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <div
      style={{
        display: hidden ? "none" : "block",
      }}
    >
      <DesktopSideBar
        isCollapsed={isCollapsed}
        menuItems={menuItems}
        toggleSidebarCollapse={toggleSidebarCollapse}
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
    className="fixed inset-0 z-40 max-h-screen overflow-hidden bg-black/50 md:hidden"
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
    className="rounded-lg bg-black p-2 text-white transition-colors hover:bg-gray-700 md:hidden"
    style={{
      position: "fixed",
      // top: Math.max(20, 20 - scrollPosition),
      top: "1rem",
      right: "1rem",
      zIndex: 60,
    }}
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
            className="fixed right-0 top-0 z-50 h-full w-[250px] bg-black text-white shadow-xl md:hidden"
          >
            <div className="flex h-full flex-col">
              <SideBarHeader isCollapsed={false} />
              <SideBarContent isCollapsed={false} menuItems={menuItems} />
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
  toggleSidebarCollapse,
  menuItems,
}: {
  isCollapsed: boolean;
  toggleSidebarCollapse: () => void;
  menuItems: MenuItems[];
}) => {
  return (
    <motion.div
      initial={{ width: "60px" }}
      animate={{ width: isCollapsed ? "60px" : "280px" }}
      className={`hidden bg-black text-white md:block`}
      style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 40 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-full">
        <button
          onClick={toggleSidebarCollapse}
          className="absolute -right-5 top-44 rounded-full bg-gray-800 p-1 transition-colors duration-200 hover:bg-gray-700"
        >
          {isCollapsed ? (
            <ChevronRight className="h-6 w-6" />
          ) : (
            <ChevronLeft className="h-6 w-6" />
          )}
        </button>
        <div className="flex h-full flex-col">
          <SideBarHeader isCollapsed={isCollapsed} />
          <SideBarContent isCollapsed={isCollapsed} menuItems={menuItems} />

          {/* <div className="absolute bottom-0 left-0 w-full">
            <SideBarFooter isCollapsed={isCollapsed} />
          </div> */}
        </div>
      </div>
    </motion.div>
  );
};
