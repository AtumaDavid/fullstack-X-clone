import { Prisma } from "@prisma/client";

export const PostsDataInclude = {
  user: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.PostInclude; //explain satisfies

export type PostData = Prisma.PostGetPayload<{
  include: typeof PostsDataInclude;
}>;
