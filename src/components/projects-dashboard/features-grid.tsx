
const features = [
  {
    title: "Desarrollo de software",
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-01-13%2021-51-45-1XDKELD0eJXBwEHO2IE2ZKNIk5oNSy.png",
  },
  {
    title: "Marketing",
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-01-13%2021-51-45-1XDKELD0eJXBwEHO2IE2ZKNIk5oNSy.png",
  },
  {
    title: "TI",
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-01-13%2021-51-45-1XDKELD0eJXBwEHO2IE2ZKNIk5oNSy.png",
  },
  {
    title: "Diseño",
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-01-13%2021-51-45-1XDKELD0eJXBwEHO2IE2ZKNIk5oNSy.png",
  },
  {
    title: "Operaciones",
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-01-13%2021-51-45-1XDKELD0eJXBwEHO2IE2ZKNIk5oNSy.png",
  },
]

export function FeaturesGrid() {
  return (
    <section className="container px-4 py-16">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group relative overflow-hidden rounded-lg border bg-background p-2 hover:border-blue-600 transition-colors"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold">{feature.title}</h3>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <video
                src={feature.video}
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

