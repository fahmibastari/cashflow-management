"use client"

import { useActionState } from "react"
import { login } from "@/app/actions/auth"
import Link from "next/link"
import { Lock, User } from "lucide-react"

export default function LoginPage() {
    const [state, action, isPending] = useActionState(login, undefined)

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
            <div className="w-full max-w-sm flex flex-col gap-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
                    <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
                </div>

                <form action={action} className="card p-6 flex flex-col gap-4 bg-white shadow-sm border-slate-200">
                    {state?.error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm text-center">
                            {state.error}
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input name="username" type="text" placeholder="Username" className="input pl-9 bg-white border-slate-300 focus:border-indigo-500 text-slate-900" required />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input name="password" type="password" placeholder="••••••••" className="input pl-9 bg-white border-slate-300 focus:border-indigo-500 text-slate-900" required />
                        </div>
                    </div>

                    <button type="submit" disabled={isPending} className="btn btn-primary w-full mt-2">
                        {isPending ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
                        Register
                    </Link>
                </p>
            </div>
        </main>
    )
}
