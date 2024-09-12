export interface Metadata {
  Authors: string[]
  Description: string
  Forks: string
  GroupId: string
  Title: string
  Topics: string[]
  Variant?: string
}

export interface FormSpec extends Metadata {
  body: string
  frontmatter: string
}

export interface Spec {
  description: string
  forks: string
  groupId: string
  height: number
  id: string
  owner: string
  stamps: number
  timestamp: number
  title: string
  type: string
  variant?: string
}

export interface GQLSpec extends Metadata {
  body: string
  frontmatter: string
  height: number
  html: string
  stamps: number
  timestamp: number
}