import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';

const CourseCatalog = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  const categories = ['All', 'Strategy', 'Technology', 'Design', 'Finance'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      (course.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (course.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      selectedCategory === 'All' || 
      (course.category || '').toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const response = await api.get('/courses');
        if (Array.isArray(response.data)) {
          setCourses(response.data);
        } else {
          console.warn("API response is not an array. Using empty list fallback.", response.data);
          setCourses([]);
        }
      } catch (err) {
        console.error("Failed to fetch catalog", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllCourses();
  }, []);

  return (
    <div className="flex flex-col bg-background text-on-background">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden px-4 md:px-8 py-16">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 w-fit self-center lg:self-start">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase font-bold">Next-Gen LMS Platform</span>
            </div>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary leading-tight font-black tracking-tight">
              Master New Skills. <br/>
              <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">Forge Your Future.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Precision-engineered courses designed for technical professionals and executives. Harness the power of structured curriculum to build scalable industry expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start mt-4">
              <Link to="/register" className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-primary/20 animate-glow">
                Start Learning Free
              </Link>
              <button 
                onClick={() => {
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="px-8 py-4 border border-outline text-primary font-bold rounded-xl hover:bg-surface-container-low transition-all flex items-center gap-2"
              >
                View Catalog
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
          
          {/* Animated layering orbits */}
          <div className="relative flex justify-center items-center">
            <div className="relative w-64 h-64 md:w-96 md:h-96 bg-primary/5 rounded-full flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-primary/10 animate-[spin_12s_linear_infinite]"></div>
              <div className="absolute inset-6 rounded-full border border-primary/20 animate-[spin_18s_linear_infinite_reverse]"></div>
              <div className="absolute inset-12 rounded-full border border-primary/30 animate-[spin_24s_linear_infinite]"></div>
              <span className="material-symbols-outlined text-[80px] md:text-[120px] text-primary/30 drop-shadow-sm select-none">school</span>
            </div>
            {/* Decorative active indicator chips */}
            <div className="absolute top-0 right-10 bg-surface-container border border-outline-variant/30 p-4 rounded-2xl hidden md:flex items-center gap-3 shadow-sm hover:shadow transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-secondary/35 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">code</span>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Active Learners</p>
                <p className="font-body-md text-body-md font-bold text-primary">480k+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals & Institutional Banners */}
      <section className="py-12 bg-surface-container-low border-y border-outline/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-wrap justify-between items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 text-primary font-bold text-center">
            <span className="font-headline-md text-headline-md font-black tracking-widest flex-1 min-w-[120px]">QUANTUM</span>
            <span className="font-headline-md text-headline-md font-black tracking-widest flex-1 min-w-[120px]">NEURALINK</span>
            <span className="font-headline-md text-headline-md font-black tracking-widest flex-1 min-w-[120px]">CYBERCORE</span>
            <span className="font-headline-md text-headline-md font-black tracking-widest flex-1 min-w-[120px]">AXON</span>
          </div>
        </div>
      </section>

      {/* Course Catalog List */}
      <section id="catalog-section" className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto mb-12 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary font-black tracking-tight">Precision Courses</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1 font-medium">Curated academic pathways for strategic industry leaders.</p>
            </div>
            
            {/* Interactive Search Field */}
            <div className="relative w-full md:w-80 flex items-center bg-surface-container-low border border-outline-variant/30 rounded-2xl px-4 py-2.5 transition-all duration-300 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30">
              <span className="material-symbols-outlined text-on-surface-variant/50 mr-2 text-[20px]">search</span>
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none p-0 focus:ring-0 text-body-sm w-full text-on-surface placeholder:text-on-surface-variant/40 outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="material-symbols-outlined text-on-surface-variant/40 hover:text-on-surface text-[18px]"
                >
                  close
                </button>
              )}
            </div>
          </div>
          
          {/* Category Pill Filters */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-outline-variant/10">
            {categories.map(cat => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full font-label-md text-label-md font-bold transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary text-white scale-105 shadow-sm shadow-primary/20' 
                      : 'bg-surface-container border border-outline-variant/20 hover:border-primary/30 text-on-surface-variant hover:text-primary hover:scale-102'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !Array.isArray(filteredCourses) || filteredCourses.length === 0 ? (
          <div className="bg-surface-container border border-outline-variant/35 p-16 rounded-[32px] text-center max-w-lg mx-auto shadow-md">
            <span className="material-symbols-outlined text-[48px] text-primary/40 mb-3 animate-pulse">search_off</span>
            <p className="text-on-surface-variant font-bold text-headline-sm">No courses found</p>
            <p className="text-on-surface-variant/70 text-body-md mt-1">Try refining your search terms or selecting another category.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-6 px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
              <div key={course.id} className="group bg-surface-container border border-outline-variant/30 rounded-[32px] p-6 transition-all duration-300 hover:translate-y-[-6px] hover:border-primary/40 flex flex-col shadow-xs hover:shadow-lg relative overflow-hidden">
                {/* Visual border golden-glow overlay */}
                <div className="absolute inset-0 border border-transparent rounded-[32px] group-hover:border-primary/20 transition-colors pointer-events-none z-10"></div>
                <Link to={`/courses/${course.id}`} className="flex flex-col flex-1 z-0">
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-6 flex-shrink-0">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      src={course.thumbnail || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60"} 
                      alt={course.title} 
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-secondary text-primary text-label-sm font-label-sm uppercase font-bold shadow-xs">
                        {course.category || 'Core'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-headline-md text-headline-md text-primary font-bold group-hover:text-primary-container transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 font-medium">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-4 text-on-surface-variant font-label-md text-label-md mt-auto pt-2">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> 12h 45m</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">person</span> 1.2k enrolled</span>
                    </div>
                  </div>
                </Link>
                <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between mt-4">
                  <span className="font-headline-md text-headline-md text-primary font-black">
                    {course.isFree ? 'Free' : `$${course.price}`}
                  </span>
                  <button 
                    onClick={() => {
                      if (isAuthenticated && user?.role === 'ROLE_STUDENT' && course.enrolledStudentIds?.includes(user?.id || '')) {
                        navigate('/dashboard');
                      } else {
                        navigate(`/courses/${course.id}`);
                      }
                    }}
                    className="px-6 py-2 rounded-xl bg-primary text-white font-bold hover:scale-105 transition-transform btn-premium-primary"
                  >
                    {isAuthenticated && user?.role === 'ROLE_STUDENT' && course.enrolledStudentIds?.includes(user?.id || '') 
                      ? 'Enter' 
                      : 'Forge Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Dramatic Contrast Pro CTA Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-primary to-primary-container rounded-[40px] p-12 md:p-24 relative overflow-hidden text-center text-white shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 blur-[120px]"></div>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-6 relative z-10 leading-tight font-black tracking-tight">Ready to level up your career?</h2>
          <p className="font-body-lg text-body-lg text-white/80 max-w-2xl mx-auto mb-10 relative z-10 font-medium">
            Join thousands of corporate professionals and strategic leaders mastering the skills of tomorrow. Obtain unlimited access with the SkillForge Pro membership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link to="/register" className="px-10 py-4 bg-white text-primary font-bold rounded-2xl hover:scale-105 transition-all shadow-lg shadow-black/10">
              Join SkillForge Pro
            </Link>
            <Link to="/login" className="px-10 py-4 border border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
              Try for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseCatalog;
