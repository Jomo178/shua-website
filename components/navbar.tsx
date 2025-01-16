"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "./ui/button";

function Navbar() {
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex flex-shrink-0 items-center">
            <Image
              src="/images/shua.png"
              alt="Shua Bot"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="ml-2 text-xl font-semibold">Shua</span>
          </div>
          <div className="flex items-center">
            {!session?.user ? (
              <Button onClick={() => signIn("discord")}>Log in</Button>
            ) : (
              <DropdownMenu onOpenChange={setIsOpen}>
                <DropdownMenuTrigger className="inline-flex items-center rounded-md border border-transparent px-3 py-2 text-sm font-medium leading-4 transition duration-150 ease-in-out hover:text-gray-300 focus:outline-none">
                  <Image
                    src={session.user.image ?? "/images/shua.png"}
                    alt="Shua Bot"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="ml-2">{session.user.name}</span>
                  <ChevronDown
                    className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="cursor-pointer"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
