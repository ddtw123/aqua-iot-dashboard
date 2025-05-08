import { CircleGauge, LayoutDashboard, Settings, Siren } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export interface MenuItems {
  title: string;
  icon: JSX.Element;
  onClick: () => void;
}

export const useMenuItems = () => {
  const router = useRouter();

  // const handleModalNavigation = useCallback(
  //   (action: () => void) => {
  //     const isHomePage = window.location.pathname === "/";

  //     if (!isHomePage) {
  //       router.push("/");
  //       setTimeout(() => {
  //         action();
  //       }, 100);
  //     } else {
  //       action();
  //     }
  //   },
  //   [router]
  // );

  const menuItems = useMemo(() => {
    const items: MenuItems[] = [
      {
        title: "sidebar.dashboard",
        icon: <LayoutDashboard className="h-6 w-6" />,
        onClick: () => router.push("/"),
      },
      {
        title: "sidebar.data",
        icon: <CircleGauge className="h-6 w-6" />,
        onClick: () => router.push("/dashboard-detail"),
      },
      {
        title: "sidebar.alerts",
        icon: <Siren className="h-6 w-6" />,
        onClick: () => router.push("/alerts"),
      },
      {
        title: "sidebar.threshold",
        icon: <Settings className="h-6 w-6" />,
        onClick: () => router.push("/threshold-settings"),
      }
    ];
    return items;
  }, [router]);

  return menuItems;
};
