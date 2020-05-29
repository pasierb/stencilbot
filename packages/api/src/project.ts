import { DynamoDB } from 'aws-sdk';

interface Project {
  id: string
  name: string
  layers: Layer[]
}

interface Layer {
  x?: number
  y?: number
  background?: string
  text?: string
  image?: string
}
