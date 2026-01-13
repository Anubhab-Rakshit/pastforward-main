"use client"

import { useEffect, useState, useRef } from "react"
import { useTheme } from "next-themes"

type Star = {
  id: number
  x: number
  y: number
  size: number
  color: string
  opacity: number
  speed: number
  twinkleSpeed: number
}

export function CosmosBackground() {
  const [stars, setStars] = useState<Star[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const { theme } = useTheme()
  const animationRef = useRef<number>()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateDimensions = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }

      updateDimensions()
      window.addEventListener("resize", updateDimensions)

      return () => {
        window.removeEventListener("resize", updateDimensions)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return

    // Generate stars
    const starCount = Math.min(Math.floor((dimensions.width * dimensions.height) / 10000), 200)
    const newStars: Star[] = []

    for (let i = 0; i < starCount; i++) {
      newStars.push(createStar(i, dimensions.width, dimensions.height))
    }

    setStars(newStars)

    // Set up canvas animation
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    let time = 0
    const animate = () => {
      time += 0.01
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      newStars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed) * 0.5 + 0.5
        ctx.fillStyle = star.color
        ctx.globalAlpha = star.opacity * twinkle

        // Draw star
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()

        // Draw glow
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3)
        gradient.addColorStop(0, star.color)
        gradient.addColorStop(1, "rgba(0,0,0,0)")

        ctx.globalAlpha = star.opacity * twinkle * 0.5
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
        ctx.fill()

        // Move star
        star.y += star.speed

        // Reset star if it goes off screen
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions])

  const createStar = (id: number, width: number, height: number): Star => {
    // Instagram theme colors for stars
    const colors = [
      "rgba(64, 93, 230, 0.8)", // Instagram blue
      "rgba(131, 58, 180, 0.8)", // Instagram purple
      "rgba(225, 48, 108, 0.8)", // Instagram pink
      "rgba(253, 29, 29, 0.8)", // Instagram red
      "rgba(247, 119, 55, 0.8)", // Instagram orange
      "rgba(255, 255, 255, 0.9)", // White
    ]

    return {
      id,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.5,
      speed: Math.random() * 0.2 + 0.1,
      twinkleSpeed: Math.random() * 5 + 1,
    }
  }

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]" />
}

export default CosmosBackground
