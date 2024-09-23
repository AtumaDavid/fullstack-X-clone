import Image from "next/image";
import MenuBar from "./MenuBar";
import PostEditor from "@/components/posts/editor/PostEditor";
import prisma from "@/lib/prisma";
import Posts from "@/components/posts/Posts";
import { PostsDataInclude } from "@/lib/types";

export default async function Home() {
  const posts = await prisma.post.findMany({
    // include: {
    //   user: {
    //     select: {
    //       username: true,
    //       displayName: true,
    //       avatarUrl: true,
    //     },
    //   },
    // },
    include: PostsDataInclude,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="w-full min-w-0">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {posts.map((post) => (
          <Posts key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
