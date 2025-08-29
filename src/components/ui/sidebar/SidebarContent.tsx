import { MenuItems } from "@/hooks/useMenuItems";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";

interface SideBarContentProps {
  isCollapsed: boolean;
  menuItems: MenuItems[];
}

export default function SideBarContent({
  menuItems,
  isCollapsed,
}: SideBarContentProps) {
  const { t } = useTranslation();
  const pathname = usePathname() || "/";
  return (
    <>
      {menuItems.map((item, index) => (
        <div
          key={index}
          className={`flex cursor-pointer items-center transition-colors duration-300 ${
            pathname === item.href
              ? "bg-white text-black dark:bg-gray-900 dark:text-white"
              : "text-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-gray-800 dark:hover:text-white"
          }`}
          onClick={() => {
            item.onClick();
          }}
        >
          <div className="ml-4 flex h-14 w-6 items-center justify-center">
            {item.icon}
          </div>

          <motion.div
            initial={false}
            animate={{
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : "auto",
              display: isCollapsed ? "none" : "flex",
            }}
            transition={{
              duration: 0.2,
              display: { delay: isCollapsed ? 0.2 : 0 },
            }}
            className="items-center overflow-hidden"
          >
            <div
              className={`${
                isCollapsed ? "w-full justify-center p-3" : "px-6 py-3"
              } flex min-w-[300px] items-center`}
            >
              <span className="whitespace-nowrap">{t(item.title)}</span>
            </div>
          </motion.div>
        </div>
      ))}
    </>
  );
}
