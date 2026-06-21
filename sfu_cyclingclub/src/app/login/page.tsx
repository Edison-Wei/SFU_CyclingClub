"use client"

// import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
    // const { status } = useSession();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if ("status" === "authenticated") {
            router.replace("/dashboard");
        }
    }, ["status", router])

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid Credentials");
                setLoading(false);
                return;
            }

            router.replace("/dashboard");
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred.");
            setLoading(false);
        }
    }


    if ("status" === "loading") {
        return (
            <div className="min-h-screen bg-base-100 flex flex-col justify-center items-center gap-4">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

return (
    <div className="grid place-items-center min-h-screen bg-base-100 text-base-content px-4 transition-colors duration-200">
      <div className="w-full max-w-md bg-base-200 p-6 md:p-8 rounded-box shadow-xl border border-base-300 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

        <header className="mb-6">
          <h1 className="text-3xl font-black text-primary uppercase tracking-tighter">Login</h1>
          <p className="text-xs text-primary mt-1 font-semibold tracking-wider uppercase">SFU Cycling Club Portal</p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
          <div className="form-control">
            <label className="label pl-0 pt-0">
              <span className="label-text font-bold text-xs uppercase tracking-wider text-base-content">SFU Email</span>
            </label>
            <input
              type="email"
              placeholder="username@sfu.ca"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input input-md bg-base-300 border-none rounded-field focus:outline-primary text-base-content placeholder:opacity-70"
            />
          </div>

          <div className="form-control">
            <label className="label pl-0 pt-0">
              <span className="label-text font-bold text-xs uppercase tracking-wider text-base-content">Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input input-md bg-base-300 border-none rounded-field focus:outline-primary text-base-content placeholder:opacity-70"
            />
          </div>

          {error && (
            <div className="alert alert-error text-xs font-semibold py-2 px-3 rounded-md mt-1 shadow-sm">
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || !email || !password}
            className="btn btn-primary w-full text-sm font-bold uppercase tracking-wider mt-2"
          >
            {loading ? <span className="loading loading-spinner loading-sm"></span> : "Sign In"}
          </button>

          {/* <div className="text-sm mt-2 text-right">
            <Link className="text-secondary hover:text-primary transition-colors underline font-medium" href="/SignUp">
              Don&apos;t have an account? Sign Up
            </Link>
          </div> */}

          <div className="mt-4 p-4 bg-base-300/60 rounded-box border border-base-300 text-center text-xs font-medium text-base-content/80">
            🔒 Executives only for now! <br/>
            <span className="text-secondary font-semibold">Club Members coming soon :)</span>
          </div>

        </form>
      </div>
    </div>
  );
}