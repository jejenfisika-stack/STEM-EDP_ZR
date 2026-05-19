import { useState, useEffect } from "react";
import { BookOpen, Video, FileText, ClipboardList, LogOut, Upload, Bell, CheckCircle, Lightbulb, Eye, Star, Target, Zap, TrendingUp, ChevronRight, Home, BarChart2, Users, Award, X, Mail, EyeOff } from "lucide-react";

// ── EMAILJS CONFIG — isi dengan data dari emailjs.com ────────────────
const EJS = {
  serviceId:  "service_1iala5f",
  templateId: "template_dgbkbgw",
  publicKey:  "kE_aeiCsxBhD0rUTX",
};

// ── ACCOUNT STORAGE (localStorage) ───────────────────────────────────
const getAccounts = () => JSON.parse(localStorage.getItem("stem_accounts") || "[]");
const saveAccounts = (arr) => localStorage.setItem("stem_accounts", JSON.stringify(arr));
const findAccount = (username, password) => getAccounts().find(a => a.username === username && a.password === password);
const emailExists = (email) => getAccounts().some(a => a.email === email);
const usernameExists = (username) => getAccounts().some(a => a.username === username);

const C = {
  bg: "#07091A", surf: "#0D1228", surf2: "#131A35", border: "#1A2448",
  primary: "#3B9EFF", secondary: "#00D9BE", warn: "#FFAA00", danger: "#FF4D6D",
  text: "#EDF2FF", muted: "#6278A8",
};

const edpPhases = [
  { id: 1, name: "Identifikasi\nMasalah", icon: Target, color: "#3B9EFF" },
  { id: 2, name: "Riset &\nData", icon: BookOpen, color: "#A78BFA" },
  { id: 3, name: "Brainstorm-\ning", icon: Lightbulb, color: "#FFAA00" },
  { id: 4, name: "Desain\nSolusi", icon: Star, color: "#00D9BE" },
  { id: 5, name: "Buat\nPrototipe", icon: Zap, color: "#FF4D6D" },
  { id: 6, name: "Pengujian", icon: CheckCircle, color: "#34D399" },
  { id: 7, name: "Evaluasi &\nPerbaikan", icon: TrendingUp, color: "#F472B6" },
];

const MATERI = [
  { id: 1, title: "Pengantar EDP", phase: "Pengantar", level: "Semua Jenjang", dur: "30 mnt", icon: "🎯", color: "#3B9EFF", done: true, desc: "Konsep dasar EDP dan penerapannya dalam STEM." },
  { id: 2, title: "Identifikasi Masalah", phase: "Fase 1", level: "SD–SMA", dur: "45 mnt", icon: "🔍", color: "#FFAA00", done: true, desc: "Teknik mendefinisikan masalah dan batasan desain." },
  { id: 3, title: "Riset & Pengumpulan Data", phase: "Fase 2", level: "SD–SMA", dur: "40 mnt", icon: "📚", color: "#A78BFA", done: false, desc: "Strategi riset efektif dan analisis informasi." },
  { id: 4, title: "Brainstorming & Ideasi", phase: "Fase 3", level: "SD–SMA", dur: "35 mnt", icon: "💡", color: "#FFCC47", done: false, desc: "Teknik menghasilkan ide kreatif secara sistematis." },
  { id: 5, title: "Desain & Prototipe", phase: "Fase 4–5", level: "SMP–SMA", dur: "60 mnt", icon: "✏️", color: "#00D9BE", done: false, desc: "Membuat sketsa dan membangun prototipe pertama." },
  { id: 6, title: "Pengujian & Evaluasi", phase: "Fase 6–7", level: "SMP–SMA", dur: "50 mnt", icon: "🧪", color: "#FF4D6D", done: false, desc: "Prosedur pengujian sistematis dan analisis iterasi." },
];

const QUIZ = [
  { id: 1, q: "Langkah pertama dalam Engineering Design Process adalah...", opts: ["Membuat prototipe langsung", "Identifikasi & definisi masalah", "Melakukan pengujian", "Brainstorming ide"], ans: 1, exp: "EDP selalu dimulai dengan memahami masalah secara jelas sebelum mencari solusi." },
  { id: 2, q: "Tujuan utama fase Brainstorming dalam EDP adalah...", opts: ["Memilih satu solusi terbaik", "Menguji prototipe yang sudah ada", "Menghasilkan banyak ide tanpa menilai", "Mendefinisikan batasan desain"], ans: 2, exp: "Brainstorming bertujuan menghasilkan sebanyak mungkin ide secara bebas tanpa penilaian dulu." },
  { id: 3, q: '"Iterasi" dalam EDP berarti...', opts: ["Menghentikan proses desain", "Mengulang langkah untuk memperbaiki solusi", "Membuat prototipe baru dari nol", "Membagi tugas ke tim lain"], ans: 1, exp: "Iterasi adalah siklus perbaikan terus-menerus berdasarkan hasil pengujian." },
  { id: 4, q: "Manakah yang BUKAN kriteria desain yang baik?", opts: ["Dapat diukur dan diuji", "Berbasis kebutuhan pengguna", "Harus selalu mahal", "Realistis untuk dicapai"], ans: 2, exp: "Kriteria desain tidak harus mahal — yang penting terukur, berbasis kebutuhan, dan realistis." },
  { id: 5, q: "STEM adalah singkatan dari...", opts: ["Speed, Tech, Energy, Math", "Science, Technology, Engineering, Mathematics", "Study, Test, Evaluate, Make", "System, Theory, Experiment, Method"], ans: 1, exp: "STEM = Science, Technology, Engineering, Mathematics." },
];

const VIDEO_SUBS = [
  { id: 1, student: "Budi Santoso", cls: "7A", title: "Prototipe Penyaring Air Sederhana", date: "15 Mei 2025", status: "reviewed", grade: "A" },
  { id: 2, student: "Ani Rahayu", cls: "8B", title: "Presentasi Desain Jembatan Mini", date: "16 Mei 2025", status: "pending", grade: null },
  { id: 3, student: "Citra Dewi", cls: "10A", title: "Demo Sistem Irigasi Otomatis", date: "17 Mei 2025", status: "reviewed", grade: "B+" },
  { id: 4, student: "Dani Pratama", cls: "7A", title: "Uji Coba Mobil Tenaga Angin", date: "18 Mei 2025", status: "pending", grade: null },
];

const FILE_SUBS = [
  { id: 1, student: "Budi Santoso", cls: "7A", title: "Laporan EDP – Fase Identifikasi", date: "14 Mei 2025", type: "PDF", status: "reviewed", grade: "A-" },
  { id: 2, student: "Ani Rahayu", cls: "8B", title: "Lembar Kerja Brainstorming", date: "15 Mei 2025", type: "DOCX", status: "pending", grade: null },
  { id: 3, student: "Eko Purnomo", cls: "10B", title: "Design Brief – Alat Bantu Difabel", date: "16 Mei 2025", type: "PDF", status: "reviewed", grade: "A" },
  { id: 4, student: "Fani Lestari", cls: "9A", title: "Jurnal EDP Mingguan", date: "17 Mei 2025", type: "PDF", status: "pending", grade: null },
];

const card = (extra = {}) => ({ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 14, ...extra });
const btn = (color, extra = {}) => ({ background: `${color}22`, border: `1px solid ${color}66`, color, borderRadius: 8, padding: "6px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", ...extra });

function StatusBadge({ status }) {
  const ok = status === "reviewed";
  return <span style={{ background: ok ? "#00D9BE22" : "#FFAA0022", color: ok ? "#00D9BE" : "#FFAA00", border: `1px solid ${ok ? "#00D9BE44" : "#FFAA0044"}`, borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 600 }}>{ok ? "✓ Dinilai" : "⏳ Menunggu"}</span>;
}

// ── SEND EMAIL via EmailJS ────────────────────────────────────────────
async function sendWelcomeEmail({ toEmail, toName, username, password, role }) {
  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EJS.serviceId,
        template_id: EJS.templateId,
        user_id: EJS.publicKey,
        template_params: {
          to_email: toEmail,
          to_name: toName,
          username: username,
          password: password,
          role: role === "guru" ? "Guru" : "Siswa",
          app_url: window.location.origin,
        },
      }),
    });
    return res.ok;
  } catch { return false; }
}

// ── LOGIN ────────────────────────────────────────────────────────────
function LoginPage({ onLogin, onGoRegister }) {
  const [form, setForm] = useState({ username: "", pass: "", role: "siswa" });
  const [err, setErr] = useState("");
  const [showPass, setShowPass] = useState(false);
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const go = () => {
    if (!form.username || !form.pass) { setErr("Lengkapi username dan password"); return; }
    const accs = getAccounts();
    if (accs.length === 0) {
      onLogin(form.username, form.role);
      return;
    }
    const found = findAccount(form.username, form.pass);
    if (!found) { setErr("Username atau password salah"); return; }
    onLogin(found.fullName, found.role);
  };

  const inp = { background: C.surf2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "11px 14px", fontSize: 14, width: "100%", outline: "none", fontFamily: "inherit" };
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: `radial-gradient(ellipse at 20% 60%, ${C.primary}12, transparent 50%), radial-gradient(ellipse at 80% 20%, ${C.secondary}0e, transparent 45%)` }}>
      <div style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 20, padding: "44px 40px", width: 420, maxWidth: "95vw", boxShadow: "0 24px 64px rgba(0,0,0,.55)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg,#3B9EFF,#00D9BE)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 16px" }}>🔬</div>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 22, color: C.text, margin: "0 0 4px" }}>STEM EDP</h1>
          <p style={{ color: C.muted, fontSize: 13 }}>Platform Pembelajaran Engineering Design Process</p>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6 }}>Username</label>
          <input style={inp} value={form.username} onChange={e => s("username", e.target.value)} placeholder="Masukkan username" />
        </div>
        <div style={{ marginBottom: 20, position: "relative" }}>
          <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6 }}>Password</label>
          <input style={inp} type={showPass ? "text" : "password"} value={form.pass} onChange={e => s("pass", e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && go()} />
          <button onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 12, top: 34, background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 0 }}>
            {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
          </button>
        </div>
        {err && <p style={{ color: C.danger, fontSize: 12, textAlign: "center", marginBottom: 14 }}>{err}</p>}
        <button onClick={go} style={{ width: "100%", padding: 13, borderRadius: 10, border: "none", background: "linear-gradient(135deg,#3B9EFF,#00D9BE)", color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "inherit", cursor: "pointer" }}>Masuk →</button>
        <div style={{ textAlign: "center", marginTop: 18, display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
          <span style={{ fontSize: 13, color: C.muted }}>Belum punya akun?</span>
          <button onClick={onGoRegister} style={{ fontSize: 13, color: C.primary, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Daftar sekarang →</button>
        </div>
      </div>
    </div>
  );
}

// ── REGISTER ─────────────────────────────────────────────────────────
function RegisterPage({ onGoLogin }) {
  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "", confirm: "", role: "siswa", kelas: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inp = { background: C.surf2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "11px 14px", fontSize: 14, width: "100%", outline: "none", fontFamily: "inherit" };

  const submit = async () => {
    setErr("");
    if (!form.fullName || !form.username || !form.email || !form.password || !form.confirm)
      return setErr("Semua kolom wajib diisi");
    if (!form.email.includes("@"))
      return setErr("Format email tidak valid");
    if (form.password.length < 6)
      return setErr("Password minimal 6 karakter");
    if (form.password !== form.confirm)
      return setErr("Konfirmasi password tidak cocok");
    if (emailExists(form.email))
      return setErr("Email sudah terdaftar, gunakan email lain");
    if (usernameExists(form.username))
      return setErr("Username sudah digunakan, pilih yang lain");

    setLoading(true);
    const accs = getAccounts();
    accs.push({ fullName: form.fullName, username: form.username, email: form.email, password: form.password, role: form.role, kelas: form.kelas, registeredAt: new Date().toISOString() });
    saveAccounts(accs);

    const emailOk = await sendWelcomeEmail({ toEmail: form.email, toName: form.fullName, username: form.username, password: form.password, role: form.role });
    setLoading(false);
    setDone(true);
    setTimeout(() => onGoLogin(), 4000);
  };

  if (done) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: C.surf, border: `1px solid #00D9BE44`, borderRadius: 20, padding: "48px 40px", width: 420, maxWidth: "95vw", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#00D9BE20", border: "2px solid #00D9BE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 32 }}>✅</div>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 10 }}>Pendaftaran Berhasil!</h2>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 6 }}>Akun <strong style={{ color: C.text }}>{form.username}</strong> sudah dibuat.</p>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>Cek email <strong style={{ color: C.secondary }}>{form.email}</strong> untuk melihat detail login kamu.</p>
        <div style={{ background: C.surf2, borderRadius: 12, padding: "14px 20px", marginBottom: 20, textAlign: "left" }}>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Detail akun kamu:</div>
          <div style={{ fontSize: 13, marginBottom: 4 }}>👤 Username: <strong style={{ color: C.primary }}>{form.username}</strong></div>
          <div style={{ fontSize: 13, marginBottom: 4 }}>🔒 Password: <strong style={{ color: C.primary }}>{form.password}</strong></div>
          <div style={{ fontSize: 13 }}>🎭 Peran: <strong style={{ color: C.primary }}>{form.role === "guru" ? "Guru" : "Siswa"}</strong></div>
        </div>
        <p style={{ fontSize: 12, color: C.muted }}>Mengalihkan ke halaman login...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: `radial-gradient(ellipse at 80% 20%, ${C.primary}12, transparent 50%)`, padding: "24px 0" }}>
      <div style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 20, padding: "40px", width: 460, maxWidth: "95vw", boxShadow: "0 24px 64px rgba(0,0,0,.55)" }}>
        <button onClick={onGoLogin} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, marginBottom: 20, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>← Kembali ke Login</button>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#3B9EFF,#00D9BE)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 14px" }}>🔬</div>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20, color: C.text, margin: "0 0 4px" }}>Buat Akun Baru</h1>
          <p style={{ color: C.muted, fontSize: 13 }}>Daftarkan dirimu untuk mengakses STEM EDP</p>
        </div>

        <div style={{ display: "flex", background: C.surf2, borderRadius: 10, padding: 4, marginBottom: 20, gap: 4 }}>
          {["siswa", "guru"].map(r => (
            <button key={r} onClick={() => s("role", r)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer", background: form.role === r ? "linear-gradient(135deg,#3B9EFF,#00D9BE)" : "transparent", color: form.role === r ? "#fff" : C.muted, fontWeight: 600, fontSize: 13, fontFamily: "inherit", transition: "all .2s" }}>
              {r === "siswa" ? "👦 Daftar sebagai Siswa" : "👩‍🏫 Daftar sebagai Guru"}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6 }}>Nama Lengkap *</label>
            <input style={inp} value={form.fullName} onChange={e => s("fullName", e.target.value)} placeholder="Nama lengkap" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6 }}>{form.role === "siswa" ? "Kelas" : "Mata Pelajaran"}</label>
            <input style={inp} value={form.kelas} onChange={e => s("kelas", e.target.value)} placeholder={form.role === "siswa" ? "Contoh: 7A" : "Contoh: IPA"} />
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6 }}>Username *</label>
          <input style={inp} value={form.username} onChange={e => s("username", e.target.value.replace(/\s/g, ""))} placeholder="Buat username unik (tanpa spasi)" />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6 }}>Email *</label>
          <div style={{ position: "relative" }}>
            <input style={{ ...inp, paddingLeft: 38 }} type="email" value={form.email} onChange={e => s("email", e.target.value)} placeholder="email@kamu.com" />
            <Mail size={14} color={C.muted} style={{ position: "absolute", left: 12, top: 13 }} />
          </div>
          <p style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>📧 Username & password akan dikirim ke email ini</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6 }}>Password * (min. 6 karakter)</label>
            <div style={{ position: "relative" }}>
              <input style={inp} type={showPass ? "text" : "password"} value={form.password} onChange={e => s("password", e.target.value)} placeholder="••••••••" />
              <button onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 10, top: 11, background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 0 }}>{showPass ? <EyeOff size={14}/> : <Eye size={14}/>}</button>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6 }}>Konfirmasi Password *</label>
            <input style={{ ...inp, borderColor: form.confirm && form.confirm !== form.password ? C.danger : C.border }} type="password" value={form.confirm} onChange={e => s("confirm", e.target.value)} placeholder="••••••••" />
          </div>
        </div>

        {err && <div style={{ background: C.danger + "18", border: `1px solid ${C.danger}44`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: C.danger }}>⚠ {err}</div>}

        <button onClick={submit} disabled={loading} style={{ width: "100%", padding: 13, borderRadius: 10, border: "none", background: loading ? C.surf2 : "linear-gradient(135deg,#3B9EFF,#00D9BE)", color: loading ? C.muted : "#fff", fontWeight: 700, fontSize: 15, fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "⏳ Mendaftarkan & mengirim email..." : "Daftar & Kirim Email →"}
        </button>

        <div style={{ marginTop: 16, background: C.surf2, borderRadius: 10, padding: "12px 14px" }}>
          <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>🔒 Datamu aman. Email notifikasi berisi username & password yang kamu buat, dikirim otomatis saat pendaftaran berhasil.</p>
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD ────────────────────────────────────────────────────────
function DashboardPage({ user, setPage }) {
  const statsG = [{ l: "Total Siswa", v: "128", i: "👥", c: C.primary }, { l: "Video Masuk", v: "24", i: "🎬", c: "#A78BFA" }, { l: "Tugas Masuk", v: "47", i: "📄", c: C.warn }, { l: "Belum Dinilai", v: "12", i: "⏳", c: C.danger }];
  const statsS = [{ l: "Materi Selesai", v: "2/6", i: "📚", c: C.primary }, { l: "Skor Terakhir", v: "80%", i: "🏆", c: C.warn }, { l: "Video Dikirim", v: "1", i: "🎬", c: "#A78BFA" }, { l: "Tugas Dikumpul", v: "2", i: "📄", c: C.secondary }];
  const stats = user.role === "guru" ? statsG : statsS;
  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#3B9EFF1a,#00D9BE0e)", border: `1px solid #3B9EFF2a`, borderRadius: 16, padding: "24px 28px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 22, margin: "0 0 6px" }}>Halo, {user.name}! 👋</h2>
          <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>{user.role === "guru" ? "Pantau progres siswa dan nilai hasil karya mereka." : "Pelajari EDP dan wujudkan inovasi terbaikmu!"}</p>
        </div>
        <span style={{ fontSize: 52 }}>🚀</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ ...card({ padding: "18px 20px" }) }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.i}</div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 26, color: s.c, marginBottom: 2 }}>{s.v}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Alur Engineering Design Process</h3>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6 }}>
          {edpPhases.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "center" }}>
                <div onClick={() => setPage("materi")} style={{ ...card({ padding: "14px 12px", textAlign: "center", minWidth: 100, cursor: "pointer", borderColor: p.color + "44" }) }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: p.color + "20", border: `2px solid ${p.color}55`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}><Icon size={15} color={p.color} /></div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: p.color, marginBottom: 2 }}>Fase {p.id}</div>
                  <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.4, whiteSpace: "pre-line" }}>{p.name}</div>
                </div>
                {i < edpPhases.length - 1 && <div style={{ color: C.border, fontSize: 16, margin: "0 2px", flexShrink: 0, marginTop: -8 }}>›</div>}
              </div>
            );
          })}
        </div>
      </div>
      <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Akses Cepat</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
        {[
          { l: "Lanjutkan Materi", sub: "Riset & Pengumpulan Data", icon: BookOpen, c: "#A78BFA", pg: "materi" },
          { l: "Kerjakan Latihan", sub: "5 soal tersedia", icon: ClipboardList, c: C.warn, pg: "latihan" },
          { l: user.role === "guru" ? "Video Masuk" : "Upload Video", sub: user.role === "guru" ? "4 video baru" : "Bagikan hasil karyamu", icon: Video, c: C.primary, pg: "portal-video" },
          { l: user.role === "guru" ? "Periksa Tugas" : "Kumpulkan Tugas", sub: user.role === "guru" ? "8 belum dinilai" : "Deadline: Jum'at ini", icon: FileText, c: C.secondary, pg: "portal-tugas" },
        ].map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={i} onClick={() => setPage(a.pg)} style={{ ...card({ padding: "15px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }) }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: a.c + "20", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={20} color={a.c} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{a.l}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{a.sub}</div>
              </div>
              <ChevronRight size={15} color={C.muted} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── MATERI ───────────────────────────────────────────────────────────
function MateriPage() {
  const [open, setOpen] = useState(null);
  const m = MATERI.find(x => x.id === open);
  if (open && m) return (
    <div>
      <button onClick={() => setOpen(null)} style={{ ...btn(C.muted, { marginBottom: 20, padding: "8px 16px" }) }}>← Kembali</button>
      <div style={card({ overflow: "hidden" })}>
        <div style={{ background: `linear-gradient(135deg,${m.color}28,${m.color}0a)`, padding: "32px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>{m.icon}</div>
          <div style={{ fontSize: 11, color: m.color, fontWeight: 700, marginBottom: 6 }}>{m.phase} · {m.level} · ⏱ {m.dur}</div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 22, margin: "0 0 8px" }}>{m.title}</h2>
          <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>{m.desc}</p>
        </div>
        <div style={{ padding: 32 }}>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Yang akan kamu pelajari:</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
            {["Konsep dasar & latar belakang", "Teknik dan metode utama", "Studi kasus nyata di sekolah", "Latihan soal & refleksi", "Checklist keberhasilan", "Hubungan dengan fase EDP lain"].map((it, i) => (
              <div key={i} style={{ background: C.surf2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle size={13} color={m.color} /><span style={{ fontSize: 13 }}>{it}</span>
              </div>
            ))}
          </div>
          <div style={{ background: C.surf2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 22, marginBottom: 20 }}>
            <h4 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: m.color, margin: "0 0 12px" }}>📖 Ringkasan Materi</h4>
            <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 10px" }}>Engineering Design Process (EDP) adalah metode sistematis yang digunakan para insinyur untuk menyelesaikan masalah dan menciptakan solusi inovatif. Proses ini bersifat iteratif — kamu bisa kembali ke langkah sebelumnya kapan saja.</p>
            <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Dalam fase <strong style={{ color: C.text }}>{m.title}</strong>, kamu akan membangun fondasi yang kuat sebelum melangkah ke solusi, dengan pendekatan yang terstruktur dan berbasis data.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ background: `linear-gradient(135deg,${m.color},${m.color}aa)`, border: "none", color: "#fff", padding: "12px 24px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>▶ Mulai Belajar</button>
            <button style={{ ...btn(C.muted, { padding: "12px 24px" }) }}>⬇ Unduh Materi</button>
          </div>
        </div>
      </div>
    </div>
  );
  const done = MATERI.filter(x => x.done).length;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div><h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, margin: "0 0 4px" }}>Materi EDP</h2><p style={{ color: C.muted, fontSize: 13, margin: 0 }}>{MATERI.length} materi · {done} selesai</p></div>
        <div style={{ display: "flex", gap: 6 }}>
          {["Semua", "SD", "SMP", "SMA"].map(f => (
            <button key={f} style={{ background: f === "Semua" ? C.primary + "22" : C.surf2, color: f === "Semua" ? C.primary : C.muted, border: `1px solid ${f === "Semua" ? C.primary + "66" : C.border}`, borderRadius: 20, padding: "5px 14px", fontSize: 12, cursor: "pointer" }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ ...card({ padding: "14px 18px", marginBottom: 18 }) }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 13, fontWeight: 600 }}>Progress Belajar</span><span style={{ fontSize: 13, color: C.primary }}>{done} / {MATERI.length} materi</span></div>
        <div style={{ background: C.surf2, borderRadius: 10, height: 8 }}><div style={{ width: `${(done / MATERI.length) * 100}%`, height: "100%", background: "linear-gradient(90deg,#3B9EFF,#00D9BE)", borderRadius: 10 }} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
        {MATERI.map(m => (
          <div key={m.id} onClick={() => setOpen(m.id)} style={{ ...card({ padding: "20px 22px", cursor: "pointer", position: "relative", borderColor: m.done ? m.color + "44" : C.border }) }}>
            {m.done && <div style={{ position: "absolute", top: 14, right: 14 }}><CheckCircle size={16} color={m.color} /></div>}
            <div style={{ fontSize: 34, marginBottom: 12 }}>{m.icon}</div>
            <div style={{ fontSize: 11, color: m.color, fontWeight: 700, marginBottom: 4 }}>{m.phase} · {m.level}</div>
            <h4 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, margin: "0 0 6px", lineHeight: 1.3 }}>{m.title}</h4>
            <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, margin: "0 0 12px" }}>{m.desc}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: C.muted }}>⏱ {m.dur}</span>
              <span style={{ fontSize: 12, color: m.color, fontWeight: 600 }}>{m.done ? "Selesai ✓" : "Mulai →"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── LATIHAN SOAL ─────────────────────────────────────────────────────
function LatihanPage({ showNotif }) {
  const [state, setState] = useState({ active: false, cur: 0, ans: [], done: false });
  const { active, cur, ans, done } = state;
  const total = QUIZ.length;
  const pick = (i) => {
    if (ans[cur] !== undefined) return;
    const na = [...ans]; na[cur] = i;
    const isLast = cur === total - 1;
    setState(s => ({ ...s, ans: na, done: isLast }));
    if (!isLast) setTimeout(() => setState(s => ({ ...s, cur: s.cur + 1 })), 700);
  };
  if (!active && !done) return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ ...card({ padding: 36, textAlign: "center" }) }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🧠</div>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 22, margin: "0 0 8px" }}>Latihan Soal EDP</h2>
        <p style={{ color: C.muted, fontSize: 14, margin: "0 0 24px" }}>Uji pemahamanmu tentang Engineering Design Process dengan {total} soal pilihan ganda.</p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 28 }}>
          {[{ l: "Total Soal", v: `${total} soal`, i: "📝" }, { l: "Waktu", v: "Bebas", i: "⏱" }, { l: "Jenis", v: "Pilihan Ganda", i: "✅" }].map((s, i) => (
            <div key={i} style={{ background: C.surf2, borderRadius: 12, padding: "14px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.i}</div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{s.v}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{s.l}</div>
            </div>
          ))}
        </div>
        <button onClick={() => setState({ active: true, cur: 0, ans: [], done: false })} style={{ background: "linear-gradient(135deg,#3B9EFF,#00D9BE)", border: "none", color: "#fff", padding: "13px 40px", borderRadius: 12, fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Mulai Latihan →</button>
      </div>
    </div>
  );
  if (done) {
    const score = ans.filter((a, i) => a === QUIZ[i].ans).length;
    const pct = Math.round((score / total) * 100);
    return (
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ ...card({ padding: 36, textAlign: "center" }) }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "💪"}</div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 22, margin: "0 0 6px" }}>{pct >= 80 ? "Luar Biasa!" : pct >= 60 ? "Bagus!" : "Terus Semangat!"}</h2>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 54, color: pct >= 80 ? C.secondary : pct >= 60 ? C.warn : C.danger, margin: "14px 0" }}>{pct}%</div>
          <p style={{ color: C.muted, margin: "0 0 24px" }}>{score} dari {total} soal dijawab benar</p>
          <div style={{ textAlign: "left", marginBottom: 24 }}>
            {QUIZ.map((q, i) => {
              const ok = ans[i] === q.ans;
              return (
                <div key={q.id} style={{ background: ok ? "#00D9BE0e" : "#FF4D6D0e", border: `1px solid ${ok ? "#00D9BE40" : "#FF4D6D40"}`, borderRadius: 10, padding: "12px 16px", marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: ok ? C.secondary : C.danger, marginBottom: 4 }}>{ok ? "✓ Benar" : "✗ Salah"} — Soal {i + 1}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{q.exp}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button onClick={() => setState({ active: false, cur: 0, ans: [], done: false })} style={{ ...btn(C.muted, { padding: "11px 22px" }) }}>Kembali</button>
            <button onClick={() => setState({ active: true, cur: 0, ans: [], done: false })} style={{ background: "linear-gradient(135deg,#3B9EFF,#00D9BE)", border: "none", color: "#fff", padding: "11px 22px", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Ulangi</button>
          </div>
        </div>
      </div>
    );
  }
  const q = QUIZ[cur]; const sel = ans[cur];
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 13, color: C.muted }}>Soal {cur + 1} dari {total}</span><span style={{ fontSize: 13, color: C.primary }}>{Math.round((cur / total) * 100)}%</span></div>
        <div style={{ background: C.surf2, borderRadius: 10, height: 6 }}><div style={{ width: `${(cur / total) * 100}%`, height: "100%", background: "linear-gradient(90deg,#3B9EFF,#00D9BE)", borderRadius: 10, transition: "width .3s" }} /></div>
      </div>
      <div style={card({ padding: 28 })}>
        <div style={{ fontSize: 11, color: C.primary, fontWeight: 700, marginBottom: 8 }}>SOAL {cur + 1}</div>
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 17, margin: "0 0 22px", lineHeight: 1.4 }}>{q.q}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.opts.map((opt, i) => {
            let bg = C.surf2, border = C.border, color = C.text;
            if (sel !== undefined) { if (i === q.ans) { bg = "#00D9BE12"; border = "#00D9BE66"; color = C.secondary; } else if (i === sel) { bg = "#FF4D6D12"; border = "#FF4D6D66"; color = C.danger; } }
            return (
              <div key={i} onClick={() => pick(i)} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: "13px 16px", display: "flex", alignItems: "center", gap: 12, cursor: sel === undefined ? "pointer" : "default", color }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: sel !== undefined ? bg : C.surf, border: `2px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                  {sel !== undefined && i === q.ans ? "✓" : sel === i && i !== q.ans ? "✗" : String.fromCharCode(65 + i)}
                </div>
                <span style={{ fontSize: 14 }}>{opt}</span>
              </div>
            );
          })}
        </div>
        {sel !== undefined && cur === total - 1 && (
          <button onClick={() => setState(s => ({ ...s, done: true }))} style={{ marginTop: 16, width: "100%", background: "linear-gradient(135deg,#3B9EFF,#00D9BE)", border: "none", color: "#fff", padding: 13, borderRadius: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Lihat Hasil →</button>
        )}
      </div>
    </div>
  );
}

// ── PORTAL VIDEO ─────────────────────────────────────────────────────
function PortalVideoPage({ user, showNotif }) {
  const [subs, setSubs] = useState(VIDEO_SUBS);
  const [form, setForm] = useState({ title: "", cls: "" });
  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const upload = () => {
    if (!form.title.trim()) { showNotif("Judul video wajib diisi!", "err"); return; }
    setSubs(s => [{ id: Date.now(), student: user.name, cls: form.cls || "-", title: form.title, date: "Hari ini", status: "pending", grade: null }, ...s]);
    setForm({ title: "", cls: "" }); showNotif("Video berhasil dikirim! 🎬");
  };
  return (
    <div>
      {user.role === "siswa" && (
        <div style={{ ...card({ padding: 24, marginBottom: 22 }) }}>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, margin: "0 0 16px" }}>Upload Video Proyek</h3>
          <div style={{ border: `2px dashed ${C.border}`, borderRadius: 12, padding: "32px", textAlign: "center", marginBottom: 14, cursor: "pointer" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎬</div>
            <p style={{ fontSize: 14, color: C.muted, margin: "0 0 4px" }}>Seret file video ke sini, atau klik untuk memilih</p>
            <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Format: MP4, MOV, AVI (maks. 500 MB)</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            {[{ l: "Judul Video *", k: "title", ph: "Judul video proyekmu" }, { l: "Kelas", k: "cls", ph: "Contoh: 7A" }].map(({ l, k, ph }) => (
              <div key={k}><label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 5 }}>{l}</label><input value={form[k]} onChange={e => sf(k, e.target.value)} placeholder={ph} style={{ background: C.surf2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "10px 14px", fontSize: 14, width: "100%", outline: "none", fontFamily: "inherit" }} /></div>
            ))}
          </div>
          <button onClick={upload} style={{ background: "linear-gradient(135deg,#3B9EFF,#00D9BE)", border: "none", color: "#fff", padding: "10px 22px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}><Upload size={15} /> Kirim Video</button>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, margin: 0 }}>{user.role === "guru" ? "Video Masuk dari Siswa" : "Video Saya"}</h3>
        <span style={{ fontSize: 12, color: C.muted }}>{subs.length} video</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {subs.map(v => (
          <div key={v.id} style={{ ...card({ padding: "15px 18px", display: "flex", alignItems: "center", gap: 14 }) }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: C.primary + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🎬</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{v.student} · Kelas {v.cls} · {v.date}</div>
            </div>
            <StatusBadge status={v.status} />
            {v.grade && <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 16, color: C.secondary }}>{v.grade}</span>}
            {user.role === "guru" && v.status === "pending" && <button onClick={() => showNotif(`Membuka video ${v.student}...`)} style={btn(C.primary)}>Nilai</button>}
            <button style={{ background: "none", border: "none", color: C.muted, cursor: "pointer" }}><Eye size={15} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PORTAL TUGAS ─────────────────────────────────────────────────────
function PortalTugasPage({ user, showNotif }) {
  const [subs, setSubs] = useState(FILE_SUBS);
  const [form, setForm] = useState({ title: "", cls: "", type: "PDF" });
  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const upload = () => {
    if (!form.title.trim()) { showNotif("Judul tugas wajib diisi!", "err"); return; }
    setSubs(s => [{ id: Date.now(), student: user.name, cls: form.cls || "-", title: form.title, date: "Hari ini", type: form.type, status: "pending", grade: null }, ...s]);
    setForm({ title: "", cls: "", type: "PDF" }); showNotif("Tugas berhasil dikumpulkan! 📄");
  };
  const inp = { background: C.surf2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "10px 14px", fontSize: 14, width: "100%", outline: "none", fontFamily: "inherit" };
  return (
    <div>
      {user.role === "siswa" && (
        <div style={{ ...card({ padding: 24, marginBottom: 22 }) }}>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, margin: "0 0 16px" }}>Kumpulkan Tugas</h3>
          <div style={{ border: `2px dashed ${C.border}`, borderRadius: 12, padding: "32px", textAlign: "center", marginBottom: 14, cursor: "pointer" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📄</div>
            <p style={{ fontSize: 14, color: C.muted, margin: "0 0 4px" }}>Seret file tugas ke sini, atau klik untuk memilih</p>
            <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Format: PDF, DOCX, PPTX (maks. 50 MB)</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div><label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 5 }}>Judul Tugas *</label><input value={form.title} onChange={e => sf("title", e.target.value)} placeholder="Nama tugas kamu" style={inp} /></div>
            <div><label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 5 }}>Kelas</label><input value={form.cls} onChange={e => sf("cls", e.target.value)} placeholder="7A" style={inp} /></div>
            <div><label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 5 }}>Tipe File</label><select value={form.type} onChange={e => sf("type", e.target.value)} style={{ ...inp, cursor: "pointer" }}>{["PDF", "DOCX", "PPTX", "XLSX"].map(t => <option key={t}>{t}</option>)}</select></div>
          </div>
          <button onClick={upload} style={{ background: "linear-gradient(135deg,#00D9BE,#3B9EFF)", border: "none", color: "#fff", padding: "10px 22px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}><Upload size={15} /> Kumpulkan Tugas</button>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, margin: 0 }}>{user.role === "guru" ? "Tugas Masuk dari Siswa" : "Tugas Saya"}</h3>
        <span style={{ fontSize: 12, color: C.muted }}>{subs.length} tugas</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {subs.map(f => (
          <div key={f.id} style={{ ...card({ padding: "15px 18px", display: "flex", alignItems: "center", gap: 14 }) }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: C.secondary + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: C.secondary, flexShrink: 0 }}>{f.type}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.title}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{f.student} · Kelas {f.cls} · {f.date}</div>
            </div>
            <StatusBadge status={f.status} />
            {f.grade && <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 16, color: C.secondary }}>{f.grade}</span>}
            {user.role === "guru" && f.status === "pending" && <button onClick={() => showNotif(`Membuka tugas ${f.student}...`)} style={btn(C.secondary)}>Nilai</button>}
            <button style={{ background: "none", border: "none", color: C.muted, cursor: "pointer" }}><Eye size={15} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PENILAIAN (GURU) ─────────────────────────────────────────────────
function NilaiPage({ showNotif }) {
  const pending = [...VIDEO_SUBS.filter(v => v.status === "pending"), ...FILE_SUBS.filter(f => f.status === "pending")];
  const reviewed = [...VIDEO_SUBS, ...FILE_SUBS].filter(s => s.status === "reviewed");
  const allStats = [
    { l: "Total Pengumpulan", v: VIDEO_SUBS.length + FILE_SUBS.length, c: C.primary },
    { l: "Sudah Dinilai", v: reviewed.length, c: C.secondary },
    { l: "Menunggu Penilaian", v: pending.length, c: C.warn },
    { l: "Rata-rata Nilai", v: "A−", c: "#A78BFA" },
  ];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {allStats.map((s, i) => (
          <div key={i} style={card({ padding: "18px 20px" })}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 28, color: s.c, marginBottom: 4 }}>{s.v}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{s.l}</div>
          </div>
        ))}
      </div>
      <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Menunggu Penilaian</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {pending.map(s => (
          <div key={s.id} style={{ ...card({ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }) }}>
            <span style={{ fontSize: 22 }}>{s.type ? "📄" : "🎬"}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{s.student} · Kelas {s.cls}</div>
            </div>
            {s.type && <span style={{ background: C.secondary + "20", color: C.secondary, borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700 }}>{s.type}</span>}
            <button onClick={() => showNotif(`Membuka submission ${s.student}...`)} style={btn(C.primary)}>Buka & Nilai</button>
          </div>
        ))}
      </div>
      <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Sudah Dinilai</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {reviewed.map(s => (
          <div key={s.id} style={{ ...card({ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }) }}>
            <span style={{ fontSize: 22 }}>{s.type ? "📄" : "🎬"}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{s.student} · Kelas {s.cls}</div>
            </div>
            <StatusBadge status="reviewed" />
            {s.grade && <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 18, color: C.secondary }}>{s.grade}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── APP SHELL ────────────────────────────────────────────────────────
function AppShell({ user, onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [notif, setNotif] = useState(null);
  const showNotif = (msg, type = "ok") => { setNotif({ msg, type }); setTimeout(() => setNotif(null), 3000); };
  const nav = [
    { id: "dashboard", label: "Dashboard", Icon: Home },
    { id: "materi", label: "Materi EDP", Icon: BookOpen },
    { id: "latihan", label: "Latihan Soal", Icon: ClipboardList },
    { id: "portal-video", label: "Portal Video", Icon: Video },
    { id: "portal-tugas", label: "Portal Tugas", Icon: FileText },
    ...(user.role === "guru" ? [{ id: "nilai", label: "Penilaian", Icon: BarChart2 }] : []),
  ];
  const titles = { dashboard: "Dashboard", materi: "Materi EDP", latihan: "Latihan Soal", "portal-video": "Portal Video", "portal-tugas": "Portal Tugas", nilai: "Penilaian" };
  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, fontFamily: "'DM Sans',sans-serif", color: C.text, overflow: "hidden" }}>
      {notif && (
        <div style={{ position: "fixed", top: 18, right: 18, zIndex: 999, background: notif.type === "err" ? C.danger : C.secondary, color: "#fff", padding: "12px 20px", borderRadius: 10, fontWeight: 600, fontSize: 13, boxShadow: "0 4px 20px rgba(0,0,0,.4)", zIndex: 9999 }}>{notif.msg}</div>
      )}
      {/* Sidebar */}
      <div style={{ width: 224, background: C.surf, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "18px 18px 12px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#3B9EFF,#00D9BE)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🔬</div>
          <div><div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14 }}>STEM EDP</div><div style={{ fontSize: 10, color: C.muted }}>Learning Platform</div></div>
        </div>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: user.role === "guru" ? "linear-gradient(135deg,#FFAA00,#FF4D6D)" : "linear-gradient(135deg,#3B9EFF,#A78BFA)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{user.name[0].toUpperCase()}</div>
          <div><div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div><div style={{ fontSize: 11, color: user.role === "guru" ? C.warn : C.primary }}>{user.role === "guru" ? "👩‍🏫 Guru" : "👦 Siswa"}</div></div>
        </div>
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
          {nav.map(({ id, label, Icon }) => {
            const active = page === id;
            return (
              <div key={id} onClick={() => setPage(id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, marginBottom: 2, cursor: "pointer", background: active ? C.primary + "20" : "transparent", color: active ? C.primary : C.muted, borderLeft: `3px solid ${active ? C.primary : "transparent"}`, transition: "all .15s" }}>
                <Icon size={16} /><span style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{label}</span>
              </div>
            );
          })}
        </nav>
        <div style={{ padding: "8px 8px 12px", borderTop: `1px solid ${C.border}` }}>
          <div onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, color: C.danger, cursor: "pointer" }}><LogOut size={16} /><span style={{ fontSize: 13 }}>Keluar</span></div>
        </div>
      </div>
      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ height: 56, background: C.surf, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 22px", gap: 12, flexShrink: 0 }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, flex: 1 }}>{titles[page]}</div>
          <div style={{ background: C.surf2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path stroke={C.muted} strokeWidth="2" d="M21 21l-4.35-4.35M16.5 9.5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input placeholder="Cari..." style={{ background: "none", border: "none", outline: "none", color: C.text, fontSize: 13, width: 130, fontFamily: "inherit" }} />
          </div>
          <div style={{ position: "relative" }}><Bell size={17} color={C.muted} style={{ cursor: "pointer" }} /><div style={{ position: "absolute", top: -3, right: -3, width: 7, height: 7, background: C.danger, borderRadius: "50%" }} /></div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 22 }}>
          {page === "dashboard" && <DashboardPage user={user} setPage={setPage} />}
          {page === "materi" && <MateriPage />}
          {page === "latihan" && <LatihanPage showNotif={showNotif} />}
          {page === "portal-video" && <PortalVideoPage user={user} showNotif={showNotif} />}
          {page === "portal-tugas" && <PortalTugasPage user={user} showNotif={showNotif} />}
          {page === "nilai" && user.role === "guru" && <NilaiPage showNotif={showNotif} />}
        </div>
      </div>
    </div>
  );
}

// ── ROOT ─────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login"); // "login" | "register"

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `*{box-sizing:border-box;margin:0;padding:0} ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:${C.surf}} ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}`;
    document.head.appendChild(style);
  }, []);

  if (user) return <AppShell user={user} onLogout={() => setUser(null)} />;
  if (page === "register") return <RegisterPage onGoLogin={() => setPage("login")} />;
  return <LoginPage onLogin={(name, role) => setUser({ name, role })} onGoRegister={() => setPage("register")} />;
}
