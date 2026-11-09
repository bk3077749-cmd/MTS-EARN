
import React, { useState } from 'react';

export default function App() {
  const [page, setPage] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const admin = email === 'admin@suryaearn.com' &&
                password === 'admin123';

  if (page === 'admin' || page === 'home') {
    return (
      <div className="app">
        <header className="header">
          <h1>SURYA EARN</h1>
          <button onClick={() => setPage('login')}>Logout</button>
        </header>

        <main className="main">
          <h2>{page === 'admin' ? 'Admin Dashboard' : 'Player Dashboard'}</h2>

          {page === 'admin' ? (
            <>
              <section className="wallet-card">
                <p>Total Players</p>
                <h1>0</h1>
              </section>
              <section className="wallet-card">
                <p>Deposit Requests</p>
                <h1>0</h1>
              </section>
              <section className="wallet-card">
                <p>Platform Wallet (Demo)</p>
                <h1>₹0</h1>
              </section>
              <h3>Admin Controls</h3>
              <p>Player Management</p>
              <p>Deposit Review</p>
              <p>Activity Reports</p>
            </>
          ) : (
            <>
              <section className="wallet-card">
                <p>Wallet Balance (Demo)</p>
                <h1>₹0.00</h1>
                <small>Player ID: MTS-000001</small>
              </section>
              <h3>Welcome to SURYA EARN!</h3>
              <p>Games • Tasks • Referrals • Activity</p>
            </>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <main className="main" style={{maxWidth:420, margin:'60px auto'}}>
        <h1 style={{color:'#b78aff', textAlign:'center'}}>
          SURYA EARN
        </h1>
        <h2 style={{margin:'25px 0'}}>Login</h2>

        <input
          placeholder="Email"
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

        <button style={btn} onClick={() => {
          if (!email || !password) {
            alert('Enter email and password');
          } else if (admin) {
            setPage('admin');
          } else {
            setPage('home');
          }
        }}>
          Login
        </button>

        <p style={{marginTop:20, color:'#aaa'}}>
          Demo admin: admin@suryaearn.com
        </p>
        <p style={{color:'#aaa'}}>Demo password: admin123</p>
      </main>
    </div>
  );
}

const field = {
  width:'100%',
  padding:14,
  marginBottom:15,
  background:'#171426',
  color:'white',
  border:'1px solid #49316b',
  borderRadius:10
};

const btn = {
  width:'100%',
  padding:15,
  background:'#813fe0',
  color:'white',
  border:0,
  borderRadius:10
};

import React, { useState } from 'react';

export default function App() {
  const [mode, setMode] = useState('login');
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  if (loggedIn) {
    return (
      <div className="app">
        <header className="header">
          <h1>SURYA EARN</h1>
          <button onClick={() => setLoggedIn(false)}>
            Logout
          </button>
        </header>
        <main className="main">
          <h2>Welcome, {user || 'Player'}!</h2>
          <section className="wallet-card">
            <p>Wallet Balance</p>
            <h1>₹0.00</h1>
            <small>Player ID: MTS-000001</small>
          </section>
          <h3>Your Dashboard</h3>
          <p>Games • Tasks • Referrals • Activity</p>
          <p>Welcome to SURYA EARN!</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <div style={{
        maxWidth: 420,
        margin: '60px auto',
        padding: 24
      }}>
        <h1 style={{
          color: '#b78aff',
          textAlign: 'center',
          fontSize: 32
        }}>
          SURYA EARN
        </h1>

        <p style={{
          textAlign: 'center',
          margin: 15,
          color: '#aaa'
        }}>
          Welcome to your earning journey
        </p>

        <div style={{
          background: '#171426',
          padding: 24,
          borderRadius: 20,
          border: '1px solid #49316b'
        }}>
          <h2 style={{ marginBottom: 20 }}>
            {mode === 'login' ? 'Login' : 'Create Account'}
          </h2>

          {mode === 'register' && (
            <input
              placeholder="Full Name"
              value={user}
              onChange={e => setUser(e.target.value)}
              style={fieldStyle}
            />
          )}

          <input
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={fieldStyle}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={fieldStyle}
          />

          <button
            onClick={() => {
              if (!email || !password ||
                (mode === 'register' && !user)) {
                alert('Please fill all required fields');
                return;
              }
              setLoggedIn(true);
            }}
            style={buttonStyle}
          >
            {mode === 'login' ? 'Login' : 'Register'}
          </button>

          <p style={{
            textAlign: 'center',
            marginTop: 20,
            color: '#ccc'
          }}>
            {mode === 'login'
              ? "Don't have an account?"
              : 'Already have an account?'}
          </p>

          <button
            onClick={() =>
              setMode(mode === 'login' ? 'register' : 'login')
            }
            style={{
              ...buttonStyle,
              background: '#38245b',
              marginTop: 10
            }}
          >
            {mode === 'login'
              ? 'Create New Account'
              : 'Go to Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

const fieldStyle = {
  width: '100%',
  padding: 14,
  marginBottom: 15,
  borderRadius: 10,
  border: '1px solid #49316b',
  background: '#090914',
  color: 'white',
  fontSize: 16
};

const buttonStyle = {
  width: '100%',
  padding: 14,
  borderRadius: 10,
  background: '#813fe0',
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  border: 'none',
  cursor: 'pointer'
};
