import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

interface Lesson {
  id: string;
  title: string;
  content?: string;
  videoUrl?: string;
  attachmentUrl?: string;
  type?: 'video' | 'article' | 'quiz';
  duration?: string;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail?: string;
  price: number;
  isFree: boolean;
  instructorId?: string;
  modules?: Module[];
  enrolledStudentIds?: string[];
}
// Fallback Modules aligning with the exact titles in the Stitch reference screenshot
const fallbackModules: Module[] = [
  {
    id: "mod-1",
    title: "Module 1: Strategic Foundations",
    lessons: [
      { id: "les-1", title: "1.1 Executive Summary", type: "video", duration: "12:45" },
      { id: "les-2", title: "1.2 Market Disruption Dynamics", type: "video", duration: "15:30" }
    ]
  },
  {
    id: "mod-2",
    title: "Module 2: Advanced Leadership",
    lessons: [
      { id: "les-4", title: "2.1 Building Resilient Teams", type: "video", duration: "24:10" },
      { id: "les-5", title: "2.2 Change Management Mastery", type: "video", duration: "21:15" },
      { id: "les-6", title: "Module Case Study PDF", type: "article", duration: "PDF" }
    ]
  }
];

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'instructor' | 'reviews' | 'requirements'>('curriculum');
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [enrolling, setEnrolling] = useState(false);
  // NOTE: Must be declared here (before any conditional returns) to satisfy Rules of Hooks.
  // Initialized with a placeholder; updated once course data loads.
  const [activeLesson, setActiveLesson] = useState<Lesson>({ id: "les-1", title: "1.1 Executive Summary", type: "video", duration: "12:45" });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${id}`);
        if (response.data && typeof response.data === 'object' && 'id' in response.data) {
          setCourse(response.data);
          
          // Auto expand the first module by default
          if (response.data.modules && response.data.modules.length > 0) {
            setExpandedModules([response.data.modules[0].id]);
          } else if (fallbackModules.length > 0) {
            // If using fallback modules, auto expand the first fallback module
            setExpandedModules([fallbackModules[0].id]);
          }
        } else {
          console.warn("Invalid course response structure. Using null fallback.", response.data);
          setCourse(null);
        }
      } catch (err) {
        console.error("Failed to fetch course details", err);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const toggleModule = (moduleId: string) => {
    if (expandedModules.includes(moduleId)) {
      setExpandedModules(expandedModules.filter(m => m !== moduleId));
    } else {
      setExpandedModules([...expandedModules, moduleId]);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!course) return;

    setEnrolling(true);
    try {
      const response = await api.post(`/courses/${course.id}/enroll/${user?.id}`);
      setCourse(response.data);
      alert("Success! You are now enrolled in the course.");
    } catch (err) {
      console.error("Enrollment failed", err);
      alert("Failed to enroll. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  const modulesList = (course && course.modules && course.modules.length > 0) ? course.modules : fallbackModules;


  if (loading) {
    return (
      <div className="landing-theme min-h-[70vh] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-label-md text-label-md text-primary animate-pulse">Loading Executive Curriculum...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="landing-theme min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-background">
        <span className="material-symbols-outlined text-[64px] text-error mb-4">warning</span>
        <h1 className="font-display-lg text-display-lg text-primary mb-4">Course Not Found</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mb-8">
          The course you are trying to view does not exist in our academy database or has been relocated.
        </p>
        <Link to="/catalog" className="bg-primary text-on-primary px-8 py-4 rounded-lg font-label-md btn-premium-primary">
          Back to Course Catalog
        </Link>
      </div>
    );
  }

  const isEnrolled = course.enrolledStudentIds?.includes(user?.id || "");

  const handleLessonClick = (lesson: Lesson, isLocked: boolean) => {
    if (isLocked && !isEnrolled) {
      alert(`The lesson "${lesson.title}" is premium. Please enroll in the course to unlock access!`);
      return;
    }
    setActiveLesson(lesson);
  };

  return (
    <div className="landing-theme min-h-screen bg-background text-on-background font-body-md antialiased pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Course Breadcrumbs & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-3">
            <Link to="/catalog" className="hover:text-primary transition-colors">Catalog</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">{course.category || 'Executive Series'}</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-primary leading-tight tracking-tight mb-2">
            {course.title}
          </h1>
          <p className="text-on-surface-variant max-w-3xl">
            {course.description}
          </p>
        </div>

        {/* Master split-screen layout inspired by Stitch Reference */}
        <div className="grid grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Course Curriculum Sidebar (35% Width) */}
          <div className="col-span-12 lg:col-span-4 bg-surface-container border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="font-headline-md text-headline-md text-primary font-bold tracking-tight mb-2">
                Course Curriculum
              </h2>
              
              {/* Premium Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
                  <span>Progress</span>
                  <span className="text-primary font-bold">{isEnrolled ? "65% Complete" : "0% Complete (Preview)"}</span>
                </div>
                <div className="w-full h-1.5 bg-outline/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: isEnrolled ? "65%" : "15%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Accordion list of modules and lessons */}
            <div className="space-y-4">
              {modulesList.map((mod, modIndex) => {
                const isExpanded = expandedModules.includes(mod.id);
                return (
                  <div key={mod.id} className="border border-outline-variant/20 rounded-2xl overflow-hidden bg-background shadow-xs">
                    <button 
                      onClick={() => toggleModule(mod.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-surface-container-high transition-colors text-left"
                    >
                      <div className="flex flex-col">
                        <span className="text-[10px] tracking-widest text-primary/70 uppercase font-bold mb-0.5">
                          MODULE {modIndex + 1}
                        </span>
                        <h3 className="font-label-md text-label-md text-primary font-bold leading-snug">
                          {mod.title}
                        </h3>
                      </div>
                      <span 
                        className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`}
                      >
                        expand_more
                      </span>
                    </button>
                    
                    {/* Lesson checklist items inside module accordion */}
                    <div className={`accordion-content ${isExpanded ? 'expanded' : ''}`}>
                      <div className="accordion-inner px-2 pb-3 space-y-1.5 pt-1 border-t border-outline-variant/10">
                        {mod.lessons.map((lesson) => {
                          const isActive = activeLesson.id === lesson.id;
                          const isPremiumModule = modIndex > 0;
                          const isLocked = isPremiumModule && !isEnrolled;
                          
                          return (
                            <div 
                              key={lesson.id} 
                              onClick={() => handleLessonClick(lesson, isLocked)}
                              className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                                isActive 
                                  ? 'bg-secondary text-primary font-bold shadow-xs' 
                                  : 'hover:bg-surface-container-low text-on-surface'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {isLocked ? (
                                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant/40">lock</span>
                                ) : isActive ? (
                                  <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                ) : lesson.type === 'video' ? (
                                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant/70">play_circle</span>
                                ) : (
                                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant/70">description</span>
                                )}
                                <span className="text-body-sm tracking-tight leading-snug">{lesson.title}</span>
                              </div>
                              <span className={`text-[11px] ${isActive ? 'text-primary' : 'text-on-surface-variant/60'}`}>
                                {lesson.duration || 'Video'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Sleek Multimedia Video Player & Lecture notes (65% Width) */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {/* Monitor representation player */}
            <div className="w-full bg-surface-container-low border border-outline-variant/30 rounded-3xl p-4 shadow-sm relative overflow-hidden">
              <div className="aspect-video w-full rounded-2xl bg-black relative flex flex-col justify-between overflow-hidden group">
                
                {/* Simulated playback visual */}
                <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-xs transition-transform duration-700 group-hover:scale-105" 
                     style={{ backgroundImage: `url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60')` }}>
                </div>
                
                {/* Sleek play icon container */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-16 h-16 bg-primary/20 backdrop-blur-md hover:bg-primary/45 border border-primary/30 rounded-full flex items-center justify-center shadow-2xl play-glow transition-all duration-300 scale-100 group-hover:scale-110 cursor-pointer">
                    <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  </div>
                </div>

                {/* Subtitle / Video Info overlay */}
                <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-white text-xs">
                  {activeLesson.title}
                </div>

                {/* Timeline Controls (Stitch design match) */}
                <div className="w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 z-10 flex flex-col gap-2">
                  <div className="w-full h-1 bg-white/20 rounded-full cursor-pointer relative">
                    <div className="absolute top-0 left-0 w-[28%] h-full bg-primary rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px] cursor-pointer hover:text-primary transition-colors">play_arrow</span>
                      <span className="material-symbols-outlined text-[18px] cursor-pointer hover:text-primary transition-colors">skip_next</span>
                      <span className="material-symbols-outlined text-[18px] cursor-pointer hover:text-primary transition-colors">volume_up</span>
                      <span className="font-mono">{activeLesson.duration ? `12:45 / ${activeLesson.duration}` : "12:45 / 45:00"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-white/10 hover:bg-white/25 px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors">1.25x</span>
                      <span className="material-symbols-outlined text-[18px] cursor-pointer hover:text-primary transition-colors">closed_caption</span>
                      <span className="material-symbols-outlined text-[18px] cursor-pointer hover:text-primary transition-colors">settings</span>
                      <span className="material-symbols-outlined text-[18px] cursor-pointer hover:text-primary transition-colors">fullscreen</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lecture Meta & Badge indicators beneath player */}
            <div className="bg-surface-container border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 text-[10px] rounded uppercase font-bold tracking-widest">
                  CURRENT LESSON
                </span>
                <span className="text-xs text-on-surface-variant font-semibold">Updated 2 days ago</span>
              </div>

              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold mb-3">
                {activeLesson.title}
              </h2>
              
              <p className="text-on-surface-variant leading-relaxed text-body-md mb-6">
                In this custom core curriculum lesson, we break down heuristics in executive forecasting and study the cognitive frameworks required to identify systemic risk and organizational bias in real-time.
              </p>

              {/* Locked/Requires Enrollment Warn Banner */}
              {!isEnrolled ? (
                <div className="bg-surface-container-low border border-outline/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                  <div className="text-center sm:text-left">
                    <h4 className="font-bold text-primary font-label-md text-label-md mb-1">Preview Mode Active</h4>
                    <p className="text-xs text-on-surface-variant max-w-md">
                      Enroll today to unlock full access to all 4 modules, downloadable templates, Dr. Sterling's Q&A forums, and your certificate of excellence.
                    </p>
                  </div>
                  <button 
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="px-6 py-3 bg-primary text-white font-label-md text-label-md rounded-xl hover:scale-105 transition-all shadow-md flex-shrink-0"
                  >
                    {enrolling ? 'Enrolling...' : `Enroll in Course — ${course.isFree ? 'Free' : `$${course.price}`}`}
                  </button>
                </div>
              ) : (
                <div className="bg-secondary/20 border border-primary/10 rounded-2xl p-5 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <div>
                    <h4 className="font-bold text-primary font-label-md text-label-md">You are Enrolled!</h4>
                    <p className="text-xs text-on-surface-variant">
                      Full executive credentials will be issued upon completing the case studies in Module 2.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Course Information Tabs */}
            <div className="bg-surface-container border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm">
              <div className="flex border-b border-outline-variant/20 bg-surface-container-low px-4 overflow-x-auto no-scrollbar">
                {(['curriculum', 'instructor', 'reviews'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-4 font-bold text-label-md transition-all whitespace-nowrap border-b-2 ${
                      activeTab === tab 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    {tab === 'curriculum' ? 'Program Overview' : tab === 'instructor' ? 'About Faculty' : 'Learner Reviews'}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'curriculum' && (
                  <div className="space-y-4 animate-[slideUp_0.3s_ease-out]">
                    <h3 className="font-headline-md text-headline-md text-primary font-bold">LMS Core Training Objectives</h3>
                    <p className="text-on-surface-variant text-body-md">
                      This curriculum is structured for technical leaders transitioning into strategic executive roles. You will learn to combine quantitative predictive modeling with leadership methodologies to successfully drive business growth.
                    </p>
                  </div>
                )}

                {activeTab === 'instructor' && (
                  <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start animate-[slideUp_0.3s_ease-out]">
                    <img 
                      className="w-20 h-20 rounded-2xl object-cover shadow border border-outline-variant/30"
                      alt="Dr. Julian Sterling"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDkKxlxCWO2Ea_z_hl4xWmZwAiacszT2Y9147muFtn7KLsgSuWbmZYyI0b-oKDSWuTAPJC41ZJ28DSiCCSIFiW9E3nJ1KkkMfZk0QNIm5l4SZuHp-QlqQnZQjbJpizWJhovaxsh7_Pl2QxcL13IHReK07udgEzsTt0YIs7kOSbrLn2jQYdbddqeU-LnDHidvACcW4JVRppfimUugfh00MSBbR92eTKn5U2Rj1YuUSSd4MIY5jE9vXDBINOqt0jNbsDtQfnHp6Igg8"
                    />
                    <div className="space-y-2 text-center sm:text-left">
                      <h4 className="font-headline-md text-headline-md text-primary font-bold">Dr. Julian Sterling</h4>
                      <p className="text-xs text-primary font-bold uppercase tracking-wider">Chief Strategy Officer & Course Faculty</p>
                      <p className="text-body-sm text-on-surface-variant max-w-xl">
                        Former McKinsey Lead Partner and Visiting Fellow at Oxford. Julian has spent 25 years advising world leaders on systemic risk and organizational agility.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-[slideUp_0.3s_ease-out]">
                    <div className="bg-background p-4 rounded-2xl border border-outline-variant/30 space-y-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span key={star} className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                      </div>
                      <p className="text-body-sm italic text-on-surface-variant">
                        "The strategic frameworks provided in Module 3 completely shifted our quarterly planning approach. A must-watch for any executive."
                      </p>
                      <p className="text-xs font-bold text-primary">— Eleanor Vance, CTO</p>
                    </div>
                    <div className="bg-background p-4 rounded-2xl border border-outline-variant/30 space-y-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4].map(star => (
                          <span key={star} className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                        <span className="material-symbols-outlined text-primary text-sm">star</span>
                      </div>
                      <p className="text-body-sm italic text-on-surface-variant">
                        "Dense, rigorous, and highly applicable. This isn't your standard surface-level leadership course."
                      </p>
                      <p className="text-xs font-bold text-primary">— Marcus Thorne, Strategy Director</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CourseDetails;
