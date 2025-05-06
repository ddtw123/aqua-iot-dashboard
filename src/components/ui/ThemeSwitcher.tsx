import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { AspectRatio } from './aspect-ratio';

export default function ThemeSwitcher({ isCollapsed }: { isCollapsed?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <motion.button
        onClick={toggleTheme}
        className="flex flex-row gap-6 mt-auto mb-4 z-[2] p-1 transition md:p-3 group hover:bg-white dark:hover:bg-gray-800 duration-300"
    >
        <div className="w-[25px] overflow-hidden rounded-full border border-border">
            <AnimatePresence mode="wait">
                <AspectRatio>
                    {theme === 'dark' && (
                        <motion.div
                            className="relative h-full w-full"
                            initial={{ rotate: 0, opacity: 0.5 }}
                            animate={{ rotate: 360, opacity: 1 }}
                            exit={{ rotate: 0, opacity: 0.5 }}
                            transition={{ ease: "easeInOut", duration: 0.2, type: "tween" }}
                        >
                            <Image
                                fill
                                alt="lang"
                                src={"/img/moon.webp"}
                                sizes="200px"
                                className='bg-white'
                                unoptimized
                                priority
                            />
                        </motion.div>
                    )}   
                    {theme === 'light' && (
                        <motion.div
                            className="relative h-full w-full"
                            initial={{ rotate: 0, opacity: 0.5 }}
                            animate={{ rotate: 360, opacity: 1 }}
                            exit={{ rotate: 0, opacity: 0.5 }}
                            transition={{ ease: "easeInOut", duration: 0.2, type: "tween" }}
                        >
                            <Image
                                fill
                                alt="lang"
                                src={"/img/sunny.webp"}
                                sizes="200px"
                                className='bg-white'
                                unoptimized
                                priority
                            />
                        </motion.div>
                    )}
                </AspectRatio>
            </AnimatePresence>
        </div>
        {!isCollapsed && (
            <span className="text-white dark:text-black group-hover:text-black dark:group-hover:text-white whitespace-nowrap duration-300">
                {theme === 'dark' ? t('sidebar.darkMode') : t('sidebar.lightMode')}
            </span>
        )}
    </motion.button>
  );
}