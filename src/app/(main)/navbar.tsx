import SearchField from "@/components/search-field";
import UserButton from "@/components/user-button";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-card sticky top-0 z-10 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 py-3">
        <Link href="/" className="text-primary text-2xl font-bold">
          Cielos Viejo
        </Link>
        <SearchField />
        <UserButton className="sm:ms-auto" />
      </div>
    </header>
  );
}
