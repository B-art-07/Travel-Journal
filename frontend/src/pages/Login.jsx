import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Send the login request to the backend
      const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("🔥 Login Success! Token received.");
        localStorage.setItem('token', data.token); // Save the passport
        navigate('/dashboard'); // Jump to the dashboard
      } else {
        setError(data.message || 'Invalid email or password.');
      }
    } catch (err) {
      console.error(err);
      setError('Cannot connect to server. Is the backend running?');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 font-sans relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#d946ef_1px,transparent_1px),linear-gradient(to_bottom,#d946ef_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 animate-grid-scan"></div>
      <div className="absolute inset-0 bg-slate-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_80%)] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-fuchsia-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="animate-entrance relative z-10 w-full max-w-md">
        <div className="animate-hover">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-8 sm:p-10 rounded-2xl shadow-[0_0_40px_-10px_rgba(217,70,239,0.3)] w-full">
            
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.4)] tracking-wide mb-2 uppercase">
                System Login
              </h2>
              <p className="text-fuchsia-400/70 text-sm tracking-widest">AUTHENTICATE TO ACCESS JOURNAL</p>
            </div>
            
            {/* Display error message if it exists */}
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-400 text-sm font-bold text-center tracking-wider">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-slate-300 text-xs font-bold mb-2 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full bg-slate-950/50 border border-slate-700 px-4 py-3 rounded-lg text-cyan-50 placeholder-slate-600 focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 focus:shadow-[0_0_15px_rgba(217,70,239,0.4)] transition-all duration-300" 
                  placeholder="system@travel.com" 
                />
              </div>
              <div>
                <label className="block text-slate-300 text-xs font-bold mb-2 uppercase tracking-wider">Secret Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="w-full bg-slate-950/50 border border-slate-700 px-4 py-3 rounded-lg text-cyan-50 placeholder-slate-600 focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 focus:shadow-[0_0_15px_rgba(217,70,239,0.4)] transition-all duration-300" 
                  placeholder="••••••••" 
                />
              </div>
              
              <button type="submit" className="w-full mt-6 bg-transparent border-2 border-fuchsia-500 text-fuchsia-400 font-bold py-3 rounded-lg hover:bg-fuchsia-500 hover:text-slate-950 hover:shadow-[0_0_20px_rgba(217,70,239,0.6)] transition-all duration-300 uppercase tracking-widest relative overflow-hidden group">
                <span className="relative z-10 group-hover:text-slate-950 transition-colors duration-300">Access Network</span>
                <div className="absolute inset-0 bg-fuchsia-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              No access credentials? <Link to="/register" className="text-cyan-400 font-bold hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all">Initialize here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;