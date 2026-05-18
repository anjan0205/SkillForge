import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let endpoint = '';
        if (user?.role === 'ROLE_INSTRUCTOR') {
          endpoint = `/courses/instructor/${user.id}`;
        } else if (user?.role === 'ROLE_STUDENT') {
          endpoint = `/courses/student/${user.id}`;
        } else {
          endpoint = '/courses'; // Admin sees all
        }
        
        const response = await api.get(endpoint);
        setCourses(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard courses", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="p-4 md:p-8 space-y-6 bg-background text-on-background animate-[fadeIn_0.4s_ease-out]">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[40px] p-8 lg:p-12 bg-surface-container border border-outline-variant/30 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm mb-4 border border-primary/20 font-bold">
              {today}
            </span>
            <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-3 tracking-tight font-black">
              Welcome back, <span className="text-primary-container">{user?.firstName}!</span>
            </h2>
            <div className="flex items-center gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-primary">format_quote</span>
              <p className="font-body-lg text-body-lg italic leading-relaxed font-medium">
                "The only way to do great work is to love what you do." — Steve Jobs
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 text-center min-w-[140px] shadow-xs">
              <p className="text-primary font-display-lg text-headline-lg font-black">85%</p>
              <p className="text-on-surface-variant font-label-sm text-label-sm font-bold uppercase tracking-widest">Attendance</p>
            </div>
            <div className="bg-primary p-6 rounded-2xl text-white text-center min-w-[140px] shadow-md shadow-primary/10">
              <p className="font-display-lg text-headline-lg font-black">A+</p>
              <p className="text-white/80 font-label-sm text-label-sm font-bold uppercase tracking-widest">Average</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group bg-surface-container p-6 rounded-[32px] border border-outline-variant/30 hover:border-primary/30 transition-all duration-300 relative overflow-hidden shadow-xs">
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined !text-3xl">auto_stories</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
                {user?.role === 'ROLE_INSTRUCTOR' ? 'Total Courses' : 'Courses In Progress'}
              </p>
              <p className="font-headline-lg text-headline-lg font-black text-primary mt-0.5">{courses.length.toString().padStart(2, '0')}</p>
            </div>
          </div>
        </div>
        <div className="group bg-surface-container p-6 rounded-[32px] border border-outline-variant/30 hover:border-primary/30 transition-all duration-300 relative overflow-hidden shadow-xs">
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined !text-3xl">verified</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">Completed Courses</p>
              <p className="font-headline-lg text-headline-lg font-black text-primary mt-0.5">00</p>
            </div>
          </div>
        </div>
        <div className="group bg-surface-container p-6 rounded-[32px] border border-outline-variant/30 hover:border-primary/30 transition-all duration-300 relative overflow-hidden shadow-xs">
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined !text-3xl">schedule</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">Learning Hours</p>
              <p className="font-headline-lg text-headline-lg font-black text-primary mt-0.5">00</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <section>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                <h3 className="font-headline-md text-headline-md text-primary font-black tracking-tight">
                   {user?.role === 'ROLE_INSTRUCTOR' ? 'Your Active Courses' : 'Continue Learning'}
                </h3>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : courses.length === 0 ? (
              <div className="bg-surface-container border border-outline-variant/30 p-12 rounded-[32px] text-center">
                <p className="text-on-surface-variant font-medium italic">No active courses currently being forged.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {courses.map((course, index) => (
                  <div key={course.id} className="group bg-surface-container border border-outline-variant/30 rounded-[32px] p-3 transition-all duration-300 hover:translate-y-[-4px] hover:border-primary/30 flex flex-col md:flex-row gap-6 shadow-xs hover:shadow">
                    <div className="w-full md:w-56 h-40 rounded-2xl overflow-hidden flex-shrink-0 relative">
                      <img 
                        src={course.thumbnail || `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60`} 
                        alt={course.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-label-sm font-label-sm text-primary uppercase tracking-[0.2em] mb-1 block font-bold">
                            {course.category || 'SYSTEMS'}
                          </span>
                          <h4 className="font-headline-md text-headline-md text-primary font-bold group-hover:text-primary-container transition-colors">
                            {course.title}
                          </h4>
                        </div>
                        <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full font-label-sm text-label-sm font-bold">
                          {index === 0 ? '65%' : '0%'}
                        </span>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-label-sm font-label-sm text-on-surface-variant mb-2 font-medium">
                          <span>Next: System Architecture</span>
                          <span className="font-bold text-primary">-- left</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-2 bg-outline-variant/20 rounded-full overflow-hidden relative">
                            <div className="h-full bg-primary rounded-full relative z-10" style={{ width: index === 0 ? '65%' : '0%' }}></div>
                          </div>
                          <button className="bg-primary text-white px-8 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform btn-premium-primary flex items-center gap-2">
                            Resume <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <section className="bg-surface-container border border-outline-variant/30 p-8 rounded-[32px] shadow-xs">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">Deadlines</h3>
              <button className="w-10 h-10 bg-surface-container-low border border-outline-variant/30 rounded-xl flex items-center justify-center text-primary hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined">event</span>
              </button>
            </div>
            <div className="space-y-8 relative z-10">
              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-14 h-16 bg-primary/10 rounded-2xl flex flex-col items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-all">
                  <span className="text-primary font-black text-headline-md">24</span>
                  <span className="text-primary font-bold text-[10px] uppercase tracking-widest">OCT</span>
                </div>
                <div className="flex-1">
                  <p className="font-label-md text-label-md font-bold text-primary group-hover:text-primary-container transition-colors">Core Systems Phase 1</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5 font-medium italic">Next-Gen Architecture</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-br from-primary to-primary-container p-8 rounded-[32px] shadow-lg text-white">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <span className="material-symbols-outlined">insights</span>
              </div>
              <h4 className="font-headline-md text-headline-md font-bold tracking-tight">Weekly Goal</h4>
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-3">
                <span className="font-label-sm text-label-sm text-white/70">12h / 20h completed</span>
                <span className="font-headline-lg text-headline-lg font-black">60%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-white rounded-full" style={{ width: '60%' }}></div>
              </div>
              <div className="mt-8 p-4 bg-white/10 rounded-2xl border border-white/10 italic font-body-md text-label-md">
                "Keep pushing, {user?.firstName}! Your trajectory is optimal."
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
