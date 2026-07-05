"use client";

import BrandLogo from "@/components/logos/brand_logo";
import PasswordInput from "@/components/password_input";
import { loginAction } from "@/lib/features/auth/actions";
import { assets } from "@/lib/utils/assets";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await loginAction(email, password);
      if (!result.ok) {
        setError(result.message);
      }
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-8 md:w-[80%] md:justify-start md:px-12 md:py-12 lg:p-[48px]">
        <BrandLogo variant="backOffice" />
        <p className="mt-8 text-hint-text-color sm:mt-12 md:mt-[120px]">
          Welcome back 👋
        </p>
        <h2 className="text-xl sm:text-2xl">Sign in to Evolution</h2>
        <form
          className="mt-8 flex w-full max-w-md flex-col gap-4 md:mt-[64px] md:max-w-none"
          onSubmit={onSubmit}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            className="w-full"
          />
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link href="/forgot-password" className="text-link">
            Forgot password?
          </Link>
          {error && <p className="text-error text-sm">{error}</p>}
          <button
            type="submit"
            className="primary-button mt-6 w-full md:mt-[48px]"
            disabled={email === "" || password === "" || isPending}
          >
            {isPending ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>
      </div>
      <div className="relative hidden min-h-0 flex-1 md:block">
        <Image
          src={assets.loginBg}
          alt="login background"
          fill
          sizes="(min-width: 768px) 40vw, 0px"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
