import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import SessionProvider from "./SessionProvider";
import Navbar from "./Navbar";
import MenuBar from "./MenuBar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();
  // Call `validateRequest` to validate the current user's session.
  // This function interacts with the authentication layer to check if the user is logged in.

  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col border border-red-700">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 border border-red-700 p-5">
          <MenuBar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
          {children}
        </div>
        {/* mobile */}
        <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
      </div>
    </SessionProvider>
  );
  // If the session is valid, the `SessionProvider` wraps the children components,
  // passing the session and user information to them as context.
}
