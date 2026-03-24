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
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* LEFT — Brand panel */}
        <div className="hidden lg:flex lg:w-[45%] relative items-center justify-center bg-[hsl(150,16%,96%)] overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, hsl(152,45%,35%) 1px, transparent 0)",
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
              <h1 className="text-xl font-semibold text-foreground tracking-tight">
                Digdaya Content CMS
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sistem Manajemen Konten Terpadu Digdaya
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT — Login form */}
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
                <h1 className="text-lg font-semibold text-foreground">
                  Digdaya Content CMS
                </h1>
                <p className="text-xs text-muted-foreground">
                  Sistem Manajemen Konten Terpadu
                </p>
              </div>
            </div>

            {/* Card */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-8">
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground">
                  Masuk ke akun Anda
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Silakan masukkan email dan password
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@digdaya.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 bg-background"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Password
                    </Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Lupa Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
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

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    disabled={loading}
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground font-normal cursor-pointer">
                    Ingat saya
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-sm font-medium rounded-lg"
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

            <p className="text-center text-xs text-muted-foreground mt-8">
              © Digdaya NU
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
