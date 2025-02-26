import { motion } from "framer-motion";
import { useState } from "react";
import "./hamburger.css";

const HamburgerButton = ({
  handleToggleMenu,
}: {
  handleToggleMenu: (e: React.MouseEvent<HTMLElement>) => void;
  showMenu: boolean;
}) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!isButtonDisabled) {
      setIsButtonDisabled(true);
      handleToggleMenu(e);

      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 250); // Enable the button after 1 second (adjust the delay as needed)
    }
  };

  return (
    <motion.button
      className="flex items-center justify-center p-2 md:p-3"
      onClick={handleClick}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      type="button"
      aria-label="hamburber menu button"
    >
      <div className="navbar-burger text-coco-500 flex h-[21px] w-[23px] flex-col items-center gap-[0.15rem]">
        <div id="nav-icon3" className="h-full w-full">
          <span className="h-[4px] lg:h-[7.5px]"></span>
          <span className="h-[4px] lg:h-[7.5px]"></span>
          <span className="h-[4px] lg:h-[7.5px]"></span>
          <span className="h-[4px] lg:h-[7.5px]"></span>
        </div>
      </div>
    </motion.button>
  );
};

export default HamburgerButton;
