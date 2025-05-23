"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-red-400 hover:text-red-300 transition-colors hover:cursor-pointer"
    >
      Déconnexion
    </button>
  );
} 