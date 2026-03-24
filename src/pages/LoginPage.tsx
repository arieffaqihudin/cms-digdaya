import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Masukkan email dan password");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials"
        ? "Email atau password salah"
        : error.message);
    } else {
      toast.success("Berhasil masuk!");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[hsl(150,20%,97%)] via-[hsl(0,0%,99%)] to-[hsl(150,15%,95%)] relative overflow-hidden">
      {/* Subtle decorative shapes */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[hsl(152,40%,90%)] opacity-30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-8%] w-[500px] h-[500px] rounded-full bg-[hsl(152,35%,88%)] opacity-25 blur-[100px] pointer-events-none" />
      <div className="absolute top-[30%] left-[15%] w-[200px] h-[200px] rounded-full bg-[hsl(152,30%,92%)] opacity-20 blur-[80px] pointer-events-none hidden lg:block" />

      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        {/* LEFT — Brand panel */}
        <div className="hidden lg:flex lg:w-[44%] relative items-center justify-center bg-gradient-to-b from-[hsl(150,18%,96%)] to-[hsl(150,22%,93%)] overflow-hidden border-r border-[hsl(150,15%,90%)]">
          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, hsl(152,45%,35%) 0.8px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Soft glow behind logo */}
          <div className="absolute w-[300px] h-[300px] rounded-full bg-[hsl(152,40%,85%)] opacity-30 blur-[80px]" />

          <div className="relative z-10 flex flex-col items-center gap-8 px-12 text-center max-w-md">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-[hsl(152,40%,80%)] opacity-20 blur-xl scale-125" />
              <img
                src="https://play-lh.googleusercontent.com/kfeQ0QFBny3AVurQ9r_CSBJyCfceAymEBlh9t6SIU_lZX0tH7WqYaTN7NHqrKGoQGNFEc3y8nj-iyw6IxqbEug=w480-h960-rw"
                alt="Digdaya Logo"
                className="relative w-[88px] h-[88px] rounded-2xl shadow-lg ring-1 ring-[hsl(150,15%,88%)]"
              />
            </div>
            <div className="space-y-3">
              <h1 className="text-[22px] font-semibold text-foreground tracking-tight leading-tight">
                Digdaya CMS
              </h1>
              <p className="text-[13px] text-muted-foreground leading-relaxed tracking-wide uppercase font-medium">
                Content Management System
              </p>
            </div>
            <div className="w-10 h-px bg-[hsl(150,20%,85%)]" />
            <p className="text-[13px] text-muted-foreground/70 leading-relaxed max-w-[260px]">
              Sistem Manajemen Konten Terpadu Digdaya NU
            </p>
          </div>
        </div>

        {/* RIGHT — Login form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0">
          <div className="w-full max-w-[400px]">
            {/* Mobile brand */}
            <div className="flex flex-col items-center gap-5 mb-10 lg:hidden">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-[hsl(152,40%,80%)] opacity-20 blur-lg scale-125" />
                <img
                  src="https://play-lh.googleusercontent.com/kfeQ0QFBny3AVurQ9r_CSBJyCfceAymEBlh9t6SIU_lZX0tH7WqYaTN7NHqrKGoQGNFEc3y8nj-iyw6IxqbEug=w480-h960-rw"
                  alt="Digdaya Logo"
                  className="relative w-[68px] h-[68px] rounded-xl shadow-md"
                />
              </div>
              <div className="text-center space-y-1.5">
                <h1 className="text-lg font-semibold text-foreground tracking-tight">
                  Digdaya CMS
                </h1>
                <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium">
                  Content Management System
                </p>
              </div>
            </div>

            {/* Card */}
            <div className="bg-card rounded-2xl border border-border/60 shadow-[0_4px_24px_-4px_hsl(150,15%,70%,0.12)] p-9 sm:p-10">
              <div className="mb-8">
                <h2 className="text-[18px] font-semibold text-foreground leading-tight">
                  Masuk ke akun Anda
                </h2>
                <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed">
                  Masuk untuk melanjutkan ke Digdaya CMS
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-muted-foreground/60" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@digdaya.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-background border-border/70 rounded-xl text-sm focus-visible:ring-[hsl(152,45%,45%)] focus-visible:ring-2 focus-visible:border-[hsl(152,45%,45%)] transition-all"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                      Password
                    </Label>
                    <Link
                      to="/forgot-password"
                      className="text-[12px] text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Lupa Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-muted-foreground/60" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-11 h-12 bg-background border-border/70 rounded-xl text-sm focus-visible:ring-[hsl(152,45%,45%)] focus-visible:ring-2 focus-visible:border-[hsl(152,45%,45%)] transition-all"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-[15px] w-[15px]" /> : <Eye className="h-[15px] w-[15px]" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-0.5">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    disabled={loading}
                    className="rounded"
                  />
                  <Label htmlFor="remember" className="text-[13px] text-muted-foreground font-normal cursor-pointer">
                    Ingat saya
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-[14px] font-semibold rounded-xl bg-[hsl(152,45%,38%)] hover:bg-[hsl(152,45%,33%)] text-white shadow-sm transition-all duration-200 mt-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </Button>
              </form>
            </div>

            <p className="text-center text-[11px] text-muted-foreground/60 mt-10 tracking-wide">
              © Digdaya NU
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
