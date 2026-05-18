import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/signin', { email, password });
      const { token, ...user } = response.data;
      login(user, token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8 relative z-10">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Welcome Back</h1>
        <p className="font-label-md text-label-md text-on-surface-variant">Sign in to your SkillForge account</p>
      </div>
      
      {error && (
        <div className="bg-error-container/20 border border-error/30 text-error p-4 rounded-2xl mb-6 font-label-md text-label-md text-center animate-pulse">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="space-y-2">
          <label className="block font-label-md text-label-md text-on-surface font-semibold">Email</label>
          <div className="relative flex items-center bg-surface-container-low/40 px-4 py-3 rounded-2xl border border-outline/25 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300">
            <Mail className="h-5 w-5 text-on-surface-variant mr-3" />
            <input 
              type="email" 
              required
              className="w-full bg-transparent border-none focus:ring-0 outline-none text-on-surface placeholder:text-on-surface-variant/40 font-body-md text-body-md"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block font-label-md text-label-md text-on-surface font-semibold">Password</label>
          <div className="relative flex items-center bg-surface-container-low/40 px-4 py-3 rounded-2xl border border-outline/25 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300">
            <Lock className="h-5 w-5 text-on-surface-variant mr-3" />
            <input 
              type="password" 
              required
              className="w-full bg-transparent border-none focus:ring-0 outline-none text-on-surface placeholder:text-on-surface-variant/40 font-body-md text-body-md"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold btn-premium-primary shadow-xl mt-6 disabled:opacity-70 flex justify-center items-center gap-2 cursor-pointer font-label-md text-label-md animate-glow"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Authenticating...</span>
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
      
      <div className="mt-8 text-center font-label-md text-label-md text-on-surface-variant relative z-10 border-t border-outline/20 pt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary hover:underline font-bold transition-all">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
