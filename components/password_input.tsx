"use client";

import { Eye, EyeSlash } from "iconsax-reactjs";
import { useState } from "react";

export default function PasswordInput({ value, onChange }: { value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {

    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full pr-10" value={value} onChange={onChange} />
            <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-color cursor-pointer"
            >
                {showPassword ? <EyeSlash size="20" color="var(--text-color)" /> : <Eye size="20" color="var(--text-color)" />}
            </button>
        </div>
    );
}