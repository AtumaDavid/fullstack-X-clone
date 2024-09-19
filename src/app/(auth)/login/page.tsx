import { Metadata } from "next";
import React from "react";
import loginImage from "@/assets/login-image.jpg";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";
// import LoginForm from "./LogInForm";

export const metadata: Metadata = {
  title: "Login",
};

export default function Login() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-muted-foreground">
              A place you can find a friend
            </p>
          </div>
          <div className="space-y-5">
            <LoginForm />
            <Link href="/signup" className="block text-center hover:underline">
              Don't have an account? Signup
            </Link>
          </div>
        </div>
        <Image
          src={loginImage}
          alt="login image"
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
