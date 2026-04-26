import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCredentials, logout } from './store/userSlice';
import type { RootState } from './store';

import PolicyTranslator from './pages/PolicyTranslator';
import Booth from './pages/Booth';
import TrackMyVote from './pages/TrackMyVote';
import MisinfoLab from './pages/MisinfoLab';

const API_URL = 'http://localhost:3001/api';

function Navigation() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-primary text-primary-foreground p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-bold tracking-tight">VoteVault</Link>
          <div className="hidden md:flex space-x-6">
            <Link to="/translator" className="hover:opacity-80 transition-opacity text-sm font-medium">Policy Translator</Link>
            <Link to="/booth" className="hover:opacity-80 transition-opacity text-sm font-medium">The Booth</Link>
            <Link to="/track" className="hover:opacity-80 transition-opacity text-sm font-medium">Track My Vote</Link>
            <Link to="/misinfo" className="hover:opacity-80 transition-opacity text-sm font-medium">Misinfo Lab</Link>
          </div>
        </div>
        <div className="space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm">Welcome, {user?.display_name || user?.email}</span>
              <button onClick={handleLogout} className="hover:underline text-sm">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function Home() {
  return (
    <div className="container mx-auto p-8 text-center space-y-6">
      <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-primary">Understand, Prepare, Vote with Confidence</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        A unified web platform that transforms election participation through interactive education, confidence building, and transparency.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
        <Link to="/translator" className="p-6 border rounded-lg shadow-sm bg-card text-card-foreground hover:shadow-md transition-shadow group">
          <div className="text-2xl mb-2">🏛️</div>
          <h3 className="font-bold text-lg mb-2">Policy Translator</h3>
          <p className="text-sm text-muted-foreground">Personalized impact dashboard</p>
          <p className="text-xs text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity">Explore →</p>
        </Link>
        <Link to="/booth" className="p-6 border rounded-lg shadow-sm bg-card text-card-foreground hover:shadow-md transition-shadow group">
          <div className="text-2xl mb-2">🗳️</div>
          <h3 className="font-bold text-lg mb-2">The Booth</h3>
          <p className="text-sm text-muted-foreground">Interactive 3D voting simulator</p>
          <p className="text-xs text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity">Enter →</p>
        </Link>
        <Link to="/track" className="p-6 border rounded-lg shadow-sm bg-card text-card-foreground hover:shadow-md transition-shadow group">
          <div className="text-2xl mb-2">🔍</div>
          <h3 className="font-bold text-lg mb-2">Track My Vote</h3>
          <p className="text-sm text-muted-foreground">Integrity tunnel visualization</p>
          <p className="text-xs text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity">Explore →</p>
        </Link>
        <Link to="/misinfo" className="p-6 border rounded-lg shadow-sm bg-card text-card-foreground hover:shadow-md transition-shadow group">
          <div className="text-2xl mb-2">🔬</div>
          <h3 className="font-bold text-lg mb-2">Misinformation Lab</h3>
          <p className="text-sm text-muted-foreground">Media literacy game · 5 levels</p>
          <p className="text-xs text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity">Play →</p>
        </Link>
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      dispatch(setCredentials({ token: response.data.token, user: response.data.user }));
      navigate('/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to login');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-md mt-10">
      <div className="border rounded-lg shadow-sm bg-card p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold">Login</h2>
          <p className="text-muted-foreground">Enter your credentials to access your VoteVault.</p>
        </div>
        {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voter@example.com"
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" disabled={isLoading} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Register() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { email, password, displayName });
      dispatch(setCredentials({ token: response.data.token, user: response.data.user }));
      navigate('/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to register');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-md mt-10">
      <div className="border rounded-lg shadow-sm bg-card p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="text-muted-foreground">Start your voting journey today.</p>
        </div>
        {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">{error}</div>}
        <form onSubmit={handleRegister} className="space-y-4">
           <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="name">Display Name</label>
            <input 
              id="name"
              type="text" 
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Jane Doe"
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voter@example.com"
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" disabled={isLoading} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
      <Router>
        <Navigation />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/translator" element={<PolicyTranslator />} />
            <Route path="/booth" element={<Booth />} />
            <Route path="/track" element={<TrackMyVote />} />
            <Route path="/misinfo" element={<MisinfoLab />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
