interface BaseCardProps {
    title: string
    type: string
    icon: string
  }
  
  export function BaseCard({ title, type, icon }: BaseCardProps) {
    return (
      <div className="flex items-center gap-4 rounded-lg border p-6 transition-shadow hover:shadow-md bg-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-700 text-white text-2xl">
          {icon}
        </div>
        <div>
          <h3 className="text-lg">{title}</h3>
          <p className="text-sm text-gray-500">{type}</p>
        </div>
      </div>
    )
  }
  
  