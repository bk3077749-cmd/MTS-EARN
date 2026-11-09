
import React, { useState } from 'react';
import {
  Home, Wallet, Gamepad2, ListTodo,
  Users, History, User, Globe
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState('en');
  const [page, setPage] = useState('Home');

  const tamil = language === 'ta';
  const menu = [
    ['Home', Home],
    ['Wallet', Wallet],
    ['Games', Gamepad2],
    ['Tasks', ListTodo],
    ['Referrals', Users],
    ['Activity', History]
  ];

  const labels = {
    Home: tamil ? 'முகப்பு' : 'Home',
    Wallet: tamil ? 'பணப்பை' : 'Wallet',
    Games: tamil ? 'விளையாட்டுகள்' : 'Games',
    Tasks: tamil ? 'வேலைகள்' : 'Tasks',
    Referrals: tamil ? 'நண்பர்கள்' : 'Referrals',
    Activity: tamil ? 'வரலாறு' : 'Activity'
  };

  return (
    <div className="app">
      <header className="header">
        <h1>SURYA EARN</h1>
        <button onClick={() => setLanguage(tamil ? 'en' : 'ta')}>
          <Globe size={18} /> {tamil ? 'English' : 'தமிழ்'}
        </button>
      </header>

      <main className="main">
        <p>{tamil ? 'வணக்கம்!' : 'Welcome!'}</p>
        <h2>{tamil ? 'உங்கள் கணக்கு' : 'Your Dashboard'}</h2>

        <section className="wallet-card">
          <p>{tamil ? 'Wallet Balance' : 'Wallet Balance'}</p>
          <h1>₹0.00</h1>
          <small>Player ID: MTS-000001</small>
        </section>

        <h3>{labels[page]}</h3>
        <p>
          {page === 'Home'
            ? (tamil ? 'SURYA EARN செயலிக்கு வரவேற்கிறோம்' : 'Welcome to SURYA EARN')
            : labels[page] + ' - Coming soon'}
        </p>
      </main>

      <nav className="navigation">
        {menu.map(([name, Icon]) => (
          <button
            key={name}
            className={page === name ? 'active' : ''}
            onClick={() => setPage(name)}
          >
            <Icon size={20} />
            <span>{labels[name]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
