"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, LogIn, UserPlus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [hoverButton, setHoverButton] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Track mouse position for magnetic buttons
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  // Calculate magnetic pull for buttons
  const getMagneticStyle = (buttonId: string) => {
    if (hoverButton !== buttonId) return {}

    const buttonElement = document.getElementById(buttonId)
    if (!buttonElement) return {}

    const rect = buttonElement.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = mousePosition.x - centerX
    const deltaY = mousePosition.y - centerY

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const maxDistance = 100

    if (distance < maxDistance) {
      const pull = 15 * (1 - distance / maxDistance)
      return {
        transform: `translate(${(deltaX * pull) / distance}px, ${(deltaY * pull) / distance}px)`,
      }
    }

    return {}
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "bg-gray-900/80 backdrop-blur-md py-2 shadow-md border-b border-gray-800" : "bg-transparent py-4",
      )}
      onMouseMove={handleMouseMove}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-8 h-8"
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
          >
            <div className="absolute inset-0 bg-instagram-pink2 rounded-md rotate-3 group-hover:rotate-6 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-instagram-blue rounded-md -rotate-3 group-hover:-rotate-6 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-gray-900 rounded-md flex items-center justify-center">
              <span className="text-instagram-pink2 font-bold group-hover:scale-110 transition-all duration-300">
                P
              </span>
            </div>
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold text-gradient"
          >
            PastForward
          </motion.span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="/#features">Features</NavLink>
          <NavLink href="/#how-it-works">How It Works</NavLink>
          <NavLink href="/#examples">Examples</NavLink>
          <NavLink href="/search">Search</NavLink>

          {session ? (
            <motion.div
              id="dashboard-btn"
              onMouseEnter={() => setHoverButton("dashboard-btn")}
              onMouseLeave={() => setHoverButton(null)}
              style={getMagneticStyle("dashboard-btn")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="default"
                className="bg-gradient-to-r from-instagram-blue via-instagram-purple to-instagram-pink2 text-white hover:shadow-lg hover:shadow-instagram-pink2/20 transition-all duration-300"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </Button>
            </motion.div>
          ) : (
            <>
              <motion.div
                id="signin-btn"
                onMouseEnter={() => setHoverButton("signin-btn")}
                onMouseLeave={() => setHoverButton(null)}
                style={getMagneticStyle("signin-btn")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="border-instagram-blue text-instagram-blue hover:bg-instagram-blue/10 transition-all duration-300"
                  onClick={() => router.push("/auth/signin")}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </motion.div>

              <motion.div
                id="signup-btn"
                onMouseEnter={() => setHoverButton("signup-btn")}
                onMouseLeave={() => setHoverButton(null)}
                style={getMagneticStyle("signup-btn")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-instagram-blue to-instagram-pink2 text-white hover:shadow-lg hover:shadow-instagram-pink2/20 transition-all duration-300"
                  onClick={() => router.push("/auth/signup")}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </motion.div>
            </>
          )}

          <ModeToggle />
        </nav>

        <div className="md:hidden flex items-center gap-4">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-800"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <MobileNavLink href="#features" onClick={() => setIsMobileMenuOpen(false)}>
                Features
              </MobileNavLink>
              <MobileNavLink href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>
                How It Works
              </MobileNavLink>
              <MobileNavLink href="#examples" onClick={() => setIsMobileMenuOpen(false)}>
                Examples
              </MobileNavLink>

              {session ? (
                <Button
                  variant="default"
                  className="w-full bg-gradient-to-r from-instagram-blue via-instagram-purple to-instagram-pink2 text-white"
                  onClick={() => {
                    router.push("/dashboard")
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="w-full border-instagram-blue text-instagram-blue"
                    onClick={() => {
                      router.push("/auth/signin")
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>

                  <Button
                    variant="default"
                    className="w-full bg-gradient-to-r from-instagram-blue to-instagram-pink2 text-white"
                    onClick={() => {
                      router.push("/auth/signup")
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-gray-300 hover:text-instagram-pink2 transition-colors relative group">
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-instagram-pink2 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  )
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-gray-300 hover:text-instagram-pink2 transition-colors py-2 border-b border-gray-800 last:border-0"
    >
      {children}
    </Link>
  )
}
