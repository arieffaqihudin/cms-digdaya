import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
      setChecking(false);
    });

    // Also check hash for type=recovery
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    // Timeout fallback
    const timeout = setTimeout(() => setChecking(false), 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Masukkan password baru");
      return;
    }
    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password tidak cocok");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSuccess(true);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Memverifikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* LEFT — Brand panel */}
        <div className="hidden lg:flex lg:w-[45%] relative items-center justify-center bg-[hsl(150,16%,96%)] overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, hsl(152,45%,35%) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative z-10 flex flex-col items-center gap-6 px-12 text-center max-w-md">
            <img
              src="https://play-lh.googleusercontent.com/kfeQ0QFBny3AVurQ9r_CSBJyCfceAymEBlh9t6SIU_lZX0tH7WqYaTN7NHqrKGoQGNFEc3y8nj-iyw6IxqbEug=w480-h960-rw"
              alt="Digdaya Logo"
              className="w-24 h-24 rounded-2xl shadow-md"
            />
            <div className="space-y-2">
              <h1 className="text-xl font-semibold text-foreground tracking-tight">Digdaya Content CMS</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">Sistem Manajemen Konten Terpadu Digdaya</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0">
          <div className="w-full max-w-sm">
            {/* Mobile brand */}
            <div className="flex flex-col items-center gap-4 mb-10 lg:hidden">
              <img
                src="https://play-lh.googleusercontent.com/kfeQ0QFBny3AVurQ9r_CSBJyCfceAymEBlh9t6SIU_lZX0tH7WqYaTN7NHqrKGoQGNFEc3y8nj-iyw6IxqbEug=w480-h960-rw"
                alt="Digdaya Logo"
                className="w-16 h-16 rounded-xl shadow-sm"
              />
              <div className="text-center space-y-1">
                <h1 className="text-lg font-semibold text-foreground">Digdaya Content CMS</h1>
                <p className="text-xs text-muted-foreground">Sistem Manajemen Konten Terpadu</p>
              </div>
            </div>

            {/* Card */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-8">
              {success ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="h-12 w-12 rounded-full bg-[hsl(var(--status-success-bg))] flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-[hsl(var(--status-success-fg))]" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Password Berhasil Diubah</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                      Password Anda telah diperbarui. Silakan login dengan password baru.
                    </p>
                  </div>
                  <Link to="/login">
                    <Button className="w-full h-11 rounded-lg text-sm mt-2">
                      Masuk
                    </Button>
                  </Link>
                </div>
              ) : !isRecovery ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="h-12 w-12 rounded-full bg-[hsl(var(--status-danger-bg))] flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-[hsl(var(--status-danger-fg))]" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Link Tidak Valid</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                      Link reset password tidak valid atau sudah kadaluarsa. Silakan minta link baru.
                    </p>
                  </div>
                  <Link to="/forgot-password">
                    <Button variant="outline" className="w-full h-11 rounded-lg text-sm mt-2">
                      Minta Link Baru
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-foreground">Buat Password Baru</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Masukkan password baru untuk akun Anda
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Password Baru
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimal 6 karakter"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 h-11 bg-background"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Konfirmasi Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm"
                          type={showConfirm ? "text" : "password"}
                          placeholder="Ulangi password baru"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 pr-10 h-11 bg-background"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-11 text-sm font-medium rounded-lg" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        "Simpan Password Baru"
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>

            <p className="text-center text-xs text-muted-foreground mt-8">© Digdaya NU</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
