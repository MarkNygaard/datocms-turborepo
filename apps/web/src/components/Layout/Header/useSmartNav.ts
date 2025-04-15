import { useEffect, useState } from "react";

export function useSmartNav(
  threshold = 0,
  stickyOffset = 96,
  unstickOffset = 36,
) {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [scrollY, setScrollY] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const diff = Math.abs(currentY - lastY);

      setScrollY(currentY);

      if (diff >= threshold) {
        setScrollDirection(currentY > lastY ? "down" : "up");
      }

      if (currentY > stickyOffset && !isSticky) {
        setIsSticky(true);
      } else if (currentY < unstickOffset && isSticky) {
        setIsSticky(false);
      }

      setLastY(currentY);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY, threshold, stickyOffset, unstickOffset, isSticky]);

  return {
    scrollDirection,
    isSticky,
    isHidden: scrollY >= stickyOffset,
    scrollY,
  };
}
