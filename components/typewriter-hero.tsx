"use client"

import { useState, useEffect } from "react"

const words = [
  "User-Experience",
  "Kunde",
  "Architektur",
  "Product-Manager",
  "Developer",
  "Projektleiter",
  "Product Owner"
] as const

type Word = typeof words[number]

// Define gradient classes for each word
const gradients: Record<Word, string> = {
  "User-Experience": "bg-gradient-to-r from-pink-500 to-violet-500",
  "Kunde": "bg-gradient-to-r from-orange-500 to-amber-500",
  "Architektur": "bg-gradient-to-r from-indigo-500 to-purple-500",
  "Product-Manager": "bg-gradient-to-r from-rose-500 to-red-500",
  "Developer": "bg-gradient-to-r from-sky-500 to-cyan-500",
  "Projektleiter": "bg-gradient-to-r from-blue-500 to-cyan-500",
  "Product Owner": "bg-gradient-to-r from-emerald-500 to-teal-500",
}

export default function TypewriterHero() {
  const [currentWord, setCurrentWord] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (!isDeleting && currentWord === words[currentIndex]) {
          setTimeout(() => setIsDeleting(true), 1500)
          return
        }

        if (isDeleting && currentWord === "") {
          setIsDeleting(false)
          setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length)
          return
        }

        setCurrentWord((prev) => (isDeleting ? prev.slice(0, -1) : words[currentIndex].slice(0, prev.length + 1)))
      },
      isDeleting ? 75 : 150,
    )

    return () => clearTimeout(timer)
  }, [currentWord, currentIndex, isDeleting])

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)

    return () => clearInterval(cursorTimer)
  }, [])

  return (
    <div className="w-full max-w-5xl mx-auto py-28 px-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-snug sm:leading-normal md:leading-normal">
          Ich bin Requirements Engineer an der Schnittstelle zwischen
        </h1>
        <div className="h-24 sm:h-28 md:h-32 flex items-center justify-center">
          <div className="relative inline-flex items-center text-4xl sm:text-5xl md:text-6xl font-bold leading-snug sm:leading-normal md:leading-relaxed py-2">
            <span className={`${gradients[words[currentIndex]]} text-transparent bg-clip-text pb-1 animate-gradient bg-[length:200%_200%] bg-clip-text bg-gradient-to-r`}>
              {currentWord}
            </span>
            <div 
              className={`
                ml-1 w-[3px] h-[1em] bg-current
                ${showCursor ? 'opacity-100' : 'opacity-0'}
              `}
              style={{ marginTop: '0.1em' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
