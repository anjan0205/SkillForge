import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Landing = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleHeroPrimaryAction = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleExploreAction = () => {
    navigate('/catalog');
  };

  return (
    <div className="landing-theme min-h-screen bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed font-body-md antialiased">
      {/* TopAppBar */}
      <header className="bg-surface border-b border-outline-variant shadow-sm z-50 sticky top-0">
        <div className="flex justify-between items-center w-full px-margin-desktop max-w-container-max mx-auto h-20">
          <div className="flex items-center gap-stack-lg">
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center h-10 text-primary cursor-pointer select-none"
            >
              <img src="/logo.svg" alt="SkillForge Logo" className="h-full w-auto" />
            </div>
            <nav className="hidden md:flex gap-stack-md ml-stack-lg">
              <Link to="/catalog" className="text-primary font-bold font-label-md text-label-md transition-colors duration-200 hover:text-primary-fixed-variant">Catalog</Link>
              <a className="text-on-surface-variant hover:text-primary-container font-label-md text-label-md transition-colors duration-200" href="#">Community</a>
              <a className="text-on-surface-variant hover:text-primary-container font-label-md text-label-md transition-colors duration-200" href="#">Corporate</a>
            </nav>
          </div>
          <div className="flex items-center gap-stack-md">
            <div className="hidden lg:flex items-center bg-surface-container-low px-stack-md py-2 rounded-lg border border-outline-variant">
              <span className="material-symbols-outlined text-outline mr-2" data-icon="search">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-label-md font-label-md w-48 text-on-surface outline-none" placeholder="Search courses..." type="text"/>
            </div>
            <button className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-variant rounded-full transition-colors" data-icon="notifications">notifications</button>
            <button className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-variant rounded-full transition-colors" data-icon="help">help</button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3 ml-2">
                <Link 
                  to="/dashboard" 
                  className="h-10 w-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border border-outline-variant text-white font-bold hover:scale-105 transition-transform"
                  title="Go to Dashboard"
                >
                  {user?.firstName?.charAt(0) || 'U'}
                </Link>
                <button 
                  onClick={logout} 
                  className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-error-container hover:text-error rounded-full transition-colors"
                  title="Logout"
                >
                  logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link to="/login" className="text-on-surface-variant hover:text-primary font-label-md text-label-md transition-colors duration-200">Login</Link>
                <Link to="/register" className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-label-md text-label-md btn-premium-primary">Join Free</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden hero-pattern pt-section-gap pb-section-gap">
          <div className="max-w-container-max mx-auto px-margin-desktop grid lg:grid-cols-2 gap-gutter items-center">
            <div className="space-y-stack-lg z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-secondary-container text-on-secondary-container rounded-full text-label-sm font-label-sm uppercase tracking-widest">
                <span className="material-symbols-outlined text-[16px]" data-icon="verified" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                Executive Excellence
              </div>
              <h1 className="font-display-lg text-display-lg-mobile lg:text-display-lg text-primary leading-tight">
                Forge Your Future.<br/><span className="text-surface-tint">Master Real Skills.</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Acquire elite-level competencies through our curated curriculum designed for the modern enterprise. Intellectual rigor meets practical application for the next generation of leadership.
              </p>
              <div className="flex flex-wrap gap-stack-md pt-stack-sm">
                <button 
                  onClick={handleHeroPrimaryAction}
                  className="bg-primary text-on-primary px-8 py-4 font-label-md text-label-md rounded-lg btn-premium-primary active:scale-95 shadow-lg"
                >
                  Begin Your Mastery
                </button>
                <button 
                  onClick={handleExploreAction}
                  className="border border-primary text-primary px-8 py-4 font-label-md text-label-md rounded-lg btn-premium-secondary"
                >
                  View Curriculum
                </button>
              </div>
              <div className="flex items-center gap-stack-md pt-stack-lg border-t border-outline-variant">
                <div className="flex -space-x-4">
                  <img className="h-10 w-10 rounded-full border-2 border-surface" alt="Professional Leader" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxyLhrv0wdy-AB20ysxnYbloeQhEWD-mF7ZgTryn-dUbr07OvF59dw4u2Yrl5LUYhm9Y6OOMKsBjF7L9S3zBUl9YLYVbpzLBPdSo2uEfEY_f6LytjmKJSukIq7mAH7wuodkn5aC1t7mcn0PpfUGKjEPUyjjEqJzmwi_RRpsrlVgRCs4txcbnocr0KqnGWzqZd7fQeEjNAnAsM31Pd14SPBrdUVmQtOIm7D6_eJTLfEB8sOhzn0-NcwkdpEaXpY1gikQRqy4Oe315o"/>
                  <img className="h-10 w-10 rounded-full border-2 border-surface" alt="Professional Lead" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv2QY_hWR8EeYR6QkTCLoGUq6VPdbT9u-0IjqAMF7YA5NmjaJk-0gmEdIT6QAZeLJ3onQnJJbSf_HyeA435pu-S370-UzRae_LYOK4Hy5riTC8TOYIZ7FxPRSGDhkq5Xzy_UjcZ3c0HT5fCvy2P-Cls0zxIKMapGlaX0rBT5_vDQWL0bw3XRnfJHIy6O_X-S78Yg589srxtbhspkL90ezFreIGGgpyevt_BwrcPB0s-r1CtqH5Uk07_dPjSGfeTexar-jcFeLlzPg"/>
                  <img className="h-10 w-10 rounded-full border-2 border-surface" alt="Expert Educator" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbRKBrptJ1Na0790ZauPOSzwqNy8LxHHMsMBdtNPOO9fxIc2KO0hatFJHG4XXU2YE8LI2uEgNACvWTx-RXgvA3XDjaC18HOmQjC-y_6BxaTB810ZOQAv-ZpN0_3LsmJ0Fv2ejn7-aa6qqYJqE7fqbD7BaZiXWjiIW29bFOng2-xbT_k3wGi-EEUhHc_Bjh-49-_9ah-SpWXzhyDr6vuMYhmjgl-BW17ud2Sz8HmvcroxcrH860BLmhFVLSl8jXB7Xaj12fDOLhUt0"/>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Joined by <span className="text-primary font-bold">12,000+</span> global professionals this month.
                </p>
              </div>
            </div>
            <div className="relative hidden lg:block">
              {/* Abstract 3D Hero Element (Visual representation using layers) */}
              <div className="relative w-full aspect-square flex items-center justify-center">
                <div className="absolute w-72 h-72 bg-secondary-fixed opacity-20 rounded-full blur-3xl animate-pulse"></div>
                <div className="z-20 transform -rotate-12 hover:rotate-0 transition-transform duration-700 cursor-pointer">
                  <img className="rounded-xl shadow-2xl border-4 border-surface max-w-[340px]" alt="Premium Academic Sculptures" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeiKYhbAoIDPGVNDY4KxmpdArFjki1g5J4XuoO1q-8lkvJppMDUU9-izemlgW9eDFm3jyu-Yg_PouqwIrvlrc0XyTUsTtoIJQrqY4-LgYbZpKGZ2N7jZzmUczw_JuFaWqMvLrlBCAjEkndiV6qLERaL_-KOVxGsK-Hg-0_xpGgdpcopRH_89NVcho5-biPnbQeqfyW6lpD6yh6ZoQpBOEL8NP-Ohj5CRw_mUHCEyUrtEgulBWGJDSiNiq2HG0wtr-aC8DdBzOQaS8"/>
                </div>
                <div className="absolute top-10 right-10 z-30 p-stack-md bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant flex items-center gap-3">
                  <div className="bg-secondary-container p-2 rounded-lg">
                    <span className="material-symbols-outlined text-on-secondary-container" data-icon="auto_awesome" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-primary">AI-Personalized</p>
                    <p className="text-[10px] text-on-surface-variant">Tailored Career Path</p>
                  </div>
                </div>
                <div className="absolute bottom-10 left-10 z-30 p-stack-md bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant flex items-center gap-3">
                  <div className="bg-on-tertiary-container p-2 rounded-lg text-white">
                    <span className="material-symbols-outlined" data-icon="trophy" style={{ fontVariationSettings: "'FILL' 1" }}>trophy</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-primary">Certified Skill</p>
                    <p className="text-[10px] text-on-surface-variant">Enterprise Grade</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-primary py-stack-lg">
          <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-2 md:grid-cols-4 gap-gutter text-center">
            <div>
              <p className="font-display-lg text-white opacity-90">98%</p>
              <p className="font-label-md text-primary-fixed opacity-70">Completion Rate</p>
            </div>
            <div>
              <p className="font-display-lg text-white opacity-90">500+</p>
              <p className="font-label-md text-primary-fixed opacity-70">Expert Mentors</p>
            </div>
            <div>
              <p className="font-display-lg text-white opacity-90">45k</p>
              <p className="font-label-md text-primary-fixed opacity-70">Global Alumni</p>
            </div>
            <div>
              <p className="font-display-lg text-white opacity-90">120</p>
              <p className="font-label-md text-primary-fixed opacity-70">Enterprise Partners</p>
            </div>
          </div>
        </section>

        {/* Featured Courses (Bento Grid) */}
        <section className="py-section-gap bg-surface-container-lowest">
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="flex justify-between items-end mb-stack-lg">
              <div className="space-y-2">
                <p className="text-surface-tint font-label-md text-label-md uppercase tracking-widest">Selected Curriculum</p>
                <h2 className="font-headline-lg text-headline-lg text-primary">Professional Mastery Paths</h2>
              </div>
              <Link to="/catalog" className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline">
                Explore All Catalog
                <span className="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
              </Link>
            </div>
            <div className="bento-grid">
              {/* Major Card */}
              <div className="col-span-12 lg:col-span-8 group relative overflow-hidden rounded-xl bg-surface-container-low border border-outline-variant hover:shadow-xl transition-all duration-300">
                <div className="grid md:grid-cols-2 h-full">
                  <div className="p-stack-lg flex flex-col justify-between">
                    <div>
                      <span className="inline-block bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-label-sm mb-4">Trending</span>
                      <h3 className="font-headline-md text-headline-md text-primary mb-3">Strategic Leadership for Digital Transformation</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-6">Master the frameworks required to lead multi-national teams through complex technological shifts.</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-on-secondary-container">
                          <span className="material-symbols-outlined text-[18px]" data-icon="schedule">schedule</span>
                          <span className="font-label-sm text-label-sm">40 Hours</span>
                        </div>
                        <div className="flex items-center gap-1 text-on-tertiary-container">
                          <span className="material-symbols-outlined text-[18px]" data-icon="bar_chart">bar_chart</span>
                          <span className="font-label-sm text-label-sm">Advanced</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate('/catalog')}
                        className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                      >
                        <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
                      </button>
                    </div>
                  </div>
                  <div className="relative min-h-[300px] h-full overflow-hidden">
                    <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Executive Meeting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgzrAloErkeex88uz3wNdZdci7mNx2NFLOYmJJDw_wHs4T0zcqNaAYGrZ-k5lYTjajO8EvZeuFX8ea-Q7rUk1pz0g5YYzoP0nSvR_O7DFXuzvOCmuj5uQm7rc2LwniJ3oTh6Z0pHuQj61NzaatsDEsaIZPs47MxcJhCnWfIN9MnMsJz8Bmk0PKNrqh4-K_OVFOtp2ak2DzYf4glGCGUtH6HQ_-EStEiA4TVV3U5kNoW9AsJ14BxVvEarrq7-N7iUJxqyP1EAH6sps"/>
                  </div>
                </div>
              </div>
              {/* Small Card 1 */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4 group bg-surface rounded-xl border border-outline-variant p-stack-md hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="aspect-video rounded-lg overflow-hidden mb-stack-md relative">
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Data Intelligence Desk" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW6tYlH-iKUCwa-EaQlzrSaIrWGOPshhfoJ8Ne0y_a0tiMszAdO6feEfkyUV44EoLMXE2IGnZV2KLwaG4hq6SuC0D3a8OBQ2e_qme1OM_QCCw1R_XwuWyRFFtTapXeuUmqJHZ4LOfT_jvznnSHnaiIzLLaK6FU1rxsW2j26ajhhp4zCedlzYG1e8_WaY8yaxKG4dM_npFIeJd3bJbYc9X-Yq7tTRR_R0pawcW-zMlvfXsEtvhsXEYD9xTRwF0KDO2ctTvM_YC_m80"/>
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur p-2 rounded-lg font-bold text-primary font-label-md text-label-md shadow-sm">$499</div>
                  </div>
                  <h4 className="font-headline-md text-headline-md text-primary mb-2 text-lg">Applied Data Intelligence</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm mb-4 line-clamp-2">Move beyond spreadsheets. Learn to leverage predictive analytics for business growth.</p>
                </div>
                <div className="pt-4 border-t border-outline-variant flex justify-between items-center mt-auto">
                  <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]" data-icon="group">group</span> 1.2k Students
                  </span>
                  <span className="flex text-secondary">
                    <span className="material-symbols-outlined text-[16px]" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[16px]" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[16px]" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[16px]" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[16px]" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </span>
                </div>
              </div>
              {/* Small Card 2 */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4 group bg-surface rounded-xl border border-outline-variant p-stack-md hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="aspect-video rounded-lg overflow-hidden mb-stack-md relative">
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Career Steps" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIHzwoB8qbkqt-1Jf0e7DpVZNxB2G2mIeQ5GcGY6799mrG7nqeGBGx4mv-BiIF7oS-cy40m-5ivoLFec7guEsxEjbtqhSVVl7xSRL0ljK_TiKCJvPhJXr1zheUFe_5uAZks6Ob3wmjYwFfHi_YJ4OVWIZqPj8R5kKtZ60d4DQ-WRTPBe50yZTae6x4Q0ndyPu6mmkRkT8z04G16AzGbI4pyYcSxdwA9YF7vv9ZfStYIwvzi2stcEpsj2GBWVWckt7rWtKqSGwMQnQ"/>
                    <div className="absolute top-2 right-2 bg-secondary-fixed/90 backdrop-blur p-2 rounded-lg font-bold text-on-secondary-fixed font-label-md text-label-md shadow-sm">Premium</div>
                  </div>
                  <h4 className="font-headline-md text-headline-md text-primary mb-2 text-lg">The Architecture of Persuasion</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm mb-4 line-clamp-2">A masterclass in high-stakes negotiation and corporate communication.</p>
                </div>
                <div className="pt-4 border-t border-outline-variant flex justify-between items-center mt-auto">
                  <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]" data-icon="group">group</span> 850 Students
                  </span>
                  <span className="flex text-secondary">
                    <span className="material-symbols-outlined text-[16px]" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[16px]" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[16px]" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[16px]" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[16px]" data-icon="star_half" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                  </span>
                </div>
              </div>
              {/* Small Card 3 */}
              <div className="col-span-12 md:col-span-12 lg:col-span-4 group bg-surface rounded-xl border border-outline-variant p-stack-md hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="aspect-video rounded-lg overflow-hidden mb-stack-md relative">
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Product Design Workstation" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8JLBleVqcUSaiZYAnGfJ80HasTLM9fTAP7MaHo0CnBEXDvYN-dc8wb3YkN_UlVDaCpogeZ5m8Uqi7u2Vm1dpqoCvZO-AVBFdcmeynFYsGyJfwJ9YI2TBDcfo12ufot8h9r71GuwWkzRkEkcktQyyn8st7JyNf9fZRGGyCgZ9ec-qvT-RkPLadKHG4J7VesjO2YZJnOHbAokuTi0QjMa1osy7pJ7k82m-NC0EwqRBenlxZ9GmmlvKchITz2VFBeSFSbybnU7ewZUY"/>
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur p-2 rounded-lg font-bold text-primary font-label-md text-label-md shadow-sm">$299</div>
                  </div>
                  <h4 className="font-headline-md text-headline-md text-primary mb-2 text-lg">Product Design Executive</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm mb-4 line-clamp-2">Leading design teams from a business perspective. ROI of UX.</p>
                </div>
                <div className="pt-4 border-t border-outline-variant flex justify-between items-center mt-auto">
                  <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]" data-icon="group">group</span> 3.1k Students
                  </span>
                  <span className="flex text-secondary">
                    <span className="material-symbols-outlined text-[16px]" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[16px]" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[16px]" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[16px]" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[16px]" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-section-gap">
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="bg-surface-dim rounded-2xl overflow-hidden relative shadow-2xl border border-outline-variant">
              <div className="grid lg:grid-cols-2">
                <div className="p-stack-lg lg:p-16 flex flex-col justify-center space-y-stack-md">
                  <h2 className="font-display-lg text-display-lg text-primary">Ready to forge your path?</h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">Join the ranks of elite professionals who have accelerated their careers with SkillForge. Start your 14-day premium trial today.</p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button 
                      onClick={handleHeroPrimaryAction}
                      className="bg-primary text-on-primary px-10 py-4 rounded-lg font-label-md text-label-md btn-premium-primary"
                    >
                      Get Started Now
                    </button>
                    <button 
                      onClick={() => navigate('/login')}
                      className="bg-secondary-fixed text-on-secondary-fixed px-10 py-4 rounded-lg font-label-md text-label-md hover:brightness-95 btn-premium-gold"
                    >
                      Schedule a Demo
                    </button>
                  </div>
                </div>
                <div className="relative hidden lg:block h-full min-h-[400px]">
                  <img className="absolute inset-0 w-full h-full object-cover" alt="Success Skyscraper" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0W38nOPUpyfdraZOGeN97iBg7z81H47mVSbEu5CP1gew1jBMWwLKnhAos0WMtcNzUGsDaWR_QCVvFL9EbI9R5XoeBHbkMFEtmt4KL7EPFVCtNcCMfdDeMGT5I25k9NsAl9Flea_5Po-QlTLpzHpJIxVZr9K_BXo-U0B28voFaFCxOR1Z-WAKWezphT5YB4yy9x5nrW1pmdqWAhqb8TkI8PQaScSAqTYV2relq9mrhDM9PtuBbeCMi4Mucqwdy9TizkKe3w_e7Fs4"/>
                  <div className="absolute inset-0 bg-gradient-to-r from-surface-dim to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-dim border-t border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-stack-lg mb-stack-lg">
            <div className="col-span-1 md:col-span-1">
              <div className="h-10 text-primary mb-4 select-none">
                <img src="/logo.svg" alt="SkillForge Logo" className="h-full w-auto" />
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">The definitive academy for modern enterprise leadership and specialized industrial skills.</p>
            </div>
            <div>
              <h5 className="font-label-md text-label-md text-primary mb-4">Learning</h5>
              <ul className="space-y-2 font-label-sm text-label-sm text-on-surface-variant">
                <li><Link className="hover:text-primary transition-colors" to="/catalog">Course Catalog</Link></li>
                <li><a className="hover:text-primary transition-colors" href="#">Certifications</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Executive Coaching</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">For Teams</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-label-md text-label-md text-primary mb-4">Company</h5>
              <ul className="space-y-2 font-label-sm text-label-sm text-on-surface-variant">
                <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Newsroom</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-label-md text-label-md text-primary mb-4">Connect</h5>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer" data-icon="public">public</span>
                <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer" data-icon="share">share</span>
                <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer" data-icon="mail">mail</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center w-full py-stack-md border-t border-outline-variant/30">
            <p className="font-label-sm text-label-sm text-on-surface-variant opacity-70">© 2026 SkillForge Academy. All rights reserved.</p>
            <div className="flex gap-stack-md">
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary" href="#">Privacy</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary" href="#">Terms</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary" href="#">Support</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary" href="#">API</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
