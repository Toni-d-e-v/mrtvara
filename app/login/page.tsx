import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/");

  return (
    <div className="space-y-5 pt-6">
      <div className="text-center">
        <h1 className="text-xl font-extrabold">Admin prijava</h1>
        <p className="mt-1 text-sm text-muted">
          Samo admin može unositi utakmice, golove i igrače.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
