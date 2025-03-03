import { MenuItems } from "@/hooks/useMenuItems";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface SideBarContentProps {
  isCollapsed: boolean;
  menuItems: MenuItems[];
}

export default function SideBarContent({
  menuItems,
  isCollapsed,
}: SideBarContentProps) {
  const { t } = useTranslation();
  return (
    <div className="py-2">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className={`flex cursor-pointer items-center text-gray-300 transition-colors hover:bg-gray-800 hover:text-white duration-300`}
          onClick={() => {
            item.onClick();
          }}
        >
          <div className="ml-3 flex h-14 w-6 items-center justify-center">
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
    </div>
  );
}
