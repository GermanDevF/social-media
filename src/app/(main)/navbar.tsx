import UserButton from "@/components/user-button";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-card sticky top-0 z-10 shadow-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 py-3">
        <Link href="/" className="text-primary text-2xl font-bold">
          Cielos Viejo
        </Link>
        <UserButton />
      </div>
    </header>
  );
}
