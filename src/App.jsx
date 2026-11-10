
import React, { useState } from 'react';

export default function App() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={{
      minHeight: '100vh',
      background: '#090714',
      color: 'white',
      padding: 20,
      fontFamily: 'Arial'
    }}>
      <div style={{
        maxWidth: 420,
        margin: '50px auto',
        padding: 25,
        background: '#171426',
        borderRadius: 20,
        border: '1px solid #49316b'
      }}>
        <h1 style={{
          color: '#b78aff',
          textAlign: 'center',
          fontSize: 32
        }}>
          SURYA EARN
        </h1>

        <p style={{textAlign:'center',color:'#aaa'}}>
          Your earning journey starts here
        </p>

        <h2>
          {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
        </h2>

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
          onClick={() => alert(
            'Supabase connection will be added next!'
          )}
        >
          {mode === 'login' ? 'LOGIN' : 'REGISTER'}
        </button>

        <button
          style={{...button, background:'#38245b',marginTop:15}}
          onClick={() => setMode(
            mode === 'login' ? 'register' : 'login'
          )}
        >
          {mode === 'login'
            ? 'CREATE NEW ACCOUNT'
            : 'BACK TO LOGIN'}
        </button>

        <p style={{
          textAlign:'center',
          color:'#999',
          marginTop:25
        }}>
          SURYA EARN © 2026
        </p>
      </div>
    </div>
  );
}

const field = {
  width:'100%',
  boxSizing:'border-box',
  padding:15,
  marginBottom:15,
  background:'#090914',
  color:'white',
  border:'1px solid #49316b',
  borderRadius:10,
  fontSize:16
};

const button = {
  width:'100%',
  padding:15,
  background:'#813fe0',
  color:'white',
  border:0,
  borderRadius:10,
  fontWeight:'bold',
  fontSize:16,
  cursor:'pointer'
};
