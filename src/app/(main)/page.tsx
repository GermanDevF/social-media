import PostEditor from "@/components/posts/editor/post-editor";
import TrendsSidebar from "@/components/trends-sidebar";
import ForYouFeed from "./for-you-feed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./following-feed";

export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-4">
      <div className="w-full min-w-0 space-y-4">
        <PostEditor />
        <Tabs defaultValue="for-you" className="gap-3">
          <TabsList>
            <TabsTrigger value="for-you">Para ti</TabsTrigger>
            <TabsTrigger value="following">Siguiendo</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSidebar />
    </main>
  );
}
