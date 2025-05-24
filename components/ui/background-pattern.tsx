import Image from "next/image"

interface BackgroundPatternProps {
  pattern: "dots" | "wave" | "grid"
  className?: string
}

export function BackgroundPattern({ pattern, className = "" }: BackgroundPatternProps) {
  const patternMap = {
    dots: "/images/patterns/dots-pattern.png",
    wave: "/images/patterns/wave-pattern.png",
    grid: "/images/patterns/grid-pattern.png",
  }

  return (
    <div className={`absolute inset-0 z-0 pointer-events-none opacity-30 ${className}`}>
      <Image src={patternMap[pattern] || "/placeholder.svg"} alt="" fill className="object-cover" />
    </div>
  )
}
