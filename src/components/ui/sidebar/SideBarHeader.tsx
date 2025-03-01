import React from "react";
import { useRouter } from "next/navigation";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { motion } from "framer-motion";

interface SideBarHeaderProps {
  isCollapsed: boolean;
}

export default function SideBarHeader({ isCollapsed }: SideBarHeaderProps) {
  const router = useRouter();
  return (
    <div className="border-b border-gray-700">
      <div
        className={`flex ${
          isCollapsed ? "flex-col items-center" : "flex-col items-center px-4"
        } py-2`}
      >
        {/* Company Image/Logo */}
        <div
          className={`${
            isCollapsed ? "h-8 w-8" : "h-28 w-28"
          } mb-4 cursor-pointer overflow-hidden rounded-lg`}
          onClick={() => router.push("/")}
        >
            <div
              className={`relative h-full w-full items-center rounded-lg ${isCollapsed ? "-ml-1" : "ml-0"}`}
            >
              <Image
                src="/img/default-user.webp"
                fill
                alt="Default User"
                className="object-cover p-1"
              />
            </div>
        </div>

        {/* User Welcome Text */}
        {!isCollapsed && (
          <div className="mb-2 flex flex-col text-center text-base">
            <span className="text-gray-300">Welcome!</span>
          </div>
        )}
      </div>
    </div>
  );
}
