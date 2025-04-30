import { Metadata } from "next";
import Bookmarks from "./bookmarks";
import TrendsSidebar from "@/components/trends-sidebar";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Bookmarks",
};

export default function BookmarksPage() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="bg-card rounded-lg p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">
            Publicaciones marcadas como favoritas
          </h1>
        </div>
        <Bookmarks />
      </div>
      <TrendsSidebar />
    </main>
  );
}
