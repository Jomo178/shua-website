"use client";

import { Button } from "@/components/ui/button";

import { fixItems } from "./action";

function Test() {
  return <Button onClick={() => fixItems()}>Enter</Button>;
}

export default Test;
