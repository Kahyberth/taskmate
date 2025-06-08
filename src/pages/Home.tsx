import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight, ArrowRight, ArrowUpRight, User, Mail, Users, NotebookText, Code, Zap } from "lucide-react"
import { MobileNav } from "@/components/version/mobile-nav"
import { GeometricShapes } from "@/components/version/geometric-shapes"
import { TaskCompletionChart } from "@/components/version/task-completion-chart"
import { FaqAccordion } from "@/components/version/faq-accordion"
import { ScrollReveal } from "@/components/version/scroll-reveal"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignInModal } from "@/components/version/sign-in-modal"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { FeatureCard } from "@/components/version/FeatureCard"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const [activeTab, setActiveTab] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])


  useEffect(() => {
    const options = {
      root: null, 
      rootMargin: "0px",
      threshold: 0.3,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveTab(id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, options);
    
    const featuresSection = document.getElementById("features");
    const faqSection = document.getElementById("faq");
    
    if (featuresSection) observer.observe(featuresSection);
    if (faqSection) observer.observe(faqSection);

    return () => {
      if (featuresSection) observer.unobserve(featuresSection);
      if (faqSection) observer.unobserve(faqSection);
      observer.disconnect();
    };
  }, []);

  const openSignInModal = () => {
    setIsSignInModalOpen(true)
  }

  const handleGetStartedClick = (e: any) => {
    e.preventDefault()
    navigate("/auth/register", { state: { email, name } })
  }

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br from-gray-100 via-indigo-200 to-gray-300
      dark:from-[#0e0a29] dark:via-[#170f3e] dark:to-[#1e1248]
        relative overflow-hidden"
    >
      <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />

      <div
        className="fixed inset-0 z-10 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')",
        }}
      ></div>
      <GeometricShapes />
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-[#0e0a29]/20 dark:bg-[#0e0a29]/80 backdrop-blur-md shadow-lg shadow-purple-900/10 dark:shadow-purple-900/10 py-3" : "bg-transparent py-6"}`}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-lg shadow-lg shadow-purple-500/20 relative overflow-hidden group flex items-center justify-center bg-gradient-to-br from-blue-300 to-purple-600 cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-indigo-400 to-purple-300 dark:from-violet-200 dark:via-indigo-300 dark:to-purple-300 opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.3),rgba(255,255,255,0))] pointer-events-none"></div>
                <img
                  src="/image/taskmate-x.png"
                  alt="TaskMate Logo"
                  width={28}
                  height={28}
                  className="relative z-10"
                />
              </div>
              <h1 
                className="text-xl font-bold cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-600 to-purple-900">
                  TaskMate
                </span>
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-10 dark:text-white/80">
              <a
                href="#features"
                className={` transition-colors duration-200 font-medium relative group`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("features");
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Features
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-900 transition-all duration-300 ${activeTab === "features" ? "w-full" : "w-0 group-hover:w-full"}`}
                ></span>
              </a>
              <a
                href="#faq"
                className={` transition-colors duration-200 font-medium relative group`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("faq");
                  document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                FAQ
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-900  transition-all duration-300 ${activeTab === "faq" ? "w-full" : "w-0 group-hover:w-full"}`}
                ></span>
              </a>
              <ThemeToggle />
              <Button
                variant="ghost"
                className="bg-white/10 hover:dark:bg-white/10 hover:bg-black/10 hover:dark:text-white relative overflow-hidden group"
                onClick={openSignInModal}
              >
                <span className="relative z-10">Sign In</span>
                <span className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
            </div>
            <div className="md:hidden">
              <MobileNav onSignInClick={openSignInModal} />
            </div>
          </nav>
        </div>
      </header>

      <main className="relative z-20 pt-32 pb-20 text-black dark:text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
            <div className="max-w-xl mb-10 lg:mb-0 relative">
              <div className="absolute -left-8 -top-8 w-16 h-16 border border-violet-500/60 dark:border-violet-500/20 rounded-full animate-spin-very-slow"></div>
              <div className="absolute -left-4 -top-4 w-8 h-8 border border-violet-500/60 dark:border-violet-500/30 rounded-full animate-spin-slow-reverse"></div>

              <ScrollReveal>
                <div className="inline-block px-6 py-2 bg-gradient-to-r  from-blue-400 via-indigo-600 to-purple-900 rounded-full text-white font-medium mb-6 shadow-lg shadow-purple-500/20 animate-pulse-badge relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/20 animate-shine"></div>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    New TaskMate
                  </span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black dark:text-white mb-6 leading-tight tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-black to-black/60 dark:from-white dark:to-white/60">
                    Don't just start,
                    <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-600 to-purple-900 relative">
                      build it.
                      <svg
                        className="absolute -right-12 top-1/2 transform -translate-y-1/2 w-10 h-10 text-purple-500/30"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <p className="text-gray-900 dark:text-white/70 text-lg mb-8 leading-relaxed relative">
                  <span className="bg-gradient-to-r from-blue-400 via-indigo-600 to-purple-900 text-transparent bg-clip-text font-bold">
                    TaskMate
                  </span>{" "}
                  is a free task and project management application that helps you organize your
                  work and collaborate with your team efficiently, now with{" "}
                  <span className="text-violet-600 dark:text-violet-300 font-medium">AI integrations</span> to
                  boost your productivity.
                  <span className="absolute -left-8 bottom-0 grid grid-cols-3 gap-1">
                    {[...Array(6)].map((_, i) => (
                      <span key={i} className="w-1 h-1 bg-violet-500/30 rounded-full"></span>
                    ))}
                  </span>
                </p>
              </ScrollReveal>

              <ScrollReveal delay={300}>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-400 to-purple-600 hover:from-violet-700 hover:to-purle-900 text-white border-0 shadow-lg shadow-purple-500/20 group transition-all duration-300 relative overflow-hidden"
                    onClick={() => navigate("/auth/register")}
                  >
                    <span className="relative z-10 flex items-center">
                      Start now
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0)_100%)] opacity-0 group-hover:opacity-100 animate-shine"></span>
                  </Button>
                  {/* <Button
                    size="lg"
                    variant="outline"
                    className="text-black dark:text-white border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm group relative overflow-hidden"
                    onClick={() => document.getElementById("demo-video")?.classList.remove("hidden")}
                  >
                    <span className="relative z-10 flex items-center">
                      <Play className="mr-2 h-4 w-4" />
                      Watch demo
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Button> */}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={400}>
                <div className="mt-10 flex items-center gap-4 relative">
                  <svg
                    className="absolute -left-12 top-1/2 transform -translate-y-1/2 w-8 h-8 text-violet-500/30"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 4.5L3.75 8.25L7.5 12M7.5 12L11.25 15.75L7.5 19.5M7.5 12H16.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                </div>
              </ScrollReveal>
            </div>

            <div className="w-full lg:w-auto lg:min-w-[420px] relative">
              <div className="absolute -right-6 -top-6 w-12 h-12 border border-purple-500/60 dark:border-purple-500/20 rounded-lg rotate-12 animate-float-slow"></div>
              <div className="absolute right-12 -bottom-8 w-20 h-3 bg-gradient-to-r from-indigo-500/60 to-purple-500/60 dark:from-indigo-500/60 dark:to-purple-500/30 rounded-full blur-md"></div>

              <ScrollReveal>
                <div className="bg-indigo-600/10 dark:bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-black/10 dark:border-white/10 w-full max-w-md shadow-xl shadow-purple-900/20 dark:shadow-purple-900/10 hover:shadow-purple-900/30 dark:hover:shadow-purple-900/20 transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-16 h-16">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-indigo-500/30"></div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-16 h-16">
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-500/30"></div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/5 dark:to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <h3 className="text-black dark:text-white text-xl font-medium mb-2 relative">
                    Get Started for free
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-violet-500 rounded-full"></span>
                  </h3>
                  <p className="text-black/60 dark:text-white/60 text-sm mb-6">Full access to all features</p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-black/80 dark:text-white/80 mb-1.5">
                        Email address
                      </label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="bg-white/10 border-white/10 focus:border-violet-500 h-12 text-black dark:text-white placeholder:text-black/40 placeholder:dark:text-white/40 pr-8"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                          <Mail className="w-4 h-4 dark:text-white text-black" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-black/80 dark:text-white/80 mb-1.5">
                        Full name
                      </label>
                      <div className="relative">
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          className="bg-white/10 border-white/10 focus:border-violet-500 h-12 text-black dark:text-white placeholder:text-black/40 placeholder:dark:text-white/40 pr-8"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30">
                          <User className="w-4 h-4 dark:text-white text-black" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-400 via-indigo-600 to-purple-900 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-purple-500/20 group relative overflow-hidden" onClick={handleGetStartedClick}>
                    <span className="relative z-10 flex items-center">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0)_100%)] opacity-0 group-hover:opacity-100 animate-shine"></span>
                  </Button>

                </div>
              </ScrollReveal>
            </div>
          </div>
 
          <ScrollReveal>
            <div className="mt-32 bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-white/10 p-10 shadow-lg shadow-purple-900/5 relative overflow-hidden">
              <div className="absolute -top-6 -left-6 w-12 h-12 border-2 border-violet-300 dark:border-violet-500/20 rotate-45"></div>
              <div className="absolute -bottom-6 -right-6 w-12 h-12 border-2 border-fuchsia-300 dark:border-fuchsia-500/20 rotate-12"></div>

              <div className="text-center mb-10">
                <Badge className="mb-4 bg-violet-100 text-violet-800 hover:bg-violet-200 dark:bg-violet-500/20 dark:text-violet-300 dark:hover:bg-violet-500/30">
                  Real-time Analytics
                </Badge>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Visualize your progress</h2>
                <p className="text-gray-700 dark:text-white/60 max-w-2xl mx-auto">
                  TaskMate provides detailed analytics of your productivity and your team's performance, enabling data-driven decisions.
                </p>
              </div>

              <div className="mt-10">
                <Tabs defaultValue="completion" className="w-full">
                  <TabsList className="grid grid-cols-2 max-w-md mx-auto mb-8 bg-white dark:bg-white/5">
                    <TabsTrigger
                      value="completion"
                      className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-800 dark:data-[state=active]:bg-violet-500/20 dark:data-[state=active]:text-violet-300"
                    >
                      Completed Tasks
                    </TabsTrigger>
                    <TabsTrigger
                      value="projects"
                      className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-800 dark:data-[state=active]:bg-violet-500/20 dark:data-[state=active]:text-violet-300"
                    >
                      Project Progress
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="completion" className="mt-0">
                    <div className="bg-white dark:bg-white/5 rounded-xl p-6 border border-gray-200 dark:border-white/10">
                      <TaskCompletionChart />
                    </div>
                  </TabsContent>

                  <TabsContent value="projects" className="mt-0">
                    <div className="bg-white dark:bg-white/5 rounded-xl p-6 border border-gray-200 dark:border-white/10">
                      <TaskCompletionChart />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </ScrollReveal>

          <div id="features" className="mt-32 relative">
            <div className="absolute -left-4 top-0 w-24 h-24">
              <svg className="w-full h-full text-violet-500/10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
              </svg>
            </div>
            <div className="absolute right-10 top-10 w-16 h-16">
              <svg className="w-full h-full text-fuchsia-500/10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 16V8.00002C21 5.79088 19.2091 4.00002 17 4.00002H7C4.79086 4.00002 3 5.79088 3 8.00002V16C3 18.2092 4.79086 20 7 20H17C19.2091 20 21 18.2092 21 16Z" />
              </svg>
            </div>

            <ScrollReveal>
              <div className="text-center mb-16 max-w-2xl mx-auto relative">
                <div className="absolute left-1/2 -top-8 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-900 rounded-full"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                  Solutions for every team
                </h2>
                <p className="text-gray-700 dark:text-white/60 text-lg">
                  Discover how TaskMate can help your team be more productive and efficient.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                title="Scrum & Agile"
                description="Implement Scrum and agile methodologies with specialized tools for development teams."
                features={["Burndown Charts", "Planning Poker", "Sprint Planning"]}
                icon={<Code className="w-6 h-6 text-white" />}
                gradientFrom="violet-500"
                gradientTo="purple-700"
                hoverTextColor="violet-500"
                iconColor="violet-400"
                delay={100}
                decorativeColor="violet-500"
              />

              <FeatureCard
                title="Kanban Boards"
                description="Visualize and manage workflow with customizable and flexible Kanban boards."
                features={["Custom columns", "Drag and drop", "Status labels"]}
                icon={<NotebookText className="w-6 h-6 text-white" />}
                gradientFrom="fuchsia-500"
                gradientTo="pink-700"
                hoverTextColor="fuchsia-500"
                iconColor="fuchsia-400"
                delay={200}
                decorativeColor="fuchsia-500"
              />

              <FeatureCard
                title="Chat & Collaboration"
                description="Communicate with your team in real-time directly on the platform."
                features={["Real-time chat", "User mentions", "Notifications"]}
                icon={<Users className="w-6 h-6 text-white" />}
                gradientFrom="blue-500"
                gradientTo="cyan-700"
                hoverTextColor="blue-500"
                iconColor="blue-400"
                delay={300}
                decorativeColor="blue-500"
              />

              <FeatureCard
                title="AI Assistant"
                description="Get intelligent help to solve doubts and improve productivity."
                features={["Question answering", "Smart suggestions", "Contextual help"]}
                icon={<Zap className="w-6 h-6 text-white" />}
                gradientFrom="violet-500"
                gradientTo="fuchsia-700"
                hoverTextColor="violet-500"
                iconColor="violet-400"
                delay={400}
                isNew={true}
                decorativeColor="violet-500"
              />
            </div>
          </div>

          <ScrollReveal>
            <div id="faq" className="mt-32 relative">
              <div className="text-center mb-16 max-w-2xl mx-auto">
                <Badge className="mb-4 bg-purple-500/60 dark:bg-purple-500/20 text-violet-100 dark:text-violet-300 hover:bg-purple-500/30">
                  FAQ
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4 tracking-tight">Got questions?</h2>
                <p className="text-black/80 dark:text-white/60 text-lg">
                  Find answers to the most common questions about TaskMate.
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                <FaqAccordion />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mt-32 relative">
              <div className="bg-gradient-to-br from-indigo-300/60 via-purple-900/60 to-indigo-600/60 dark:from-indigo-300/20 dark:via-purple-900/20 dark:to-indigo-600/20 rounded-2xl p-12 md:p-16 border border-black/20 dark:border-white/10 shadow-xl shadow-purple-900/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-600/60 dark:from-purple-600/30 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-indigo-500/60 dark:from-indigo-500/30 to-transparent rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">Ready to start with TaskMate?</h2>
                    <p className="text-black/70 dark:text-white/70 text-lg mb-0 md:mb-0">
                      Join other teams already boosting their productivity. Completely free!
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      className="bg-white text-violet-900 hover:bg-white/90 border-0 shadow-lg shadow-white/20 group relative overflow-hidden"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                      <span className="relative z-10 flex items-center">
                        Get Started
                        <ArrowUpRight className="ml-2 h-4 w-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                    {/* <Button size="lg" variant="outline" className="text-black dark:text-white border-white/20 hover:bg-white/10">
                      Watch Demo
                    </Button> */}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <footer className="mt-32 pb-10 relative z-20">
            <div className="border-t border-black/10 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-black/60 dark:text-white/40 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} TaskMate. All rights reserved.
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <span className="text-black/40 dark:text-white/40 text-sm">Kahyberth Gonzalez</span>
                  <div className="flex items-center space-x-2">
                    <a href="https://github.com/Kahyberth" target="_blank" rel="noopener noreferrer" className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white/60">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/kahyberth/" target="_blank" rel="noopener noreferrer" className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white/60">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-black/40 dark:text-white/40 text-sm">Kevin Ordoñez</span>
                  <div className="flex items-center space-x-2">
                    <a href="https://github.com/kevinov07" target="_blank" rel="noopener noreferrer" className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white/60">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/kevin-andres-ordo%C3%B1ez-dev/" target="_blank" rel="noopener noreferrer" className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white/60">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main >
    </div >
  )
}

