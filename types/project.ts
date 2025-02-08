export interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  date: string
  logo?: string
  tags: {
    name: string
    color: "purple" | "orange" | "blue" | "red" | "light-blue"
  }[]
  additionalTags: number
  image: string
  url?: string
  stack?: {
    name: string
    icon: React.ReactNode
  }[]
}
