import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { User, Mail, Lock, Loader2, UserCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'STUDENT'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/signup', formData);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8 relative z-10">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Create Account</h1>
        <p className="font-label-md text-label-md text-on-surface-variant">Join SkillForge today</p>
      </div>
      
      {error && (
        <div className="bg-error-container/20 border border-error/30 text-error p-4 rounded-2xl mb-6 font-label-md text-label-md text-center animate-pulse">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block font-label-md text-label-md text-on-surface font-semibold">First Name</label>
            <div className="relative flex items-center bg-surface-container-low/40 px-4 py-2.5 rounded-2xl border border-outline/25 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300">
              <User className="h-4 w-4 text-on-surface-variant mr-2 flex-shrink-0" />
              <input 
                type="text" required
                className="w-full bg-transparent border-none focus:ring-0 outline-none text-on-surface placeholder:text-on-surface-variant/40 font-body-md text-body-md"
                placeholder="John"
                value={formData.firstName}
                onChange={e => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="block font-label-md text-label-md text-on-surface font-semibold">Last Name</label>
            <div className="relative flex items-center bg-surface-container-low/40 px-4 py-2.5 rounded-2xl border border-outline/25 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300">
              <input 
                type="text" required
                className="w-full bg-transparent border-none focus:ring-0 outline-none text-on-surface placeholder:text-on-surface-variant/40 font-body-md text-body-md"
                placeholder="Doe"
                value={formData.lastName}
                onChange={e => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="block font-label-md text-label-md text-on-surface font-semibold">Email</label>
          <div className="relative flex items-center bg-surface-container-low/40 px-4 py-2.5 rounded-2xl border border-outline/25 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300">
            <Mail className="h-4 w-4 text-on-surface-variant mr-2 flex-shrink-0" />
            <input 
              type="email" required
              className="w-full bg-transparent border-none focus:ring-0 outline-none text-on-surface placeholder:text-on-surface-variant/40 font-body-md text-body-md"
              placeholder="you@example.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="block font-label-md text-label-md text-on-surface font-semibold">Password</label>
          <div className="relative flex items-center bg-surface-container-low/40 px-4 py-2.5 rounded-2xl border border-outline/25 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300">
            <Lock className="h-4 w-4 text-on-surface-variant mr-2 flex-shrink-0" />
            <input 
              type="password" required minLength={6}
              className="w-full bg-transparent border-none focus:ring-0 outline-none text-on-surface placeholder:text-on-surface-variant/40 font-body-md text-body-md"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="block font-label-md text-label-md text-on-surface font-semibold">I am a...</label>
          <div className="relative flex items-center bg-surface-container-low/40 px-4 py-2.5 rounded-2xl border border-outline/25 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300">
            <UserCircle className="h-4 w-4 text-on-surface-variant mr-2 flex-shrink-0" />
            <select 
              className="w-full bg-transparent border-none focus:ring-0 outline-none text-on-surface font-body-md text-body-md cursor-pointer select-none [&>option]:bg-surface [&>option]:text-on-surface"
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
            >
              <option value="STUDENT">Student</option>
              <option value="INSTRUCTOR">Instructor</option>
            </select>
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary text-on-primary py-3.5 rounded-2xl font-bold btn-premium-primary shadow-xl mt-6 disabled:opacity-70 flex justify-center items-center gap-2 cursor-pointer font-label-md text-label-md animate-glow"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Forging Profile...</span>
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center font-label-md text-label-md text-on-surface-variant relative z-10 border-t border-outline/20 pt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline font-bold transition-all">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Register;
