import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { PostsDataInclude } from "@/lib/types";

export async function GET() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      include: PostsDataInclude,
      orderBy: { createdAt: "desc" },
    });

    return Response.json(posts);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Sever serror" }, { status: 500 });
  }
}
