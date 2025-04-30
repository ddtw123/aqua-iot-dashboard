import { AnimatePresence, motion } from "framer-motion";
import Image from 'next/image';
import { useTranslation } from "react-i18next";
import { AspectRatio } from "../ui/aspect-ratio";
import { t } from "i18next";

function LanguageSwitcher({ isCollapsed }: { isCollapsed?: boolean }) {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "zh" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <motion.button
      onClick={toggleLanguage}
      className="flex flex-row gap-6 mt-auto mb-4 z-[2] p-1 transition md:p-3 group hover:bg-gray-800 duration-300"
    >
      <div className="w-[25px] overflow-hidden rounded-full border border-border">
        <AnimatePresence mode="wait">
          <AspectRatio>
            {i18n.language === "en" && (
              <motion.div
                className="relative h-full w-full"
                initial={{ rotate: 0, opacity: 0.5 }}
                animate={{ rotate: 360, opacity: 1 }}
                whileHover={{
                  scale: 1.1,
                  opacity: 0.8,
                }}
                exit={{ rotate: 0, opacity: 0.5 }}
                transition={{ ease: "easeInOut", duration: 0.2, type: "tween" }}
              >
                <Image
                  fill
                  alt="lang"
                  src={"/img/en.webp"}
                  sizes="200px"
                  unoptimized
                  priority
                />
              </motion.div>
            )}
            {i18n.language === "zh" && (
              <motion.div
                className="relative h-full w-full"
                initial={{ rotate: 0, opacity: 0.5 }}
                animate={{ rotate: 360, opacity: 1 }}
                whileHover={{
                  scale: 1.1,
                  opacity: 0.8,
                }}
                exit={{ rotate: 0, opacity: 0.5 }}
                transition={{ ease: "easeInOut", duration: 0.2, type: "tween" }}
              >
                <Image
                  fill
                  alt="lang"
                  src={"/img/zh.webp"}
                  sizes="200px"
                  unoptimized
                  priority
                />
              </motion.div>
            )}
          </AspectRatio>
        </AnimatePresence>
      </div>
      {!isCollapsed && (
            <span className="text-black whitespace-nowrap group-hover:text-white duration-300">
              {i18n.language === "en" ? t("sidebar.english") : t("sidebar.chinese")}
            </span>
        )}
    </motion.button>
  );
}

export default LanguageSwitcher;
