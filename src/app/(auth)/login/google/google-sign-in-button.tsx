"use client";

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "./icon";

export default function GoogleSignInButton() {
  console.log(process.env.NEXT_PUBLIC_BASE_URL);

  return (
    <Button
      variant="default"
      className="w-full bg-white text-black hover:bg-white/100 hover:text-black"
      asChild
    >
      <a href="/login/google" className="flex items-center gap-2">
        <GoogleIcon />
        <span>Iniciar sesión con Google</span>
      </a>
    </Button>
  );
}
