
import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function loadProfile() {
      if (!session?.user) {
        setProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, player_id, avatar_url')
        .eq('id', session.user.id)
        .single();

      if (error) {
        setMessage('Profile loading error: ' + error.message);
        return;
      }

      setProfile(data);
    }

    loadProfile();
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

    setLoading(true);

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
      setLoading(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setProfile(null);
    setMessage('');
  }

  if (session && !profile) {
    return (
      <div style={page}>
        <h2 style={{ color: '#c49aff' }}>SURYA EARN</h2>
        <p>Loading your player profile...</p>
        {message && <p>{message}</p>}
      </div>
    );
  }

  if (session && profile) {
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
            <h1>₹0.00</h1>
            <p style={{ color: '#aaa' }}>
              Wallet transactions will be connected next.
            </p>
          </div>

          <div style={tiles}>
            {['My Profile', 'Deposit', 'Withdraw', 'Games',
              'Refer & Earn', 'Activity History'].map(item => (
              <div key={item} style={tile}>
                {item}
                <p style={{ color: '#aaa', fontSize: 12 }}>
                  Coming soon
                </p>
              </div>
            ))}
          </div>

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

        <button style={button} disabled={loading} onClick={handleSubmit}>
          {loading ? 'PLEASE WAIT...' :
            mode === 'login' ? 'LOGIN' : 'REGISTER'}
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
