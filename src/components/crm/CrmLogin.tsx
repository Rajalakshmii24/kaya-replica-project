import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CRM_PASSWORD = "kaya2024";
const CRM_EMAIL = "admin@kaya.ae";

interface CrmLoginProps {
  onLogin: () => void;
}

const CrmLogin = ({ onLogin }: CrmLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (val: string) => {
    if (!val.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (val: string) => {
    if (!val) return "Password is required";
    if (val.length < 4) return "Password must be at least 4 characters";
    return "";
  };

  const isFormValid = email.trim() && password && !validateEmail(email) && !validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    // Simulate API delay
    await new Promise((r) => setTimeout(r, 600));

    if (password === CRM_PASSWORD) {
      if (rememberMe) {
        localStorage.setItem("crm_auth", "true");
        localStorage.setItem("crm_email", email);
      }
      onLogin();
    } else {
      setErrors({ general: "Invalid email or password. Please try again." });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      <div className="min-h-screen flex items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-4"
        >
          <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-kaya-olive rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={28} className="text-primary-foreground" />
              </div>
              <h1 className="font-raleway text-2xl font-light text-foreground tracking-wide">
                CRM Access
              </h1>
              <p className="font-raleway text-sm text-muted-foreground mt-2">
                Sign in to access the CRM dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                    }}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg font-raleway text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-kaya-olive/50 transition-all"
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="font-raleway text-xs text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((p) => ({ ...p, password: "" }));
                    }}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 bg-background border border-border rounded-lg font-raleway text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-kaya-olive/50 transition-all"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="font-raleway text-xs text-destructive mt-1">{errors.password}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-kaya-olive focus:ring-kaya-olive/50"
                />
                <label htmlFor="remember" className="font-raleway text-xs text-muted-foreground cursor-pointer">
                  Remember me
                </label>
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <p className="font-raleway text-xs text-destructive">{errors.general}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full py-3 bg-kaya-olive text-primary-foreground font-raleway font-medium text-sm rounded-lg hover:bg-kaya-olive/90 transition-colors tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default CrmLogin;
