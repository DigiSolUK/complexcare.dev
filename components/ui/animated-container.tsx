"use client"

import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedContainerProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  animation?: "fadeIn" | "slideUp" | "slideIn" | "scale" | "bounce"
}

export function AnimatedContainer({
  children,
  className,
  delay = 0,
  duration = 0.5,
  animation = "fadeIn",
}: AnimatedContainerProps) {
  const animations = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
    slideIn: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    },
    bounce: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 50 },
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  }

  const selectedAnimation = animations[animation]

  return (
    <AnimatePresence>
      <motion.div
        className={cn(className)}
        initial={selectedAnimation.initial}
        animate={selectedAnimation.animate}
        exit={selectedAnimation.exit}
        transition={
          selectedAnimation.transition || {
            duration,
            delay,
            ease: "easeInOut",
          }
        }
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
