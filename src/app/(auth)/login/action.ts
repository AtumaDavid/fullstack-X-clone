"use server";

import prisma from "@/lib/prisma";
import { LoginValues, loginSchema } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { verify } from "@node-rs/argon2";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  credentials: LoginValues,
): Promise<{ error: string }> {
  try {
    const { username, password } = loginSchema.parse(credentials);

    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive", //username with uppercase is effectively the same with username with lowercase
        },
      },
    });
    if (!existingUser || !existingUser.password) {
      return {
        error: "Incorrect Username or passwoord",
      };
    }
    const validPassword = await verify(existingUser.password, password, {
      memoryCost: 19456, //lucia docs
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    if (!validPassword) {
      return {
        error: "Incorrect Username or passwoord",
      };
    }

    // Create a session for the newly created user using Lucia.
    const session = await lucia.createSession(existingUser.id, {});

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
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Something went wrong please try again" };
  }
}
