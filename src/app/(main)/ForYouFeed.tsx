"use client";
import Posts from "@/components/posts/Posts";
import kyInstance from "@/lib/ky";
import { PostData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";

export default function ForYouFeed() {
  const query = useQuery<PostData[]>({
    queryKey: ["post-feed", "for you"],
    // queryFn: async () => {
    //   const response = await fetch("/api/posts/for-you");
    //   if (!response.ok) {
    //     throw Error(`Request faile with staus code ${response.status}`);
    //   }
    //   return response.json();
    // },
    queryFn: kyInstance.get("/api/posts/for-you").json<PostData[]>,
  });

  if (query.status === "pending") {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  if (query.status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occured while loading posts
      </p>
    );
  }
  return (
    <div className="space-y-5">
      {query.data.map((post) => (
        <Posts key={post.id} post={post} />
      ))}
    </div>
  );
}
