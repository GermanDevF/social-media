import { Metadata } from "next";
import signupImage from "@/assets/signup-image.jpg";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Crea una cuenta en nuestra plataforma",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="bg-card flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-lg shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-primary text-3xl font-bold">Crear cuenta</h1>
            <p className="text-muted-foreground">
              Crea una cuenta para acceder a todas las funcionalidades.
            </p>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <p className="text-center">
              <Link href="/login" className="text-primary hover:underline">
                Ya tengo una cuenta, Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
        <Image
          src={signupImage}
          alt="Signup Image"
          className="hidden w-1/2 object-cover md:block"
          priority
        />
      </div>
    </main>
  );
}
