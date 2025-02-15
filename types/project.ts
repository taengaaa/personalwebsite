export interface Project {
  id: string
  internalName?: string
  title: string
  subtitleLeft?: string
  subtitleRight?: string
  description: string
  tags: string[]
  projectImage?: {
    fields: {
      title: string
      description?: string
      file: {
        url: string
        details: {
          image?: {
            width: number
            height: number
          }
        }
      }
    }
  }
  projectUrl: {
    fields: {
      text: string
      url: string
      openInNewTab?: boolean
    }
  }
}

// UI specific types that extend the base Project type
export interface ProjectWithUI extends Project {
  tagColors?: {
    [key: string]: "purple" | "orange" | "blue" | "red" | "light-blue"
  }
  additionalTags?: number
  stack?: {
    name: string
    icon: React.ReactNode
  }[]
}
