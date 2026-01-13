"use client"

import { useCallback, useEffect, useState } from "react"
import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"
import type { Engine } from "tsparticles-engine"
import { useTheme } from "next-themes"

type ParticleBackgroundProps = {
  variant?: "default" | "ancient" | "medieval" | "renaissance" | "industrial" | "modern"
}

export function ParticleBackground({ variant = "default" }: ParticleBackgroundProps) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  const particleColors = {
    default: {
      light: ["#FF7A28", "#FF9F5A", "#FFC8A0"],
      dark: ["#F55A00", "#FF7A28", "#C24700"],
    },
    ancient: {
      light: ["#D4B483", "#C19A6B", "#9A7B4F"],
      dark: ["#9A7B4F", "#7D6542", "#5A4A30"],
    },
    medieval: {
      light: ["#7D8CC4", "#5D6BB4", "#3F4A8A"],
      dark: ["#3F4A8A", "#2D3564", "#1A1F3A"],
    },
    renaissance: {
      light: ["#A86464", "#8E4242", "#6B2727"],
      dark: ["#6B2727", "#4F1D1D", "#331313"],
    },
    industrial: {
      light: ["#6B7D7D", "#546666", "#3D4A4A"],
      dark: ["#3D4A4A", "#2A3333", "#1A1F1F"],
    },
    modern: {
      light: ["#6BA292", "#4D8C7A", "#376657"],
      dark: ["#376657", "#264A3E", "#152B25"],
    },
  }

  const colors = isDark ? particleColors[variant].dark : particleColors[variant].light

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine)
  }, [])

  if (!mounted) return null

  return (
    <Particles
      id="tsparticles"
      className="particles-background"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        fpsLimit: 60,
        particles: {
          number: {
            value: 30,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: colors,
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: 0.5,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false,
            },
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: true,
              speed: 2,
              size_min: 0.1,
              sync: false,
            },
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: colors[0],
            opacity: 0.2,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "grab",
            },
            onclick: {
              enable: true,
              mode: "push",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 140,
              line_linked: {
                opacity: 0.5,
              },
            },
            push: {
              particles_nb: 3,
            },
          },
        },
        retina_detect: true,
      }}
    />
  )
}

export default ParticleBackground
