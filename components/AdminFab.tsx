"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminPanel from "./AdminPanel";
import { usePresentations } from "@/hooks/usePresentations";

export default function AdminFab() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(false);
  const { presentations, refresh } = usePresentations();

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((r) => r.json())
      .then((j) => setIsAdmin(Boolean(j.isAdmin)))
      .catch(() => {});
  }, []);

  function handleFabClick() {
    if (isAdmin) {
      setShowPanel(true);
    } else {
      setShowLogin(true);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Password salah.");
      setIsAdmin(true);
      setShowLogin(false);
      setShowPanel(true);
      setPassword("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setChecking(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAdmin(false);
    setShowPanel(false);
  }

  return (
    <>
      <button
        onClick={handleFabClick}
        aria-label="Admin"
        className="fixed bottom-4 right-4 z-40 h-7 w-7 rounded-full bg-navy-900/15 hover:bg-navy-900/40 transition-colors flex items-center justify-center text-[10px] text-navy-900/40 hover:text-white"
      >
        ●
      </button>

      {showLogin && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 flex items-center justify-center p-5 animate-fade-in">
          <form
            onSubmit={handleLogin}
            className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-panel space-y-4"
          >
            <h2 className="font-display font-bold text-navy-900">Masuk sebagai Admin</h2>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-navy-100 px-3 py-2.5 text-sm"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowLogin(false);
                  setPassword("");
                }}
                className="flex-1 rounded-xl border border-navy-100 text-navy-500 py-2 text-sm font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={checking}
                className="flex-1 rounded-xl bg-navy-900 text-white py-2 text-sm font-semibold disabled:opacity-50"
              >
                {checking ? "..." : "Masuk"}
              </button>
            </div>
          </form>
        </div>
      )}

      {showPanel && (
        <AdminPanel
          presentations={presentations}
          onChanged={refresh}
          onClose={() => setShowPanel(false)}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
