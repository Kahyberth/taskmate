import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight, ArrowRight, Check, Play, ArrowUpRight } from "lucide-react"
import { MobileNav } from "@/components/version/mobile-nav"
import { GeometricShapes } from "@/components/version/geometric-shapes"
import { TaskCompletionChart } from "@/components/version/task-completion-chart"
import { TestimonialCarousel } from "@/components/version/testimonial-carousel"
import { FaqAccordion } from "@/components/version/faq-accordion"
import { ScrollReveal } from "@/components/version/scroll-reveal"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignInModal } from "@/components/version/sign-in-modal"

export default function Home() {
  const [activeTab, setActiveTab] = useState("features")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const openSignInModal = () => {
    setIsSignInModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e0a29] via-[#170f3e] to-[#1e1248] relative overflow-hidden">
      {/* Sign In Modal */}
      <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />

      {/* Grain texture overlay */}
      <div
        className="fixed inset-0 z-10 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')",
        }}
      ></div>

      {/* Enhanced geometric shapes */}
      <GeometricShapes />

      {/* Navigation - Now with scroll effect */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-[#0e0a29]/80 backdrop-blur-md shadow-lg shadow-purple-900/10 py-3" : "bg-transparent py-6"}`}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-600 rounded-lg shadow-lg shadow-purple-500/20 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.3),rgba(255,255,255,0))]"></div>
                <span className="text-white text-xl font-bold relative z-10">TM</span>
                {/* Decorative elements inside logo */}
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-white/10 rounded-tl-lg"></div>
                <div className="absolute top-1 left-1 w-1 h-1 bg-white/30 rounded-full"></div>
              </div>
              <span className="text-white text-2xl font-bold tracking-tight">TaskMate</span>
            </div>
            <div className="hidden md:flex items-center space-x-10">
              <a
                href="#features"
                className={`text-white/80 hover:text-white transition-colors duration-200 font-medium relative group ${activeTab === "features" ? "text-white" : ""}`}
                onClick={() => setActiveTab("features")}
              >
                Features
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-violet-400 to-fuchsia-500 transition-all duration-300 ${activeTab === "features" ? "w-full" : "w-0 group-hover:w-full"}`}
                ></span>
              </a>
              <a
                href="#testimonials"
                className={`text-white/80 hover:text-white transition-colors duration-200 font-medium relative group ${activeTab === "testimonials" ? "text-white" : ""}`}
                onClick={() => setActiveTab("testimonials")}
              >
                Testimonials
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-violet-400 to-fuchsia-500 transition-all duration-300 ${activeTab === "testimonials" ? "w-full" : "w-0 group-hover:w-full"}`}
                ></span>
              </a>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 hover:text-white relative overflow-hidden group"
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

      {/* Hero Section */}
      <main className="relative z-20 pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
            <div className="max-w-xl mb-10 lg:mb-0 relative">
              {/* Decorative elements for hero section */}
              <div className="absolute -left-8 -top-8 w-16 h-16 border border-violet-500/20 rounded-full animate-spin-very-slow"></div>
              <div className="absolute -left-4 -top-4 w-8 h-8 border border-violet-500/30 rounded-full animate-spin-slow-reverse"></div>

              <ScrollReveal>
                <div className="inline-block px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full text-white font-medium mb-6 shadow-lg shadow-purple-500/20 animate-pulse-badge relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0)_100%)] animate-shine"></div>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    Nuevo TaskMate 2.0
                  </span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                    No solo empieza,
                    <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-purple-600 relative">
                      se construye.
                      <svg
                        className="absolute -right-12 top-1/2 transform -translate-y-1/2 w-10 h-10 text-fuchsia-500/30"
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
                <p className="text-white/70 text-lg mb-8 leading-relaxed relative">
                  TaskMate es una aplicación gratuita de gestión de tareas y proyectos que te ayuda a organizar tu
                  trabajo y a colaborar con tu equipo de manera eficiente, ahora con{" "}
                  <span className="text-violet-300 font-medium">integraciones de Inteligencia Artificial</span> para
                  potenciar tu productividad.
                  {/* Decorative dot pattern */}
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
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0 shadow-lg shadow-purple-500/20 group transition-all duration-300 relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      Comenzar ahora
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0)_100%)] opacity-0 group-hover:opacity-100 animate-shine"></span>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm group relative overflow-hidden"
                    onClick={() => document.getElementById("demo-video")?.classList.remove("hidden")}
                  >
                    <span className="relative z-10 flex items-center">
                      <Play className="mr-2 h-4 w-4" />
                      Ver demostración
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Button>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={400}>
                <div className="mt-10 flex items-center gap-4 relative">
                  {/* Decorative zigzag */}
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

                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 border-2 border-[#170f3e] flex items-center justify-center text-xs text-white font-medium">
                      JD
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 border-2 border-[#170f3e] flex items-center justify-center text-xs text-white font-medium">
                      MR
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 border-2 border-[#170f3e] flex items-center justify-center text-xs text-white font-medium">
                      KL
                    </div>
                  </div>
                  <p className="text-white/60 text-sm">
                    <span className="text-white font-medium">+2,500</span> equipos ya confían en nosotros
                  </p>
                </div>
              </ScrollReveal>
            </div>

            <div className="w-full lg:w-auto lg:min-w-[420px] relative">
              {/* Decorative elements for form */}
              <div className="absolute -right-6 -top-6 w-12 h-12 border border-fuchsia-500/20 rounded-lg rotate-12 animate-float-slow"></div>
              <div className="absolute right-12 -bottom-8 w-20 h-3 bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 rounded-full blur-md"></div>

              <ScrollReveal>
                <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-xl shadow-purple-900/10 hover:shadow-purple-900/20 transition-all duration-300 relative overflow-hidden group">
                  {/* Decorative corner shapes */}
                  <div className="absolute top-0 left-0 w-16 h-16">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-violet-500/30"></div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-16 h-16">
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-fuchsia-500/30"></div>
                  </div>

                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <h3 className="text-white text-xl font-medium mb-2 relative">
                    Comienza gratis
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-violet-500 rounded-full"></span>
                  </h3>
                  <p className="text-white/60 text-sm mb-6">Acceso completo a todas las funciones</p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1.5">
                        Email address
                      </label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="tucorreo@empresa.com"
                          className="bg-white/10 border-white/10 focus:border-violet-500 h-12 text-white placeholder:text-white/40 pr-8"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1.5">
                        Nombre completo
                      </label>
                      <div className="relative">
                        <Input
                          id="name"
                          type="text"
                          placeholder="Tu nombre"
                          className="bg-white/10 border-white/10 focus:border-violet-500 h-12 text-white placeholder:text-white/40 pr-8"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full h-12 text-base font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0 shadow-lg shadow-purple-500/20 group relative overflow-hidden">
                    <span className="relative z-10 flex items-center">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0)_100%)] opacity-0 group-hover:opacity-100 animate-shine"></span>
                  </Button>

                  <div className="flex items-center justify-center my-4">
                    <div className="h-px bg-white/10 flex-grow"></div>
                    <span className="text-white/50 px-3 text-sm">or</span>
                    <div className="h-px bg-white/10 flex-grow"></div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full h-12 text-white border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2 transition-all duration-200 group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <div className="grid grid-cols-2 grid-rows-2 gap-0.5">
                          <div className="bg-red-500 w-2 h-2"></div>
                          <div className="bg-green-500 w-2 h-2"></div>
                          <div className="bg-blue-500 w-2 h-2"></div>
                          <div className="bg-yellow-500 w-2 h-2"></div>
                        </div>
                      </div>
                      Sign up with Microsoft
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Button>

                  <div className="mt-6 text-xs text-white/40 text-center">
                    Al registrarte, aceptas nuestros{" "}
                    <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors">
                      Términos
                    </a>{" "}
                    y{" "}
                    <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors">
                      Política de Privacidad
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Demo Video Modal */}
          <div
            id="demo-video"
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md hidden flex items-center justify-center"
            onClick={(e) => e.currentTarget.classList.add("hidden")}
          >
            <div className="relative w-full max-w-4xl mx-4 p-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl">
              <div className="absolute top-2 right-2 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-black/20 hover:bg-black/40 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    document.getElementById("demo-video")?.classList.add("hidden")
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12"></path>
                  </svg>
                </Button>
              </div>
              <div className="bg-black rounded-lg overflow-hidden aspect-video">
                <div className="w-full h-full flex items-center justify-center text-white/70">
                  <div className="text-center">
                    <Play className="w-16 h-16 mx-auto mb-4 text-violet-400" />
                    <p className="text-lg">Demo video would play here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Data Visualization Section */}
          <ScrollReveal>
            <div className="mt-32 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-10 shadow-lg shadow-purple-900/5 relative overflow-hidden">
              <div className="absolute -top-6 -left-6 w-12 h-12 border-2 border-violet-500/20 rotate-45"></div>
              <div className="absolute -bottom-6 -right-6 w-12 h-12 border-2 border-fuchsia-500/20 rotate-12"></div>

              <div className="text-center mb-10">
                <Badge className="mb-4 bg-violet-500/20 text-violet-300 hover:bg-violet-500/30">
                  Análisis en tiempo real
                </Badge>
                <h2 className="text-3xl font-bold text-white mb-4">Visualiza tu progreso</h2>
                <p className="text-white/60 max-w-2xl mx-auto">
                  TaskMate te proporciona análisis detallados de tu productividad y la de tu equipo, permitiéndote tomar
                  decisiones basadas en datos.
                </p>
              </div>

              <div className="mt-10">
                <Tabs defaultValue="completion" className="w-full">
                  <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-8 bg-white/5">
                    <TabsTrigger
                      value="completion"
                      className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300"
                    >
                      Tareas completadas
                    </TabsTrigger>
                    <TabsTrigger
                      value="activity"
                      className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300"
                    >
                      Actividad
                    </TabsTrigger>
                    <TabsTrigger
                      value="team"
                      className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300"
                    >
                      Equipo
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="completion" className="mt-0">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <TaskCompletionChart />
                    </div>
                  </TabsContent>

                  <TabsContent value="activity" className="mt-0">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 h-[350px] flex items-center justify-center">
                      <div className="text-center text-white/60">
                        <svg
                          className="w-16 h-16 mx-auto mb-4 text-violet-500/50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          ></path>
                        </svg>
                        <p className="text-lg">Gráfico de actividad del usuario</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="team" className="mt-0">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 h-[350px] flex items-center justify-center">
                      <div className="text-center text-white/60">
                        <svg
                          className="w-16 h-16 mx-auto mb-4 text-violet-500/50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          ></path>
                        </svg>
                        <p className="text-lg">Rendimiento del equipo</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </ScrollReveal>

          {/* Feature Cards */}
          <div id="features" className="mt-32 relative">
            {/* Decorative elements for features section */}
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
                <div className="absolute left-1/2 -top-8 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"></div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                  Soluciones para cada equipo
                </h2>
                <p className="text-white/60 text-lg">
                  Descubre cómo TaskMate puede ayudar a tu equipo a ser más productivo y eficiente.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Card 1 */}
              <ScrollReveal delay={100}>
                <div className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 flex flex-col group hover:bg-white/10 transition-all duration-300 shadow-lg shadow-purple-900/5 hover:shadow-purple-900/20 relative">
                  {/* Decorative corner elements */}
                  <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-violet-500/20 to-transparent rounded-bl-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-violet-500/20 rounded-tr-xl"></div>

                  <div className="p-8 relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-700 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0)_100%)] opacity-0 group-hover:opacity-100 animate-shine"></div>
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        ></path>
                      </svg>
                    </div>
                    <h3 className="text-white text-xl font-bold mb-3 group-hover:text-violet-300 transition-colors duration-300">
                      Desarrollo de software
                    </h3>
                    <p className="text-white/60 mb-6">
                      Gestiona sprints, tareas y bugs con herramientas diseñadas para equipos de desarrollo.
                    </p>
                    <ul className="space-y-2 mb-6">
                      {["Integración con GitHub", "Seguimiento de bugs", "Automatización de CI/CD"].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-white/70">
                          <Check className="h-4 w-4 text-violet-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto">
                    <div className="h-48 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#170f3e] to-transparent z-10"></div>
                      <img
                        src="/placeholder.svg?height=400&width=600"
                        alt="Software Development"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Card 2 */}
              <ScrollReveal delay={200}>
                <div className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 flex flex-col group hover:bg-white/10 transition-all duration-300 shadow-lg shadow-purple-900/5 hover:shadow-purple-900/20 relative">
                  {/* Decorative corner elements */}
                  <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-fuchsia-500/20 to-transparent rounded-bl-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-fuchsia-500/20 rounded-tr-xl"></div>

                  <div className="p-8 relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-pink-700 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/20 relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0)_100%)] opacity-0 group-hover:opacity-100 animate-shine"></div>
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        ></path>
                      </svg>
                    </div>
                    <h3 className="text-white text-xl font-bold mb-3 group-hover:text-fuchsia-300 transition-colors duration-300">
                      Gestión de proyectos
                    </h3>
                    <p className="text-white/60 mb-6">
                      Planifica, ejecuta y supervisa proyectos con herramientas visuales y colaborativas.
                    </p>
                    <ul className="space-y-2 mb-6">
                      {["Diagramas de Gantt", "Tableros Kanban", "Seguimiento de tiempo"].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-white/70">
                          <Check className="h-4 w-4 text-fuchsia-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto">
                    <div className="h-48 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#170f3e] to-transparent z-10"></div>
                      <img
                        src="/placeholder.svg?height=400&width=600"
                        alt="Project Management"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Card 3 */}
              <ScrollReveal delay={300}>
                <div className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 flex flex-col group hover:bg-white/10 transition-all duration-300 shadow-lg shadow-purple-900/5 hover:shadow-purple-900/20 relative">
                  {/* Decorative corner elements */}
                  <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-blue-500/20 rounded-tr-xl"></div>

                  <div className="p-8 relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-700 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0)_100%)] opacity-0 group-hover:opacity-100 animate-shine"></div>
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        ></path>
                      </svg>
                    </div>
                    <h3 className="text-white text-xl font-bold mb-3 group-hover:text-blue-300 transition-colors duration-300">
                      Colaboración en equipo
                    </h3>
                    <p className="text-white/60 mb-6">
                      Conecta a tu equipo con herramientas de comunicación y colaboración en tiempo real.
                    </p>
                    <ul className="space-y-2 mb-6">
                      {["Chat integrado", "Videoconferencias", "Documentos compartidos"].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-white/70">
                          <Check className="h-4 w-4 text-blue-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto">
                    <div className="h-48 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#170f3e] to-transparent z-10"></div>
                      <img
                        src="/placeholder.svg?height=400&width=600"
                        alt="Team Collaboration"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Card 4 - AI Integration */}
              <ScrollReveal delay={400}>
                <div className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 flex flex-col group hover:bg-white/10 transition-all duration-300 shadow-lg shadow-purple-900/5 hover:shadow-purple-900/20 relative">
                  {/* Decorative corner elements */}
                  <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-violet-500/20 to-transparent rounded-bl-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-violet-500/20 rounded-tr-xl"></div>

                  <div className="p-8 relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-700 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0)_100%)] opacity-0 group-hover:opacity-100 animate-shine"></div>
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        ></path>
                      </svg>
                    </div>
                    <h3 className="text-white text-xl font-bold mb-3 group-hover:text-violet-300 transition-colors duration-300">
                      Potenciado por IA
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-500/20 text-violet-300">
                        Nuevo
                      </span>
                    </h3>
                    <p className="text-white/60 mb-6">
                      Aprovecha el poder de la inteligencia artificial para automatizar tareas y obtener insights
                      valiosos.
                    </p>
                    <ul className="space-y-2 mb-6">
                      {["Resúmenes automáticos", "Asistente virtual", "Análisis predictivo"].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-white/70">
                          <Check className="h-4 w-4 text-violet-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto">
                    <div className="h-48 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#170f3e] to-transparent z-10"></div>
                      <img
                        src="/placeholder.svg?height=400&width=600"
                        alt="AI Integration"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Testimonials Section */}
          <ScrollReveal>
            <div id="testimonials" className="mt-32 relative">
              <div className="text-center mb-16 max-w-2xl mx-auto">
                <Badge className="mb-4 bg-violet-500/20 text-violet-300 hover:bg-violet-500/30">Testimonios</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                  Lo que dicen nuestros clientes
                </h2>
                <p className="text-white/60 text-lg">
                  Miles de equipos confían en TaskMate para gestionar sus proyectos y tareas diarias.
                </p>
              </div>

              <TestimonialCarousel />
            </div>
          </ScrollReveal>

          {/* FAQ Section */}
          <ScrollReveal>
            <div className="mt-32 relative">
              <div className="text-center mb-16 max-w-2xl mx-auto">
                <Badge className="mb-4 bg-fuchsia-500/20 text-fuchsia-300 hover:bg-fuchsia-500/30">
                  Preguntas frecuentes
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">¿Tienes dudas?</h2>
                <p className="text-white/60 text-lg">
                  Encuentra respuestas a las preguntas más comunes sobre TaskMate.
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                <FaqAccordion />
              </div>
            </div>
          </ScrollReveal>

          {/* CTA Section */}
          <ScrollReveal>
            <div className="mt-32 relative">
              <div className="bg-gradient-to-br from-violet-600/20 via-fuchsia-600/20 to-violet-600/20 rounded-2xl p-12 md:p-16 border border-white/10 shadow-xl shadow-purple-900/10 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-fuchsia-500/30 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-violet-500/30 to-transparent rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Listo para empezar con TaskMate?</h2>
                    <p className="text-white/70 text-lg mb-0 md:mb-0">
                      Únete a miles de equipos que ya están mejorando su productividad. ¡Totalmente gratis!
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      className="bg-white text-violet-900 hover:bg-white/90 border-0 shadow-lg shadow-white/20 group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center">
                        Comenzar ahora
                        <ArrowUpRight className="ml-2 h-4 w-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                    <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10">
                      Ver demostración
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Footer */}
          <footer className="mt-32 pb-10 relative z-20">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
              <div className="col-span-2 lg:col-span-1">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-600 rounded-lg shadow-lg shadow-purple-500/20 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">TM</span>
                  </div>
                  <span className="text-white text-xl font-bold tracking-tight">TaskMate</span>
                </div>
                <p className="text-white/60 text-sm mb-6">
                  Simplifica la gestión de tareas y proyectos para equipos de cualquier tamaño.
                </p>
                <div className="flex space-x-4">
                  {["twitter", "facebook", "instagram", "linkedin"].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                    >
                      <span className="sr-only">{social}</span>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">Producto</h3>
                <ul className="space-y-2">
                  {["Características", "Integraciones", "Actualizaciones"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-white/60 hover:text-white transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">Recursos</h3>
                <ul className="space-y-2">
                  {["Documentación", "Guías", "Tutoriales", "API", "Comunidad"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-white/60 hover:text-white transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">Empresa</h3>
                <ul className="space-y-2">
                  {["Sobre nosotros", "Clientes", "Carreras", "Blog", "Contacto"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-white/60 hover:text-white transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">Legal</h3>
                <ul className="space-y-2">
                  {["Términos", "Privacidad", "Cookies", "Licencias", "Configuración"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-white/60 hover:text-white transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/40 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} TaskMate. Todos los derechos reservados.
              </p>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-white/40 hover:text-white/60 text-sm">
                  Términos
                </a>
                <a href="#" className="text-white/40 hover:text-white/60 text-sm">
                  Privacidad
                </a>
                <a href="#" className="text-white/40 hover:text-white/60 text-sm">
                  Cookies
                </a>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}

