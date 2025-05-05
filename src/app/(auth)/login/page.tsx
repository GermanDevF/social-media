import { Metadata } from "next";
import Image from "next/image";
import loginImage from "@/assets/login-image.jpg";
import LoginForm from "./login-form";
import Link from "next/link";
import GoogleSignInButton from "./google/google-sign-in-button";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Inicia sesión en tu cuenta",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="bg-card flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-lg shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-primary text-3xl font-bold">Iniciar sesión</h1>
            <p className="text-muted-foreground">
              Inicia sesión para acceder a todas las funcionalidades.
            </p>
          </div>
          <div className="space-y-5">
            <GoogleSignInButton />
            <div className="flex items-center gap-3">
              <div className="bg-border h-px w-full" />
              <span className="text-muted-foreground">O</span>
              <div className="bg-border h-px w-full" />
            </div>
            <LoginForm />
            <p className="text-center">
              <Link href="/signup" className="text-primary hover:underline">
                Aun no tienes cuenta?, Crear cuenta
              </Link>
            </p>
          </div>
        </div>
        <Image
          src={loginImage}
          alt="Login Image"
          className="hidden w-1/2 object-cover md:block"
          priority
        />
      </div>
    </main>
  );
}
