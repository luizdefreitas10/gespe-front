"use client";

import LoginForm from "@/components/LoginForm/loginForm";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 mt-6 sm:mt-8 md:mt-10 py-8 md:py-10">
      <LoginForm />
    </section>
  );
}
