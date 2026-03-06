'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, validateEmail } from '@/context/AuthContext';
import { Wind, Mail, Lock, Eye, EyeOff, User, ArrowLeft, ShieldCheck, RefreshCw } from 'lucide-react';

type View = 'login' | 'signup' | 'verify';

export default function LoginPage() {
  const { login, register, checkEmailVerified, resendVerification } = useAuth();
  const router = useRouter();

  const [view, setView] = useState<View>('login');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup fields
  const [signupEmail, setSignupEmail] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');

  // Verify state
  const [pendingEmail, setPendingEmail] = useState('');

  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(loginEmail, loginPassword);
    setLoading(false);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailErr = validateEmail(signupEmail);
    if (emailErr) { setError(emailErr); return; }
    if (!signupUsername.trim()) { setError('Username is required.'); return; }
    if (signupPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (signupPassword !== signupConfirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    const result = await register(signupEmail, signupUsername, signupPassword);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Registration failed.');
      return;
    }

    setPendingEmail(signupEmail);
    setView('verify');
  };

  const handleCheckVerified = async () => {
    setError('');
    setInfo('');
    setLoading(true);
    const result = await checkEmailVerified();
    setLoading(false);
    if (result.verified) {
      setView('login');
      setInfo('Email verified! You can now log in.');
      setSignupEmail('');
      setSignupUsername('');
      setSignupPassword('');
      setSignupConfirm('');
    } else {
      setError('Your email is not verified yet. Please click the link in the email first.');
    }
  };

  const handleResend = async () => {
    setError('');
    setInfo('');
    setLoading(true);
    const result = await resendVerification();
    setLoading(false);
    if (result.success) {
      setInfo('Verification email resent! Check your inbox.');
    } else {
      setError(result.error || 'Could not resend email.');
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#1a0a1f] to-[#0f0a1a] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-md px-6 relative z-10">
        <div className="bg-gray-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 shadow-2xl">

          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                <Wind className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Air Quality</h1>
                <p className="text-sm text-purple-300">Monitor</p>
              </div>
            </div>
          </div>

          {/* LOGIN VIEW */}
          {view === 'login' && (
            <>
              <h2 className="text-xl font-semibold text-white mb-6 text-center">Welcome Back</h2>
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className={`${inputClass} pl-10`}
                      placeholder="you@gmail.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className={`${inputClass} pl-10 pr-10`}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {info && (
                  <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm">
                    {info}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white py-3 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-400">
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => { setView('signup'); setError(''); setInfo(''); }}
                  className="text-purple-400 hover:text-purple-300 font-medium"
                >
                  Create one
                </button>
              </p>
              <p className="mt-2 text-center text-xs text-gray-600">
                Accepted: @gmail.com &middot; @outlook.com &middot; @icloud.com
              </p>
            </>
          )}

          {/* SIGN UP VIEW */}
          {view === 'signup' && (
            <>
              <button
                onClick={() => { setView('login'); setError(''); setInfo(''); }}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to login
              </button>
              <h2 className="text-xl font-semibold text-white mb-6 text-center">Create Account</h2>

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className={`${inputClass} pl-10`}
                      placeholder="you@gmail.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      className={`${inputClass} pl-10`}
                      placeholder="Choose a username"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className={`${inputClass} pl-10 pr-10`}
                      placeholder="At least 6 characters"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={signupConfirm}
                      onChange={(e) => setSignupConfirm(e.target.value)}
                      className={`${inputClass} pl-10 pr-10`}
                      placeholder="Repeat your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white py-3 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-gray-600">
                Accepted: @gmail.com &middot; @outlook.com &middot; @icloud.com
              </p>
            </>
          )}

          {/* VERIFY VIEW */}
          {view === 'verify' && (
            <>
              <div className="flex justify-center mb-4">
                <div className="bg-purple-500/20 p-4 rounded-full">
                  <ShieldCheck className="w-10 h-10 text-purple-400" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2 text-center">Verify Your Email</h2>
              <p className="text-sm text-gray-400 text-center mb-1">
                A verification link was sent to
              </p>
              <p className="text-sm text-purple-300 text-center font-medium mb-5">{pendingEmail}</p>

              <div className="bg-gray-800/50 border border-purple-500/20 rounded-xl p-4 mb-5 text-sm text-gray-300 space-y-2">
                <p>1. Open your email inbox.</p>
                <p>2. Click the verification link from Firebase / Air Quality Monitor.</p>
                <p>3. Return here and click <span className="text-purple-300 font-medium">I&apos;ve Verified My Email</span>.</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}
              {info && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm mb-4">
                  {info}
                </div>
              )}

              <button
                onClick={handleCheckVerified}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white py-3 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30 mb-3"
              >
                {loading ? 'Checking...' : "I've Verified My Email"}
              </button>

              <button
                onClick={handleResend}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-400 hover:text-purple-300 transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" /> Resend verification email
              </button>

              <button
                onClick={() => { setView('signup'); setError(''); setInfo(''); }}
                className="mt-2 w-full text-center text-sm text-gray-500 hover:text-white transition-colors"
              >
                &larr; Back to sign up
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
