import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="h-[100dvh] w-full flex items-center justify-center bg-background">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 text-center">
        <FileQuestion className="h-20 w-20 text-muted-foreground" aria-hidden="true" />
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Page not found
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          We couldn&apos;t find the page you were looking for. It might have been removed, renamed, or doesn&apos;t exist.
        </p>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Button asChild>
            <Link to="/">
              Return Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/contact">
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

