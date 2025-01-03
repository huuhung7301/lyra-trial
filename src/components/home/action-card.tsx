import { type LucideIcon } from 'lucide-react'

interface ActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  iconColor?: string
}

export function ActionCard({ title, description, icon: Icon, iconColor = "text-gray-600" }: ActionCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4 transition-shadow hover:shadow-md bg-white">
      <div className="flex items-center gap-2">
        <div className={`rounded-md p-1 ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

