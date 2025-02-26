import useScrollTo from "@/hooks/useScrollTo";
import { gsap } from "gsap";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { NavigationLink } from "./HeaderNavigation";

const HeaderNavigation = ({
  showMenu,
  setShowMenu,
  handleToggleMenu,
}: {
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  handleToggleMenu: (e: React.MouseEvent<HTMLElement>) => void;
}) => {
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const pathname = usePathname();
  const { scrollTo } = useScrollTo();
  const router = useRouter();

  useEffect(() => {
    const el = burgerMenuRef.current;
    const button = document.getElementById("nav-icon3");
    if (showMenu) {
      gsap.set(el, { display: "block" });
      gsap.to(el, {
        duration: 0.3,
        translateX: 0,
        ease: "power1.inOut",
        onComplete: () => {
          // document.documentElement.style.overflowY = "hidden"; //
        },
      });
      button?.classList.add("open");
    } else {
      gsap.to(el, {
        duration: 0.3,
        translateX: "100vw",
        ease: "power1.inOut",
        onComplete: () => {
          gsap.set(el, { display: "none" });
        },
      });
      button?.classList.remove("open");
      // document.documentElement.style.overflowY = "auto";
    }
  }, [showMenu]);

  return (
    <div
      ref={burgerMenuRef}
      className="fixed bottom-0 left-0 right-0 top-0 z-[5] w-full translate-x-[100vw] bg-white pt-[80px] text-left"
    >
      <div
        onClick={() => {
          setShowMenu(!showMenu);
        }}
        className="h-full w-full"
      >
        <div className="flex h-full flex-col justify-between">
          <div
            className="w-full"
            onClick={e => {
              e.stopPropagation();
              handleToggleMenu(e);
            }}
          >
            <div className="text-left">
              {NavigationLink.map(link => (
                <div
                  key={link.id}
                  className="cursor-pointer border-b py-7 first:border-t"
                >
                  <div className="h-[1px] w-full"></div>
                  <Link
                    //determine whether is scroll or link to another page
                    key={link.id}
                    href={link.isHome ? `#${link.id}` : link.link}
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      if (link.isHome) {
                        e.preventDefault();
                        router.push(link.link);
                        setTimeout(() => {
                          scrollTo(link.id);
                        }, 500);
                      }
                    }}
                    className={`group relative ml-7 cursor-pointer font-poppins_bold text-buttonLG text-gold duration-300 ${
                      link.link === "/"
                        ? pathname === link.link
                          ? "text-gold"
                          : "text-black/75 hover:text-gold/80"
                        : pathname.startsWith(link.link)
                          ? "text-gold"
                          : "text-black/75 hover:text-gold/80"
                    }`}
                  >
                    {t(link.title)}
                  </Link>
                </div>
              ))}
              <div className="h-[1px] w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(HeaderNavigation), {
  ssr: false,
});
