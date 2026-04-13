import { useState, useCallback } from 'react';

// ── Icon Components ──
const UserIcon = ({ className = '' }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = ({ className = '' }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PhoneIcon = ({ className = '' }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const LockIcon = ({ className = '' }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeOpenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// ── Validation helpers ──
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-+().]{7,20}$/;

function validateField(name, value) {
  if (!value.trim()) {
    const labels = { fullName: 'Full name', email: 'Email address', phone: 'Phone number', password: 'Password' };
    return `${labels[name]} is required`;
  }
  switch (name) {
    case 'fullName':
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      break;
    case 'email':
      if (!EMAIL_REGEX.test(value.trim())) return 'Please enter a valid email address';
      break;
    case 'phone':
      if (!PHONE_REGEX.test(value.trim())) return 'Please enter a valid phone number';
      break;
    case 'password':
      if (value.length < 6) return 'Password must be at least 6 characters';
      break;
  }
  return '';
}

function getPasswordStrength(pw) {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return 'weak';
  if (score <= 3) return 'medium';
  return 'strong';
}

// ── Background Particles ──
const particles = [
  { size: 300, top: '-5%', left: '10%', delay: '0s', duration: '22s' },
  { size: 200, top: '15%', left: '75%', delay: '-3s', duration: '18s' },
  { size: 150, top: '60%', left: '5%', delay: '-6s', duration: '24s' },
  { size: 250, top: '75%', left: '80%', delay: '-9s', duration: '20s' },
  { size: 120, top: '40%', left: '50%', delay: '-2s', duration: '16s' },
  { size: 180, top: '10%', left: '40%', delay: '-5s', duration: '25s' },
  { size: 100, top: '85%', left: '35%', delay: '-8s', duration: '19s' },
  { size: 220, top: '30%', left: '90%', delay: '-1s', duration: '21s' },
];

function Particles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}

// ── FormField Component ──
function FormField({ id, label, icon: Icon, type = 'text', placeholder, value, error, touched, onChange, onBlur, children }) {
  const hasError = touched && error;
  const isValid = touched && !error && value;

  const borderColor = hasError
    ? 'border-danger'
    : isValid
      ? 'border-success'
      : 'border-border focus-within:border-accent';

  const iconColor = hasError
    ? 'text-danger'
    : isValid
      ? 'text-success'
      : 'text-muted group-focus-within:text-accent';

  const bgColor = hasError
    ? 'bg-danger-bg'
    : 'bg-white/[0.04] focus-within:bg-accent/[0.04]';

  return (
    <div className="mb-5">
      <label htmlFor={id} className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className={`group relative flex items-center rounded-lg border-[1.5px] shadow-sm transition-all duration-250 ${borderColor} ${bgColor}`}>
        <span className={`absolute left-3.5 flex transition-colors duration-250 pointer-events-none ${iconColor}`}>
          <Icon />
        </span>
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete="off"
          className={`w-full py-3.5 pr-3.5 font-medium text-[0.95rem] text-[#e4e4f0] bg-transparent outline-none placeholder:text-muted/50 ${children ? 'pl-11 pr-11' : 'pl-11'}`}
        />
        {children}
      </div>
      {/* Error message with smooth reveal */}
      <div className={`overflow-hidden transition-all duration-300 ${hasError ? 'max-h-8 mt-1.5 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-xs font-medium text-danger pl-0.5">{error}</p>
      </div>
    </div>
  );
}

// ── Password Strength Bar ──
function PasswordStrength({ strength }) {
  if (!strength) return null;

  const colorMap = { weak: 'text-danger', medium: 'text-amber-400', strong: 'text-success' };
  const barClass = { weak: 'strength-weak', medium: 'strength-medium', strong: 'strength-strong' };

  return (
    <div className="flex items-center gap-2.5 mt-2 transition-all duration-300">
      <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-400 ${barClass[strength]}`} />
      </div>
      <span className={`text-[0.72rem] font-semibold uppercase tracking-wide min-w-[52px] text-right ${colorMap[strength]}`}>
        {strength}
      </span>
    </div>
  );
}

// ── Success Overlay ──
function SuccessOverlay({ show, onReset }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0f0f1a]/92 backdrop-blur-[10px] transition-all duration-400 ${show ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
    >
      <div className={`text-center ${show ? 'animate-pop-in' : ''}`}>
        {/* Animated checkmark */}
        <div className="mx-auto mb-6">
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle className="checkmark-circle" cx="32" cy="32" r="28" fill="none" stroke="#22c55e" strokeWidth="3" />
            <path className="checkmark-check" d="M20 33 l8 8 16-16" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-1.5 bg-gradient-to-br from-white to-green-300 bg-clip-text text-transparent">
          Account Created!
        </h2>
        <p className="text-muted mb-7">Your registration was successful.</p>
        <button
          id="btnReset"
          type="button"
          onClick={onReset}
          className="px-8 py-3 font-semibold text-white rounded-lg bg-gradient-to-br from-success to-green-600 shadow-[0_4px_18px_rgba(34,197,94,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(34,197,94,0.45)] transition-all duration-200 cursor-pointer"
        >
          Register Another
        </button>
      </div>
    </div>
  );
}

// ── Main App ──
export default function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error as user types
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (value.trim()) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    const allTouched = {};
    let hasError = false;

    for (const key of Object.keys(formData)) {
      allTouched[key] = true;
      const err = validateField(key, formData[key]);
      if (err) {
        newErrors[key] = err;
        hasError = true;
      }
    }

    setTouched(allTouched);
    setErrors(newErrors);

    if (hasError) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }

    // Simulate API request
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setShowSuccess(true);
  };

  const handleReset = () => {
    setShowSuccess(false);
    setFormData({ fullName: '', email: '', phone: '', password: '' });
    setErrors({});
    setTouched({});
    setShowPassword(false);
  };

  const pwStrength = getPasswordStrength(formData.password);

  return (
    <>
      <Particles />

      <main
        className="relative z-10 flex items-center justify-center min-h-screen px-5 py-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'linear-gradient(rgba(15, 15, 26, 0.8), rgba(15, 15, 26, 0.8)), url("/Job-Tasks/form/bg-image.png")' }}
      >
        {/* ── Card ── */}
        <section
          id="formCard"
          className={`w-full max-w-[480px] bg-card backdrop-blur-[24px] saturate-[1.4] rounded-[22px] border border-border shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.06),0_0_40px_rgba(124,92,252,0.15)] px-9 pt-11 pb-10 animate-fade-up ${shaking ? 'animate-shake' : ''}`}
        >
          {/* Header */}
          <div className="text-center mb-9">
            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-accent to-purple-400 text-white shadow-[0_6px_24px_rgba(124,92,252,0.35)]">
              <UserIcon className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-br from-white to-purple-300 bg-clip-text text-transparent">
              Create Your Account
            </h1>
            <p className="mt-1.5 text-sm text-muted">Fill in the details below to get started</p>
          </div>

          {/* Form */}
          <form id="registrationForm" onSubmit={handleSubmit} noValidate>
            <FormField
              id="fullName"
              label="Full Name"
              icon={UserIcon}
              placeholder="John Doe"
              value={formData.fullName}
              error={errors.fullName}
              touched={touched.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <FormField
              id="email"
              label="Email Address"
              icon={MailIcon}
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              error={errors.email}
              touched={touched.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <FormField
              id="phone"
              label="Phone Number"
              icon={PhoneIcon}
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              error={errors.phone}
              touched={touched.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <FormField
              id="password"
              label="Password"
              icon={LockIcon}
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              value={formData.password}
              error={errors.password}
              touched={touched.password}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              {/* Toggle visibility button */}
              <button
                id="togglePassword"
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 flex items-center text-muted hover:text-[#e4e4f0] transition-colors cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </button>
            </FormField>

            {/* Password strength meter */}
            {formData.password && <PasswordStrength strength={pwStrength} />}

            {/* Submit button */}
            <button
              id="btnSubmit"
              type="submit"
              disabled={isSubmitting}
              className="btn-shimmer relative w-full mt-6 py-4 font-semibold text-white rounded-lg bg-gradient-to-br from-accent to-purple-400 shadow-[0_4px_18px_rgba(124,92,252,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(124,92,252,0.45)] active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <span className="w-5 h-5 border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </section>
      </main>

      {/* Success overlay */}
      <SuccessOverlay show={showSuccess} onReset={handleReset} />
    </>
  );
}
