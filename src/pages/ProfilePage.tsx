import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/components/AppLayout";
import { toast } from "sonner";

// ─── Profile data (mock) ────────────────────────────────────────────
const profileData = {
  nia: "1234567890",
  namaOrganisasi: "Pengurus Besar Nahdlatul Ulama",
  namaPengurus: "Arief Faqihudin",
  email: "arief.faqihudin@gmail.com",
  noHP: "+62 8112654666",
  jabatan: "Super Admin",
};

// ─── Component ───────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user } = useAuth();
  const screenSize = useScreenSize();

  const fields: { label: string; value: string; copyable?: boolean }[] = [
    { label: "NIA", value: profileData.nia },
    { label: "Nama Organisasi", value: profileData.namaOrganisasi },
    { label: "Nama Pengurus Digdaya Kepengurusan", value: profileData.namaPengurus },
    { label: "Email", value: profileData.email, copyable: true },
    { label: "No. HP", value: profileData.noHP, copyable: true },
    { label: "Jabatan", value: profileData.jabatan },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-base md:text-lg font-semibold text-foreground">Akun Detail</h1>
        <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">Ini adalah detail personal informasi Anda</p>
      </div>

      {/* Info card */}
      <div className="rounded-[12px] border border-border bg-surface p-5 md:p-7 shadow-card">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.1em] mb-6">
          Informasi Akun
        </p>

        <div className={cn(
          "grid gap-x-8 md:gap-x-12 gap-y-6",
          screenSize === "mobile" ? "grid-cols-1" : "grid-cols-2"
        )}>
          {fields.map((f) => (
            <ProfileField key={f.label} label={f.label} value={f.value} copyable={f.copyable} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Field component ─────────────────────────────────────────────────
function ProfileField({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Berhasil disalin");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin");
    }
  };

  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-medium text-muted-foreground/80 uppercase tracking-[0.06em]">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-[14px] font-medium text-foreground">{value}</p>
        {copyable && (
          <button
            onClick={handleCopy}
            className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/[0.06] transition-colors"
            title="Salin"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-[hsl(var(--status-success-fg))]" strokeWidth={2} />
            ) : (
              <Copy className="h-3.5 w-3.5" strokeWidth={1.6} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
