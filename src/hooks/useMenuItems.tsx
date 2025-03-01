import { Home, Plus, Computer, Upload, UserPlus, Folders } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

export interface MenuItems {
  title: string;
  icon: JSX.Element;
  onClick: () => void;
}

export const useMenuItems = () => {
  const router = useRouter();

  const handleModalNavigation = useCallback(
    (action: () => void) => {
      const isHomePage = window.location.pathname === "/";

      if (!isHomePage) {
        router.push("/");
        setTimeout(() => {
          action();
        }, 100);
      } else {
        action();
      }
    },
    [router]
  );

  const menuItems = useMemo(() => {
    const items: MenuItems[] = [
      {
        title: "Dashboard",
        icon: <Home className="h-6 w-6" />,
        onClick: () => router.push("/"),
      },
      {
        title: "Create IOT System",
        icon: <Plus className="h-6 w-6" />,
        onClick: () => router.push("/iotSystems/create"),
      },
    ];
    return items;
  }, [router, handleModalNavigation]);

  return menuItems;
};
