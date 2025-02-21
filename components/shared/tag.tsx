interface TagProps {
  name: string
  color: "purple" | "orange" | "blue" | "red" | "light-blue"
}

export function Tag({ name, color }: TagProps) {
  const colorClasses = {
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700",
    "light-blue": "bg-sky-100 text-sky-700",
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClasses[color]}`}>
      {name}
    </span>
  )
}

