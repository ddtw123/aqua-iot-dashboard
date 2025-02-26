export default function useScrollTo() {
    const scrollTo = (id: string) => {
      const section = document.getElementById(id);
  
      if (!section) {
        throw new Error("Not able to find scrollTo element.");
      }
  
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };
  
    return { scrollTo };
}
  