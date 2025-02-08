export interface Project {
  id: string
  title: string
  subtitle: string
  tags: {
    name: string
    color: "purple" | "orange" | "blue" | "red" | "light-blue"
  }[]
  additionalTags: number
  image: string
  url?: string
}
