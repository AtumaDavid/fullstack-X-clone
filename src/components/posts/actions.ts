// server action to delete post

"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { PostsDataInclude } from "@/lib/types";

export async function deletePost(id: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const post = await prisma.post.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });

  if (!post) throw new Error("post not found");
  // if (post.id !== user.id) throw new Error("Unauthorized");
  if (post.userId !== user.id) throw new Error("Unauthorized");

  const deletedPost = await prisma.post.delete({
    where: { id },
    include: PostsDataInclude,
  });

  return deletedPost;
}
