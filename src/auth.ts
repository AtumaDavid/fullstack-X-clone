import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import prisma from "./lib/prisma";
import { Lucia, Session, User } from "lucia";
import { cache } from "react";
import { cookies } from "next/headers";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

// Creating a new Lucia authentication instance, passing in the Prisma adapter and configuration options.
export const lucia = new Lucia(adapter, {
  // Configuring session cookies for authentication.
  sessionCookie: {
    expires: false,
    attributes: {
      // Secure cookie attributes are set based on whether the environment is production or not.
      secure: process.env.NODE_ENV === "production",
    },
  },
  // Defining how user attributes from the database (from `user` table) are transformed into a usable object.
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      username: databaseUserAttributes.username,
      displayName: databaseUserAttributes.displayName,
      googleId: databaseUserAttributes.googleId,
      avatarUrl: databaseUserAttributes.avatarUrl,
    };
  },
});

// Declaring a module augmentation for the `lucia` module,
// allowing TypeScript to understand that `Lucia` and `DatabaseUserAttributes` are customized types.
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

// Defining a TypeScript interface that represents the user attributes stored in the database.
interface DatabaseUserAttributes {
  id: string;
  username: string;
  displayName: String;
  googleId: String | null;
  avatarUrl: String | null;
}

// Creating a `validateRequest` function, which will be cached using React's `cache` utility for better performance.
/**
 "validateRequest" is responsible for creating an asynchronous function that checks if a user is currently authenticated by validating their session, 
 and it caches the result for performance optimization using React's cache utility.
 */
export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}

    return result;
  },
);

/** This code sets up authentication using the Lucia library, integrating Prisma for database interaction.
It defines how user attributes are mapped from the database and handles session management with cookies.
The validateRequest function checks if a session exists in the cookies and validates it, handling session cookies accordingly. */
