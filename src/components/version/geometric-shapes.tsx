import { useEffect, useState } from "react"

export function GeometricShapes() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Original subtle background shapes */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-purple-700/10 rounded-full blur-xl animate-pulse-slow"></div>
      <div className="absolute top-40 left-20 w-16 h-16 bg-purple-700/10 rounded-full blur-md animate-pulse-slower"></div>
      <div className="absolute bottom-40 left-40 w-24 h-24 bg-purple-700/10 rounded-full blur-lg animate-float"></div>
      <div className="absolute bottom-60 right-60 w-40 h-40 bg-blue-700/10 rounded-full blur-xl animate-pulse-slow"></div>

      {/* Original rotating triangles */}
      <div className="absolute top-1/3 right-1/4 w-0 h-0 border-l-[30px] border-l-transparent border-b-[50px] border-b-purple-700/40 border-r-[30px] border-r-transparent rotate-45 animate-spin-slow origin-center"></div>
      <div className="absolute bottom-1/4 left-1/3 w-0 h-0 border-l-[20px] border-l-transparent border-b-[30px] border-b-blue-700/40 border-r-[20px] border-r-transparent -rotate-12 animate-spin-reverse-slow origin-center"></div>
      <div className="absolute top-2/3 right-1/3 w-0 h-0 border-l-[15px] border-l-transparent border-b-[25px] border-b-purple-700/40 border-r-[15px] border-r-transparent rotate-180 animate-spin-slow origin-center"></div>

      {/* Original floating circles */}
      <div className="absolute bottom-1/3 right-1/4 w-16 h-16 border border-blue-700/20 rounded-full animate-float-delay"></div>
      <div className="absolute top-2/3 left-1/4 w-12 h-12 border border-purple-700/20 rounded-full animate-float"></div>

      {/* Original additional animated elements */}
      <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-purple-500/10 rounded-full animate-ping-slow"></div>
      <div className="absolute bottom-20 left-20 w-6 h-6 bg-blue-500/5 rounded-full animate-bounce-slow"></div>
      <div className="absolute top-40 right-1/3 w-4 h-4 bg-purple-500/5 rounded-full animate-float-delay-long"></div>

      {/* New geometric shapes */}

      {/* Hexagons */}
      <div className="absolute top-1/4 left-1/5 w-16 h-16 animate-float-delay-long">
        <svg viewBox="0 0 24 24" className="w-full h-full text-violet-500/10" fill="currentColor">
          <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5Z" />
        </svg>
      </div>

      <div className="absolute bottom-1/3 right-20 w-20 h-20 animate-spin-very-slow">
        <svg viewBox="0 0 24 24" className="w-full h-full text-fuchsia-500/10" fill="currentColor">
          <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5Z" />
        </svg>
      </div>

      {/* Squares */}
      <div className="absolute top-1/3 left-10 w-12 h-12 border border-violet-500/10 rotate-45 animate-float-slow"></div>
      <div className="absolute bottom-1/4 right-1/3 w-8 h-8 border border-fuchsia-500/10 rotate-12 animate-float-delay"></div>

      {/* Diamonds */}
      <div className="absolute top-2/3 left-1/3 w-10 h-10 bg-gradient-to-br from-violet-500/5 to-transparent rotate-45 animate-pulse-slower"></div>
      <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-gradient-to-br from-fuchsia-500/5 to-transparent rotate-45 animate-pulse-slow"></div>

      {/* Dots pattern */}
      <div className="absolute bottom-40 right-20 grid grid-cols-3 gap-2">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 bg-violet-500/20 rounded-full"></div>
        ))}
      </div>

      <div className="absolute top-60 left-40 grid grid-cols-2 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 bg-fuchsia-500/20 rounded-full"></div>
        ))}
      </div>

      {/* Lines */}
      <div className="absolute top-1/2 left-10 w-20 h-px bg-gradient-to-r from-violet-500/30 to-transparent"></div>
      <div className="absolute bottom-1/3 right-10 w-16 h-px bg-gradient-to-r from-fuchsia-500/30 to-transparent"></div>

      {/* Rings */}
      <div className="absolute top-20 left-1/3 w-24 h-24 rounded-full border-2 border-dashed border-violet-500/10 animate-spin-very-slow"></div>
      <div className="absolute bottom-40 right-1/4 w-32 h-32 rounded-full border border-fuchsia-500/10 animate-spin-reverse-very-slow"></div>

      {/* Wave pattern */}
      <div className="absolute bottom-20 left-1/3 w-40 h-20">
        <svg viewBox="0 0 100 20" className="w-full h-full text-violet-500/10" fill="none" stroke="currentColor">
          <path d="M0 10 Q 25 0, 50 10 T 100 10" strokeWidth="1" />
        </svg>
      </div>

      {/* Plus signs */}
      <div className="absolute top-1/4 right-10 text-fuchsia-500/20 text-2xl font-thin">+</div>
      <div className="absolute bottom-1/4 left-20 text-violet-500/20 text-xl font-thin">+</div>
    </div>
  )
}

