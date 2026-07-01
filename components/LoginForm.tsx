"use client";

import { useActionState } from "react";
import { signIn } from "@/lib/actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, undefined);

  const inputClass =
    "w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent";

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
        className="w-full rounded-md bg-accent px-4 py-2.5 font-semibold text-[color:var(--on-accent)] transition-opacity active:opacity-80 disabled:opacity-60"
      >
        {pending ? "Prijava…" : "Prijavi se"}
      </button>
    </form>
  );
}
