import { CircleGauge, LayoutDashboard, Settings, Siren, Home as HomeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export interface MenuItems {
  title: string;
  icon: JSX.Element;
  onClick: () => void;
}

export const useMenuItems = () => {
  const router = useRouter();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const match = pathname.match(/^\/(.+?)\//);
  const currentPondId = match ? match[1] : undefined;

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
    const items: MenuItems[] = currentPondId ? [
      {
        title: "sidebar.home",
        icon: <HomeIcon className="h-6 w-6" />,
        onClick: () => router.push(`/`),
      },
      {
        title: "sidebar.dashboard",
        icon: <LayoutDashboard className="h-6 w-6" />,
        onClick: () => router.push(`/${currentPondId}/dashboard`),
      },
      {
        title: "sidebar.data",
        icon: <CircleGauge className="h-6 w-6" />,
        onClick: () => router.push(`/${currentPondId}/dashboard-detail`),
      },
      {
        title: "sidebar.alerts",
        icon: <Siren className="h-6 w-6" />,
        onClick: () => router.push(`/${currentPondId}/alerts`),
      },
      {
        title: "sidebar.threshold",
        icon: <Settings className="h-6 w-6" />,
        onClick: () => router.push(`/${currentPondId}/threshold-settings`),
      }
    ] : [];
    return items;
  }, [router, currentPondId]);

  return menuItems;
};
