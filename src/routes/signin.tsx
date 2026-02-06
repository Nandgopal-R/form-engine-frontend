import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

export const Route = createFileRoute('/signin')({
    component: Login,
})

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("All fields are required");
            return;
        }

        const validation = loginSchema.safeParse({ email, password });
        if (!validation.success) {
            setError(validation.error.errors[0].message);
            return;
        }

        await authClient.signIn.email({
            email,
            password,
        }, {
            onRequest: () => {
                setLoading(true);
            },
            onSuccess: () => {
                window.location.href = "/";
            },
            onError: (ctx) => {
                setLoading(false);
                setError(ctx.error.message);
            },
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#F3F1FA] text-[#2D2B32]">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-[#6D28D9]">FormEngine</h1>

            <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-xl border border-purple-100">
                <h2 className="mb-1.5 text-2xl font-bold text-[#1F1D2B]">Sign in</h2>
                <p className="mb-5 text-sm text-gray-500">
                    Enter your credentials to access your account
                </p>

                {error && <p className="mb-4 text-sm text-red-600 font-medium">{error}</p>}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="mb-1.5 block text-[13px] font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-[10px] border border-gray-200 bg-white p-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-[13px] font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-[10px] border border-gray-200 bg-white p-3 pr-11 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                            />
                            {password.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-purple-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 flex w-full justify-center rounded-[10px] bg-purple-600 p-3 font-medium text-white transition-all hover:bg-purple-700 disabled:opacity-70 shadow-md shadow-purple-600/20"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="w-full rounded-[10px] border border-gray-200 bg-white p-3 font-medium text-gray-700 transition-colors hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200"
                    onClick={async () => {
                        try {
                            await authClient.signIn.social({
                                provider: "google",
                                callbackURL: "http://localhost:3000"
                            });
                        } catch (err: any) {
                            console.error("Google Signin Error:", err);
                            alert("Google Signin Failed: " + (err.message || JSON.stringify(err)));
                        }
                    }}
                >
                    Sign in with Google
                </button>

                <p className="mt-6 text-center text-[13px] text-gray-500">
                    Don’t have an account? <Link to="/signup" className="text-purple-600 font-semibold hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
