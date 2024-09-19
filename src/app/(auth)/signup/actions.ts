"use server";
import { SignupValues, signUpSchema } from "@/lib/validation";
import { hash } from "@node-rs/argon2"; //next config
import { generateIdFromEntropySize } from "lucia";
import prisma from "@/lib/prisma";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function signUp(
  credentials: SignupValues,
): Promise<{ error: string }> {
  try {
    // Parse and validate the user input against the signup schema.
    const { email, username, password } = signUpSchema.parse(credentials);

    const passwordHash = await hash(password, {
      memoryCost: 19456, //lucia docs
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const userId = generateIdFromEntropySize(10);

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive", //username with uppercase is effectively the same with username with lowercase
        },
      },
    });
    if (existingUsername) {
      return {
        error: "Username already taken",
      };
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });
    if (existingEmail) {
      return {
        error: "Email already taken",
      };
    }
    /**create user */
    await prisma.user.create({
      data: {
        id: userId,
        username,
        displayName: username,
        email,
        password: passwordHash,
      },
    });

    /** */
    // Create a session for the newly created user using Lucia.
    const session = await lucia.createSession(userId, {});

    // Generate a session cookie for the session.
    const sessionCookie = lucia.createSessionCookie(session.id);

    // Set the session cookie in the user's browser.
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    // Redirect the user to the homepage after successful signup.
    return redirect("/");

    /** catch error (tryCatch) */
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Something went wrong" };
  }
}
