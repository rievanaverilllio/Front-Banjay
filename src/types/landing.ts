export interface TeamMember {
  id: number
  src: string
}

export interface ServiceItem {
  id: number
  title: string
  description: string
  tags: string[]
  image: string
}

export interface ProcessStep {
  id: number
  title: string
  description: string
  image: string
}

export interface PricingPlan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  isDark: boolean
}

export interface LandingHomeData {
  arrowCount: number
  teamMembers: TeamMember[]
  serviceItems: ServiceItem[]
  processSteps: ProcessStep[]
  pricingPlans: PricingPlan[]
}
