"use client";
import useScrollTo from "@/hooks/useScrollTo";
import { fadeInYEnd, fadeTransition } from "@/util/constant";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import HamburgerButton from "./HamburgerButton";
import MobileNavigation from "./MobileNavigation";

export default function HeaderNavigation() {
  const [showMenu, setShowMenu] = useState(false);
  const handleToggleMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };
  return (
    <div className="absolute top-0 z-50 w-full px-4 md:px-8" id="header">
      <div className="relative z-[6] flex w-full flex-row items-center justify-between p-4 lg:hidden">

        <HamburgerButton
          handleToggleMenu={handleToggleMenu}
          showMenu={showMenu}
        />
      </div>

      <DesktopNavigationBar />

      <MobileNavigation
        handleToggleMenu={handleToggleMenu}
        setShowMenu={setShowMenu}
        showMenu={showMenu}
      />
    </div>
  );
}

export const DesktopNavigationBar = () => {
  const { t } = useTranslation();
  const { scrollTo } = useScrollTo();
  const pathname = usePathname();
  const router = useRouter();

  const isActiveLink = (link: string) => {
    return link === "/" ? pathname === link : pathname.startsWith(link);
  };

  return (
    <motion.header
      className="container mx-auto hidden flex-row items-center justify-between bg-transparent py-5 lg:flex"
      initial={{ opacity: 0, y: 0 }}
      whileInView={fadeInYEnd}
      transition={fadeTransition}
      viewport={{ once: true }}
    >
      {/* <div className="flex w-1/3 items-center justify-start">
        <Logo />
      </div> */}

      <div className="flex w-2/3 items-center justify-end">
        <nav className="flex flex-row items-center gap-8 text-center 2xl:gap-[40px]">
          {NavigationLink.map(link => (
            <div
              key={link.id}
              className="relative flex flex-col items-center justify-center"
            >
              {isActiveLink(link.link) && (
                <div className="absolute -top-6 h-[20px] w-[20px]">
                  <Image
                    src="/img/gold-leaf.webp"
                    alt="Active Tab Leaf"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
              <Link
                //determine whether is scroll or link to another page
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
                className={`group relative cursor-pointer font-poppins_bold font-normal text-gold duration-300 lg:text-h5MD xl:text-h4LG ${
                  link.link === "/"
                    ? pathname === link.link
                      ? "text-gold"
                      : "text-white hover:text-gold/80"
                    : pathname.startsWith(link.link)
                      ? "text-gold"
                      : "text-white hover:text-gold/80"
                }`}
              >
                {t(link.title)}
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </motion.header>
  );
};

export const NavigationLink = [
  { id: "home", title: "navigation.home", isHome: false, link: "/" },
];