'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="login-wrap">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Sign in</h1>
        <p className="muted" style={{ marginBottom: 20 }}>
          Sign in to manage stories for The Cell Signal.
        </p>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@czrobio.com"
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </div>
        {error && <p className="err" style={{ marginBottom: 12 }}>{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="muted" style={{ marginTop: 16 }}>
          Accounts are created in the Supabase dashboard under Authentication &rarr; Users.
        </p>
      </form>
    </div>
  );
}
