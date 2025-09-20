export interface DashboardRow {
  id: number
  header: string
  type:
    | "Cover page"
    | "Table of contents"
    | "Narrative"
    | "Technical content"
    | "Plain language"
    | "Visual"
    | "Financial"
    | "Research"
    | "Legal"
  status: "Done" | "In Process"
  target: string
  limit: string
  reviewer: string
}
