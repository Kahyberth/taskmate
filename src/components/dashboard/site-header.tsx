import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoginModal } from "../auth/login";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogIn } from "lucide-react";

export function SiteHeader() {
  const [isModalOpen, setShowModal] = useState(false);
  return (
    <>
      {/* Header */}
      <header className="h-14 flex items-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 w-full">
          <a className="flex items-center" href="/">
            <img
              src="/image/taskmate-x.png"
              alt="TaskMate Logo"
              width={90}
              height={90}
              className="h-10 w-10 object-contain"
            />
            <span className="sr-only">TaskMate</span>
          </a>

          <nav className="flex gap-4 justify-center items-center sm:gap-6 py-4">
            <a
              className="text-sm font-medium hover:underline underline-offset-4"
              href="#features"
            >
              Features
            </a>
            <a
              className="text-sm font-medium hover:underline underline-offset-4"
              href="#how-it-works"
            >
              How It Works
            </a>
            <a
              className="text-sm font-medium hover:underline underline-offset-4"
              href="/documentation"
            >
              Documentation
            </a>
            <ThemeToggle />
            <a
              className="flex items-center text-sm font-medium hover:underline underline-offset-4"
              href="#faq"
              onClick={(e) => {
                e.preventDefault();
                setShowModal(true);
              }}
            >
              <LogIn className="w-4 h-4 mr-1" />
              Sign In
            </a>
          </nav>
        </div>
      </header>
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
