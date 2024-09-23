import Image from "next/image";
import MenuBar from "./MenuBar";
import PostEditor from "@/components/posts/editor/PostEditor";
import prisma from "@/lib/prisma";
import Posts from "@/components/posts/Posts";
import { PostsDataInclude } from "@/lib/types";
import TrendsSidebar from "@/components/TrendsSidebar";
import ForYouFeed from "./ForYouFeed";

export default function Home() {
  // const posts = await prisma.post.findMany({
  //   // include: {
  //   //   user: {
  //   //     select: {
  //   //       username: true,
  //   //       displayName: true,
  //   //       avatarUrl: true,
  //   //     },
  //   //   },
  //   // },
  //   include: PostsDataInclude,
  //   orderBy: { createdAt: "desc" },
  // });

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {/* {posts.map((post) => (
          <Posts key={post.id} post={post} />
        ))} */}
        <ForYouFeed />
      </div>
      <TrendsSidebar />
    </main>
  );
}
