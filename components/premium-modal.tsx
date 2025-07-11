"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Lock, Check, ChevronRight, ChevronLeft, Star, Zap, Crown } from "lucide-react"
import { RainbowButton } from "./magicui/rainbow-button"

const slides = [
  {
    id: 1,
    title: "Advanced Filters",
    planName: "Scale",
    planType: "For individuals",
    status: "Active",
    description: "Unleash the Power of Your Business\nwith Scale Plan.",
    icon: <div className="w-7 h-7 bg-white rounded-full"></div>,
    gradient: "from-purple-500 via-purple-600 to-teal-500",
    features: ["All analytics features", "Up to 250,000 tracked visits", "Normal support", "Up to 3 team members"],
  },
  {
    id: 2,
    title: "Premium Analytics",
    planName: "Pro",
    planType: "For teams",
    status: "Recommended",
    description: "Advanced Analytics and Insights\nfor Growing Teams.",
    icon: <Star className="w-4 h-4 text-white" />,
    gradient: "from-blue-500 via-blue-600 to-cyan-500",
    features: [
      "Advanced analytics & reporting",
      "Up to 1,000,000 tracked visits",
      "Priority support",
      "Up to 10 team members",
    ],
  },
  {
    id: 3,
    title: "Enterprise Features",
    planName: "Enterprise",
    planType: "For organizations",
    status: "Popular",
    description: "Complete Solution for Large\nOrganizations and Enterprises.",
    icon: <Crown className="w-4 h-4 text-white" />,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    features: [
      "All enterprise features",
      "Unlimited tracked visits",
      "24/7 dedicated support",
      "Unlimited team members",
    ],
  },
  {
    id: 4,
    title: "AI-Powered Tools",
    planName: "AI Plus",
    planType: "For power users",
    status: "New",
    description: "Next-Generation AI Tools\nfor Maximum Productivity.",
    icon: <Zap className="w-4 h-4 text-white" />,
    gradient: "from-violet-500 via-purple-600 to-indigo-500",
    features: ["AI-powered insights", "Smart recommendations", "Automated reporting", "Advanced integrations"],
  },
  {
    id: 5,
    title: "Custom Solutions",
    planName: "Custom",
    planType: "Tailored for you",
    status: "Contact Us",
    description: "Fully Customized Solutions\nBuilt for Your Specific Needs.",
    icon: <div className="w-4 h-4 bg-white rounded-sm"></div>,
    gradient: "from-gray-600 via-gray-700 to-gray-800",
    features: [
      "Custom feature development",
      "Dedicated infrastructure",
      "White-label solutions",
      "Custom integrations",
    ],
  },
]

export default function PremiumModal() {
  const [open, setOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const currentSlideData = slides[currentSlide]

  return (
    // <div className="fixed inset-0 flex items-center justify-center bg-[#FAFAFB] z-50">
      <Dialog>
        <DialogContent className="max-w-3xl w-full p-0 bg-transparent border-0 shadow-none flex items-center justify-center">
          {/* Overlay for soft shadow */}
          <div className="absolute inset-0 bg-black/10 rounded-3xl pointer-events-none" />

          {/* Main Card */}
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl px-0 py-0 flex flex-col items-center">
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 z-10 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-800 stroke-2" />
            </button>

            {/* Header Section */}
            <div className="text-center pt-10 pb-6 px-8">
              {/* Hexagonal Shield Badge */}
              <div className="inline-block mb-4">
                <div
                  className="w-16 h-16 flex items-center justify-center relative"
                  style={{
                    clipPath:
                      'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                    border: '2.5px solid #A78BFA',
                    background: '#fff',
                  }}
                >
                  <Lock className="w-6 h-6 text-purple-600" strokeWidth={2.2} />
                </div>
              </div>

              <div className="mb-3">
                <span className="inline-block bg-black text-white px-4 py-1 text-xs font-semibold rounded-full shadow-md">
                  Premium Feature
                </span>
              </div>

              <p className="text-gray-500 text-base font-normal max-w-md mx-auto leading-relaxed">
                Your plan credits has been exhausted. Please upgrade your plan to continue
              </p>
            </div>

            {/* Carousel Content */}
            <div className="relative w-full flex items-center justify-center px-8 pb-8">
              {/* Left Arrow */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>

              {/* Card Content */}
              <div className="w-full bg-white rounded-2xl shadow-lg flex flex-row overflow-hidden">
                {/* Left Section - Plan Details */}
                <div className="w-1/2 p-8 flex flex-col justify-between border-r border-gray-100">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-4">{currentSlideData.title}</h3>
                    <div className="flex items-start gap-3 mb-6">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${currentSlideData.gradient} rounded-full flex items-center justify-center flex-shrink-0 relative`}
                      >
                        {currentSlideData.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-500 font-normal">{currentSlideData.planType}</span>
                          <Badge
                            className={`$ {
                              currentSlideData.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : currentSlideData.status === "Recommended"
                                ? "bg-blue-100 text-blue-700"
                                : currentSlideData.status === "Popular"
                                ? "bg-orange-100 text-orange-700"
                                : currentSlideData.status === "New"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-700"
                            } hover:bg-current px-2 py-0.5 text-xs font-medium rounded-full`}
                          >
                            {currentSlideData.status}
                          </Badge>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                          {currentSlideData.planName}
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                          {currentSlideData.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-medium text-sm mt-4">
                    Upgrade Plan
                  </Button>
                </div>

                {/* Right Section - Features */}
                <div className="w-1/2 p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-6">{"What's included"}</h3>
                    <div className="space-y-4">
                      {currentSlideData.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-white stroke-2" />
                          </div>
                          <span className="text-gray-800 text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Arrow */}
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Navigation Dots */}
            <div className="flex items-center justify-center gap-2 mt-2 mb-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors border border-gray-300 ${
                    index === currentSlide ? "bg-gray-800" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    // </div>
  )
}
