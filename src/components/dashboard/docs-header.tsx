interface DocsHeaderProps {
  title: string
  description?: string
}

export function DocsHeader({ title, description }: DocsHeaderProps) {
  return (
    <div className="space-y-4 pb-8 pt-4 md:pt-8">
      <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">{title}</h1>
      {description && <p className="text-lg text-gray-500">{description}</p>}
    </div>
  )
}

