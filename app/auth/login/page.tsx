"use client";

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
    <div className="flex flex-row h-screen w-full">
      <div className="flex flex-col p-[48px] w-[80%]">
        <Image
          src={assets.backOfficeLogo}
          alt="logo"
          width={150}
          height={75}
          objectFit="contain"
        />
        <p className="mt-[120px] text-hint-text-color">Welcome back 👋</p>
        <h2>Sign in to Evolution</h2>
        <form
          className="mt-[64px] flex flex-col gap-[16px]"
          onSubmit={onSubmit}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
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
            className="primary-button mt-[48px]"
            disabled={email === "" || password === "" || isPending}
          >
            {isPending ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>
      </div>
      <div className="relative w-full h-full">
        <Image
          src={assets.loginBg}
          alt="login background"
          fill
          objectFit="cover"
        />
      </div>
    </div>
  );
}
