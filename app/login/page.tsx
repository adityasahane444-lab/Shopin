"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Lock, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useShopin } from "@/components/ShopinProvider";
export default function Login() {
  const { login, register } = useShopin();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("demo@shopin.in");
  const [password, setPassword] = useState("shopin123");
  const [msg, setMsg] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const r =
      mode === "login"
        ? login(email, password)
        : register(name, email, password);
    setMsg(r.message);
    if (r.ok) router.push("/");
  };
  return (
    <div className="auth-page">
      <div className="auth-visual">
        <img src="/hero-3.svg" alt="Shopin" />
        <div>
          <span className="eyebrow">WELCOME TO SHOPIN</span>
          <h1>
            Everything you need.
            <br />
            One account away.
          </h1>
          <p>
            Secure sign-in, faster checkout, saved addresses, orders and
            personalized shopping.
          </p>
        </div>
      </div>
      <div className="auth-card">
        <img src="/brand/shopin-logo.svg" alt="Shopin" className="auth-logo" />
        <h2>
          {mode === "login" ? "Welcome back" : "Create your Shopin account"}
        </h2>
        <p className="muted">
          {mode === "login"
            ? "Use the demo account or your own registered account."
            : "Join Shopin and make checkout faster."}
        </p>
        {msg && <div className="notice">{msg}</div>}
        <form onSubmit={submit}>
          {mode === "register" && (
            <label>
              <span>Name</span>
              <div className="input-wrap">
                <UserRound />
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
            </label>
          )}
          <label>
            <span>Email</span>
            <div className="input-wrap">
              <Mail />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </label>
          <label>
            <span>Password</span>
            <div className="input-wrap">
              <Lock />
              <input
                required
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>
          </label>
          <button className="btn btn-primary full btn-lg">
            {mode === "login" ? "Login securely" : "Create account"}
          </button>
        </form>
        {mode === "login" && (
          <div className="demo-box">
            <b>Demo customer</b>
            <span>demo@shopin.in · shopin123</span>
            <b>Demo admin</b>
            <span>admin@shopin.in · admin123</span>
          </div>
        )}
        <button
          className="switch-auth"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setMsg("");
          }}
        >
          {mode === "login"
            ? "New to Shopin? Create an account"
            : "Already have an account? Login"}
        </button>
        <div className="auth-trust">
          <ShieldCheck size={16} /> Your local demo account data stays in this
          browser.
        </div>
        <Link href="/" className="back-home">
          ← Back to shopping
        </Link>
      </div>
    </div>
  );
}
