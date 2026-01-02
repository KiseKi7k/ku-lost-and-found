"use client";

import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { LogOut, User } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { AvatarImage } from "./ui/avatar";

const mockUser = {
  name: "Ayaya",
  email: "socoolemail@gmail.com",
  image: undefined,
};

const Header = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSignOut = () => {
    setIsPopoverOpen(false);
    redirect("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border px-4 py-3 md:px-6 bg-card">
      <div className="flex items-center justify-between gap-4">
        {/* Left side - Sidebar trigger on mobile */}
        <div className="flex items-center gap-3 md:hidden">
          <SidebarTrigger className="text-foreground hover:bg-muted rounded-md p-2 transition-colors" />
        </div>

        {/* Right side - Profile */}
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Avatar className="border-2 border-primary/20 relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all ml-auto">
              <AvatarImage src={mockUser.image} />
              <AvatarFallback className="bg-primary text-primary-foreground font-medium flex h-full items-center justify-center rounded-full">
                <User className="h-5 w-5 text-white" />
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent
            className="w-48 p-2 animate-scale-in bg-popover border border-border shadow-soft rounded-xl"
            align="end"
          >
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              ออกจากระบบ
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Header;
