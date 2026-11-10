
import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletError, setWalletError] = useState('');
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

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
      });

    return () => listener.subscription.unsubscribe();
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
      setWalletError('');

      const [p, w, t] = await Promise.all([
        supabase.from('profiles')
          .select('full_name, player_id, avatar_url')
          .eq('id', session.user.id)
          .single(),

        supabase.from('wallets')
          .select('balance_paise, currency')
          .eq('user_id', session.user.id)
          .maybeSingle(),

        supabase.from('wallet_transactions')
          .select('id, type, amount_paise, status, description, created_at')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      if (!active) return;

      if (p.error) {
        setMessage('Profile error: ' + p.error.message);
      } else {
        setProfile(p.data);
      }

      if (w.error) {
        setWalletError('Wallet error: ' + w.error.message);
      } else {
        setWallet(w.data);
        if (!w.data) setWalletError('Wallet record not found.');
      }

      if (t.error) {
        setWalletError(prev => prev || 'History error: ' + t.error.message);
      } else {
        setTransactions(t.data || []);
      }

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
          options: {
            data: { full_name: name.trim() }
          }
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

  if (loading) {
    return (
      <div style={page}>
        <h2 style={{ color: '#c49aff' }}>SURYA EARN</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (session && !profile) {
    return (
      <div style={page}>
        <h2 style={{ color: '#c49aff' }}>SURYA EARN</h2>
        <p>Loading player profile...</p>
        {message && <p>{message}</p>}
        <button style={button} onClick={logout}>LOGOUT</button>
      </div>
    );
  }

  if (session && profile) {
    const symbol =
      wallet?.currency && wallet.currency !== 'INR'
        ? wallet.currency + ' '
        : '₹';

    return (
      <div style={page}>
        <div style={container}>
          <h1 style={{ color: '#c49aff', textAlign: 'center' }}>
            SURYA EARN
          </h1>
          <p style={{ color: '#aaa', textAlign: 'center' }}>
            Your earning journey starts here
          </p>

          <div style={panel}>
            <h2>Welcome, {profile.full_name || 'Player'} 👋</h2>
            <p style={{ color: '#c49aff' }}>PLAYER ID</p>
            <h3>{profile.player_id || 'Not assigned'}</h3>
            <p style={{ color: '#aaa' }}>{session.user.email}</p>
          </div>

          <div style={panel}>
            <p style={{ color: '#c49aff' }}>MY WALLET</p>
            {wallet ? (
              <h1>
                {symbol}
                {(Number(wallet.balance_paise || 0) / 100).toFixed(2)}
              </h1>
            ) : (
              <h2>Balance unavailable</h2>
            )}
            {walletError && (
              <p style={{ color: '#ffaaaa' }}>{walletError}</p>
            )}
            <p style={{ color: '#aaa', fontSize: 12 }}>
              Your account wallet balance
            </p>
          </div>

          <div style={panel}>
            <h3>RECENT TRANSACTIONS</h3>

            {transactions.length === 0 ? (
              <p style={{ color: '#aaa' }}>No transactions yet.</p>
            ) : (
              transactions.map(tx => (
                <div key={tx.id} style={transactionRow}>
                  <div>
                    <strong>{tx.description || tx.type || 'Transaction'}</strong>
                    <p style={{ color: '#aaa', fontSize: 12 }}>
                      {new Date(tx.created_at).toLocaleString()}
                    </p>
                    <p style={{ color: '#aaa', fontSize: 12 }}>
                      {tx.status || 'Pending'}
                    </p>
                  </div>
                  <strong>
                    {symbol}
                    {(Number(tx.amount_paise || 0) / 100).toFixed(2)}
                  </strong>
                </div>
              ))
            )}
          </div>

          <div style={tiles}>
            {[
              'My Profile',
              'Deposit',
              'Withdraw',
              'Games',
              'Refer & Earn',
              'Activity History'
            ].map(item => (
              <div key={item} style={tile}>
                {item}
                <p style={{ color: '#aaa', fontSize: 12 }}>
                  Coming soon
                </p>
              </div>
            ))}
          </div>

          <p style={{ color: '#ffcc99', fontSize: 12 }}>
            Deposits and withdrawals are not enabled yet.
          </p>

          <button style={button} onClick={logout}>
            LOGOUT
          </button>

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
        <h1 style={{ color: '#c49aff', textAlign: 'center' }}>
          SURYA EARN
        </h1>
        <p style={{ color: '#aaa', textAlign: 'center' }}>
          Your earning journey starts here
        </p>

        <h2>{mode === 'login' ? 'Welcome Back!' : 'Create Account'}</h2>

        {mode === 'register' && (
          <input
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={field}
          />
        )}

        <input
          placeholder="Email Address"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={field}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={field}
        />

        <button
          style={button}
          disabled={submitting}
          onClick={handleSubmit}
        >
          {submitting
            ? 'PLEASE WAIT...'
            : mode === 'login' ? 'LOGIN' : 'REGISTER'}
        </button>

        {message && <p style={{ color: '#d5b8ff' }}>{message}</p>}

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
  padding: 20,
  fontFamily: 'Arial'
};

const container = {
  maxWidth: 420,
  margin: '30px auto',
  padding: 22,
  background: '#171426',
  borderRadius: 20,
  border: '1px solid #49316b'
};

const panel = {
  background: '#29213d',
  padding: 18,
  borderRadius: 14,
  marginBottom: 18
};

const tiles = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
  marginBottom: 20
};

const tile = {
  background: '#38245b',
  padding: 18,
  borderRadius: 12,
  textAlign: 'center'
};

const transactionRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
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
