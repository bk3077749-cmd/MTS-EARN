
import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession)
    );

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      if (!session?.user) {
        setProfile(null);
        setWallet(null);
        setTransactions([]);
        return;
      }

      setLoading(true);

      const [p, w, t] = await Promise.all([
        supabase.from('profiles')
          .select('full_name, player_id, avatar_url')
          .eq('id', session.user.id).single(),

        supabase.from('wallets')
          .select('balance_paise, currency')
          .eq('user_id', session.user.id).maybeSingle(),

        supabase.from('wallet_transactions')
          .select('id, type, amount_paise, status, description, created_at')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      if (!active) return;

      if (p.error) setMessage(p.error.message);
      else setProfile(p.data);

      if (w.error) setMessage(w.error.message);
      else setWallet(w.data);

      if (t.error) setMessage(t.error.message);
      else setTransactions(t.data || []);

      setLoading(false);
    }

    loadDashboard();
    return () => { active = false; };
  }, [session]);

  async function handleSubmit() {
    setMessage('');

    if (!email.trim() || !password) {
      setMessage('Email and password required');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setMessage('Please enter your full name');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: name.trim() } }
        });

        if (error) throw error;
        setMessage('Account created! Please confirm your email.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (error) throw error;
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setProfile(null);
    setWallet(null);
    setTransactions([]);
    setMessage('');
  }

  const money = (paise) =>
    '₹' + (Number(paise || 0) / 100).toFixed(2);

  if (loading) {
    return <div style={page}><h2>SURYA EARN</h2>Loading...</div>;
  }

  if (session && !profile) {
    return (
      <div style={page}>
        <h2>SURYA EARN</h2>
        <p>Loading player profile...</p>
        {message && <p>{message}</p>}
        <button style={button} onClick={logout}>LOGOUT</button>
      </div>
    );
  }

  if (session && profile) {
    return (
      <div style={page}>
        <div style={container}>
          <header style={header}>
            <div>
              <h1 style={{ margin: 0, color: '#d7b5ff' }}>SURYA EARN</h1>
              <small>Your earning journey starts here</small>
            </div>
            <div style={avatar}>S</div>
          </header>

          <section style={welcome}>
            <p style={{ color: '#c8a2ff' }}>WELCOME BACK 👋</p>
            <h2>{profile.full_name || 'Player'}</h2>
            <small>{session.user.email}</small>
            <p style={{ marginBottom: 0 }}>
              PLAYER ID: <b>{profile.player_id || 'Not assigned'}</b>
            </p>
          </section>

          <section style={walletCard}>
            <small>MY WALLET BALANCE</small>
            <h1 style={{ fontSize: 36, margin: '12px 0' }}>
              {wallet ? money(wallet.balance_paise) : 'Unavailable'}
            </h1>
            <small>Available account balance</small>
          </section>

          <h3>QUICK SERVICES</h3>
          <div style={grid}>
            {[
              ['👤', 'My Profile'],
              ['➕', 'Deposit'],
              ['💸', 'Withdraw'],
              ['🎮', 'Games'],
              ['🎁', 'Refer & Earn'],
              ['📜', 'Activity History']
            ].map(([emoji, label]) => (
              <div style={tile} key={label}>
                <div style={{ fontSize: 30 }}>{emoji}</div>
                <b>{label}</b>
                <small style={{ display: 'block', marginTop: 8 }}>
                  Coming soon
                </small>
              </div>
            ))}
          </div>

          <section style={panel}>
            <h3>RECENT TRANSACTIONS</h3>
            {transactions.length === 0 ? (
              <p style={{ color: '#aaa' }}>No transactions yet.</p>
            ) : transactions.map(tx => (
              <div key={tx.id} style={transactionRow}>
                <div>
                  <b>{tx.description || tx.type}</b>
                  <small style={{ display: 'block', color: '#aaa' }}>
                    {new Date(tx.created_at).toLocaleString()}
                  </small>
                  <small style={{ color: '#c8a2ff' }}>
                    {tx.status}
                  </small>
                </div>
                <b>{money(tx.amount_paise)}</b>
              </div>
            ))}
          </section>

          {message && <p style={{ color: '#ffaaaa' }}>{message}</p>}

          <p style={{ color: '#ffc98a', fontSize: 12 }}>
            Deposit and withdrawal services are not enabled yet.
          </p>

          <button style={button} onClick={logout}>LOGOUT</button>
          <p style={{ textAlign: 'center', color: '#888' }}>
            SURYA EARN © 2026
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={container}>
        <h1 style={{ textAlign: 'center', color: '#d7b5ff' }}>
          SURYA EARN
        </h1>
        <p style={{ textAlign: 'center', color: '#aaa' }}>
          Your earning journey starts here
        </p>

        <h2>{mode === 'login' ? 'Welcome Back!' : 'Create Account'}</h2>

        {mode === 'register' && (
          <input
            style={field}
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        )}

        <input
          style={field}
          placeholder="Email Address"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          style={field}
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          style={button}
          disabled={submitting}
          onClick={handleSubmit}
        >
          {submitting ? 'PLEASE WAIT...' :
            mode === 'login' ? 'LOGIN' : 'REGISTER'}
        </button>

        {message && <p style={{ color: '#d7b5ff' }}>{message}</p>}

        <button
          style={{ ...button, background: '#38245b', marginTop: 15 }}
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setMessage('');
          }}
        >
          {mode === 'login' ? 'CREATE NEW ACCOUNT' : 'BACK TO LOGIN'}
        </button>
      </div>
    </div>
  );
}

const page = {
  minHeight: '100vh',
  background: '#090714',
  color: 'white',
  padding: 16,
  fontFamily: 'Arial, sans-serif'
};

const container = {
  maxWidth: 450,
  margin: '15px auto',
  padding: 20,
  background: '#171426',
  borderRadius: 22,
  border: '1px solid #49316b'
};

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 25
};

const avatar = {
  background: '#813fe0',
  borderRadius: '50%',
  width: 45,
  height: 45,
  display: 'grid',
  placeItems: 'center',
  fontSize: 22,
  fontWeight: 'bold'
};

const welcome = {
  background: '#29213d',
  padding: 18,
  borderRadius: 16,
  marginBottom: 18
};

const walletCard = {
  background: 'linear-gradient(135deg,#813fe0,#39205e)',
  padding: 22,
  borderRadius: 18,
  marginBottom: 25
};

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 12,
  marginBottom: 25
};

const tile = {
  background: '#29213d',
  padding: 18,
  borderRadius: 15,
  textAlign: 'center',
  border: '1px solid #49316b'
};

const panel = {
  background: '#29213d',
  padding: 18,
  borderRadius: 15,
  marginBottom: 20
};

const transactionRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 10,
  padding: '12px 0',
  borderBottom: '1px solid #49316b'
};

const field = {
  width: '100%',
  boxSizing: 'border-box',
  padding: 15,
  marginBottom: 15,
  background: '#090914',
  color: 'white',
  border: '1px solid #49316b',
  borderRadius: 10,
  fontSize: 16
};

const button = {
  width: '100%',
  padding: 15,
  background: '#813fe0',
  color: 'white',
  border: 0,
  borderRadius: 10,
  fontWeight: 'bold',
  fontSize: 16,
  cursor: 'pointer'
};
