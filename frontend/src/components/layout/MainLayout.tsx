import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const MainLayout = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md glass-surface p-8 rounded-[32px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl"></div>
          <Link to="/" className="flex justify-center h-10 mb-8 select-none text-primary">
            <img src="/logo.svg" alt="SkillForge Logo" className="h-full w-auto" />
          </Link>
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md selection:bg-secondary/40">
      {/* TopAppBar */}
      <header className="fixed top-0 right-0 w-full h-16 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 flex justify-between items-center px-8 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center h-8 select-none text-primary">
              <img src="/logo.svg" alt="SkillForge Logo" className="h-full w-auto" />
            </Link>
            <span className="h-5 w-[1px] bg-outline/30 hidden sm:block"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase hidden sm:block">EXECUTIVE PORTAL</span>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/catalog" className={`font-label-md text-label-md transition-all hover:scale-105 ${location.pathname === '/catalog' ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}>Explore</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className={`font-label-md text-label-md transition-all hover:scale-105 ${location.pathname === '/dashboard' ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}>My Learning</Link>
            )}
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary hover:scale-105 transition-transform" href="#">Resources</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline/30 focus-within:ring-1 focus-within:ring-primary/50">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-body-sm w-48 text-on-surface placeholder:text-on-surface-variant/50 outline-none" placeholder="Search skills..." type="text"/>
          </div>
          <div className="flex items-center gap-3">
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">notifications</button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3 ml-2">
                <div className="w-10 h-10 rounded-full border border-primary/20 bg-secondary flex items-center justify-center text-primary font-bold">
                  {user?.firstName?.charAt(0)}
                </div>
                <button onClick={logout} className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors">logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="font-label-md text-label-md text-on-surface-variant hover:text-primary">Login</Link>
                <Link to="/register" className="px-5 py-2 cta-gradient text-white font-label-md text-label-md rounded-lg hover:scale-105 transition-all shadow-md">Join Free</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-surface-container w-full py-12 border-t border-outline/20 mt-24">
        <div className="max-w-7xl mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <div className="h-8 text-primary select-none">
              <img src="/logo.svg" alt="SkillForge Logo" className="h-full w-auto" />
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
              SkillForge Precision-Engineered Learning. Empowering the next generation of technical leaders.
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant/50">© 2026 SkillForge LMS.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-colors" href="#">Privacy Policy</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-colors" href="#">Terms of Service</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-colors" href="#">Contact Support</a>
          </div>
          <div className="flex gap-6">
            <a className="w-10 h-10 glass-surface rounded-full flex items-center justify-center hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined text-[20px]">public</span></a>
            <a className="w-10 h-10 glass-surface rounded-full flex items-center justify-center hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined text-[20px]">share</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
