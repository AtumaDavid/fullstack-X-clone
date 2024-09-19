import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import SessionProvider from "./SessionProvider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();
  // Call `validateRequest` to validate the current user's session.
  // This function interacts with the authentication layer to check if the user is logged in.

  if (!session.user) redirect("/login");

  return <SessionProvider value={session}>{children}</SessionProvider>;
  // If the session is valid, the `SessionProvider` wraps the children components,
  // passing the session and user information to them as context.
}
