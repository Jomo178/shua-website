"use client";

import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useMultiSidebar } from "./multisidebar";
import { useSidebar } from "./sidebar";

interface SidebarToggleProps {
  hiddenOnMobile?: boolean;
}

export function SidebarToggle({ hiddenOnMobile }: SidebarToggleProps) {
  const { open, isMobile, setOpen, setOpenMobile, openMobile } = useSidebar();

  const setOpenSidebarHandler = () => {
    if (isMobile) {
      setOpenMobile?.(!openMobile);
    } else {
      setOpen?.(!open);
    }
  };

  return (
    <div
      className={cn(
        hiddenOnMobile ? "absolute -right-[27px] z-20" : "mr-1 mt-1",
        hiddenOnMobile && !isMobile ? "visible" : "",
        !hiddenOnMobile && isMobile ? "visible" : "",
        !hiddenOnMobile && !isMobile ? "invisible" : "",
        hiddenOnMobile && isMobile ? "invisible" : ""
      )}
    >
      <Button
        onClick={setOpenSidebarHandler}
        className="h-8 w-8 rounded-md"
        variant="outline"
        size="icon"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform duration-700 ease-in-out",
            open === false ? "rotate-180" : "rotate-0"
          )}
        />
      </Button>
    </div>
  );
}
