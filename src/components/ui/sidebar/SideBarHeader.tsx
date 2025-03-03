import { useTranslation } from "react-i18next";

interface SideBarHeaderProps {
  isCollapsed: boolean;
}

export default function SideBarHeader({ isCollapsed }: SideBarHeaderProps) {
  const { t } = useTranslation();
  return (
    <div className="border-b border-gray-700">
      <div
        className={`flex ${
          isCollapsed ? "flex-col items-center" : "flex-col items-center px-4"
        } py-2`}
      >
        {!isCollapsed && (
          <div className="mb-2 flex flex-col text-center text-base">
            <span className="text-gray-300">{t("sidebar.title")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
