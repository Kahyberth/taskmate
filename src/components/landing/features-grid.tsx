const features = [
  {
    title: "Desarrollo de softwares",
    video: "/taskmate_1.mp4",
  },
  {
    title: "Gestión de proyectos",
    video: "/taskmate_2.mp4",
  },
   {
    title: "Colaboración en equipo",
    video: "/taskmate_4.mp4",
  }
];

export function FeaturesGrid() {
  return (
    <section className="container px-4 py-16 mx-auto">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group relative overflow-hidden rounded-lg border bg-background p-2 hover:border-blue-600 transition-colors"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold">{feature.title}</h3>
            </div>

            {/* Video */}
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <video
                src={feature.video}
                className="object-cover transition-transform group-hover:scale-105"
                muted
                preload="metadata"
                loop
                autoPlay
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
