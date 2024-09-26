// import { userDataSelect } from './types';
import { Prisma } from "@prisma/client";

export function getUserDataFunctionSelect(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        posts: true,
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataFunctionSelect>;
}>;

export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataFunctionSelect(loggedInUserId),
    },
  } satisfies Prisma.PostInclude;
}

// // Define an object that specifies which fields to include when retrieving posts
// export const PostsDataInclude = {
//   // Include the user associated with each post

// }  // This object conforms to the Prisma.PostInclude interface

// Define a type for the post data that includes the specified fields
export type PostData = Prisma.PostGetPayload<{
  // The include object specifies which fields to include in the payload
  include: ReturnType<typeof getPostDataInclude>;
}>;

// The code is using Prisma, a popular ORM (Object-Relational Mapping) tool,
// to define a data model for posts. Specifically,
// it's defining an PostsDataInclude object that specifies which fields to include when retrieving posts from the database.
// The PostsDataInclude object is typed to satisfy the Prisma.PostInclude interface,
// which means it conforms to the expected shape of an include object for Prisma's Post model.

// The PostData type is then defined as the payload type of a Prisma query that includes the fields specified in PostsDataInclude.

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}

export interface FollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}
