import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./session-provider";
import Navbar from "./navbar";
import MenuBar from "./menu-bar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-4 p-4">
          <MenuBar className="bg-card sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-lg px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
          {children}
        </div>
        <MenuBar className="bg-card sticky bottom-0 flex w-full justify-center gap-5 border-t p-3 sm:hidden" />
      </div>
    </SessionProvider>
  );
}
