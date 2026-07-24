"use client";

import { useActionState } from "react";
import { signIn } from "@/lib/actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, undefined);

  const inputClass =
    "field";

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <label className="eyebrow mb-1.5 block text-[11px] text-muted">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className={inputClass}
        />
      </div>
      <div>
        <label className="eyebrow mb-1.5 block text-[11px] text-muted">
          Lozinka
        </label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>
      {state?.error && <p className="text-sm text-loss">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="btn transition-opacity active:opacity-80 disabled:opacity-60"
      >
        {pending ? "Prijava…" : "Prijavi se"}
      </button>
    </form>
  );
}
