"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="ml-auto mr-auto mt-[10%] flex max-w-[50%] flex-col space-y-3.5">
      <h2>Not Found</h2>
      <p>Could not find requested resource please try to log in</p>
      <Button variant="secondary" onClick={() => signIn("discord")}>
        Login
      </Button>
    </div>
  );
}
