import type { ReactNode } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ChartCardProps {
  icon: ReactNode
  title: string
  description: string
  tags: string[]
  preview: string
  useCase: string
  onClick: () => void
}

export function ChartCard({ icon, title, description, tags, preview, useCase, onClick }: ChartCardProps) {
  return (
    <Card
      className="group hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="relative h-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <Image
          src={preview || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      <CardHeader className="relative -mt-12 z-20">
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-lg bg-white/90 text-purple-600 shadow-sm">{icon}</div>
          <div>
            <CardTitle className="text-xl text-white">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <CardDescription className="mb-4">{description}</CardDescription>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            <strong className="font-medium">Use Case:</strong> {useCase}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

