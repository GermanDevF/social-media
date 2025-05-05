import { Metadata } from "next";
import Notifications from "./notifications";
import TrendsSidebar from "@/components/trends-sidebar";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Notifications",
};

export default function NotificationsPage() {
  return (
    <main className="top-[5.25rem] flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <h1 className="text-center text-xl font-bold">Notificaciones</h1>
        </div>
        <Notifications />
      </div>
      <TrendsSidebar />
    </main>
  );
}
