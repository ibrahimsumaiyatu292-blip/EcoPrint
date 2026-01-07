import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen py-12">
      <SignIn afterSignInUrl="/dashboard" />
    </div>
  );
}
