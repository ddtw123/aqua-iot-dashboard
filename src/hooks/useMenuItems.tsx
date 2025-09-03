import { CircleGauge, LayoutDashboard, Settings, Siren, Home as HomeIcon, Map } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

export interface MenuItems {
  title: string;
  icon: JSX.Element;
  href: string;
  onClick: () => void;
}

export const useMenuItems = () => {
  const router = useRouter();
  const pathname = usePathname() || '/';
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
    const commonHome: MenuItems = {
      title: "sidebar.home",
      icon: <HomeIcon className="h-6 w-6" />,
      href: `/`,
      onClick: () => router.push(`/`),
    };

    const globalMap: MenuItems = {
      title: "sidebar.map",
      icon: <Map className="h-6 w-6" />,
      href: `/map`,
      onClick: () => router.push(`/map`),
    };

    if (!currentPondId) {
      return [commonHome, globalMap];
    }

    return [
      commonHome,globalMap,
      {
        title: "sidebar.dashboard",
        icon: <LayoutDashboard className="h-6 w-6" />,
        href: `/${currentPondId}/dashboard`,
        onClick: () => router.push(`/${currentPondId}/dashboard`),
      },
      {
        title: "sidebar.data",
        icon: <CircleGauge className="h-6 w-6" />,
        href: `/${currentPondId}/dashboard-detail`,
        onClick: () => router.push(`/${currentPondId}/dashboard-detail`),
      },
      {
        title: "sidebar.alerts",
        icon: <Siren className="h-6 w-6" />,
        href: `/${currentPondId}/alerts`,
        onClick: () => router.push(`/${currentPondId}/alerts`),
      },
      {
        title: "sidebar.threshold",
        icon: <Settings className="h-6 w-6" />,
        href: `/${currentPondId}/threshold-settings`,
        onClick: () => router.push(`/${currentPondId}/threshold-settings`),
      }
    ];
  }, [router, currentPondId]);

  return menuItems;
};
