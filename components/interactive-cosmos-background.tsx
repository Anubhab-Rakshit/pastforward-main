"use client"

import { useEffect, useRef } from "react"

export function InteractiveCosmosBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full window size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // Star properties
    const stars: {
      x: number
      y: number
      size: number
      color: string
      speed: number
      opacity: number
      pulse: number
    }[] = []

    // Mouse position
    let mouseX = 0
    let mouseY = 0
    const mouseRadius = 150
    let mouseActive = false

    // Instagram theme colors
    const colors = [
      "#405DE6", // Instagram blue
      "#833AB4", // Instagram purple
      "#C13584", // Instagram pink
      "#E1306C", // Instagram pink
      "#FD1D1D", // Instagram red
      "#F77737", // Instagram orange
      "#FFFFFF", // White
    ]

    // Create stars
    const createStars = () => {
      const starCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 10000), 200)

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: Math.random() * 0.2 + 0.1,
          opacity: Math.random() * 0.5 + 0.3,
          pulse: Math.random() * 0.1,
        })
      }
    }

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      mouseActive = true

      // Reset after 2 seconds of inactivity
      clearTimeout(mouseTimeout)
      mouseTimeout = setTimeout(() => {
        mouseActive = false
      }, 2000)
    }

    let mouseTimeout: number

    // Draw stars
    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#0a0a0a")
      gradient.addColorStop(1, "#111111")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach((star, i) => {
        // Calculate distance from mouse
        const dx = mouseX - star.x
        const dy = mouseY - star.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Update star position
        star.y += star.speed

        // Reset star if it goes off screen
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }

        // Pulse effect
        const time = Date.now() * 0.001
        const pulse = Math.sin(time * star.pulse) * 0.5 + 0.5

        // Mouse interaction
        let size = star.size
        let opacity = star.opacity

        if (mouseActive && distance < mouseRadius) {
          // Increase size and brightness when mouse is near
          const factor = 1 - distance / mouseRadius
          size = star.size * (1 + factor)
          opacity = star.opacity * (1 + factor * 0.5)

          // Move stars away from mouse
          star.x += (dx / distance) * factor * -2
          star.y += (dy / distance) * factor * -2
        }

        // Draw star
        ctx.beginPath()
        ctx.arc(star.x, star.y, size * pulse, 0, Math.PI * 2)
        ctx.fillStyle = star.color
        ctx.globalAlpha = opacity * pulse
        ctx.fill()

        // Draw glow
        const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, size * 3)
        glow.addColorStop(0, star.color)
        glow.addColorStop(1, "rgba(0,0,0,0)")

        ctx.beginPath()
        ctx.arc(star.x, star.y, size * 3, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.globalAlpha = opacity * 0.3 * pulse
        ctx.fill()

        // Reset global alpha
        ctx.globalAlpha = 1
      })

      requestAnimationFrame(drawStars)
    }

    // Initialize
    createStars()
    window.addEventListener("mousemove", handleMouseMove)
    drawStars()

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasSize)
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(mouseTimeout)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]"
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }}
    />
  )
}

export default InteractiveCosmosBackground
