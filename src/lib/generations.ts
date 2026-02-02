import { getGuestId } from './utils/guest'

export type GenerationType = 'chat' | 'image' | 'vision' | 'object'

export interface Generation {
  id: string
  userId: string
  type: GenerationType
  prompt: string
  content: string
  metadata?: any
  createdAt: string
}

let generations: Generation[] = [];

export async function saveGeneration(data: {
  type: GenerationType
  prompt: string
  content: string
  metadata?: any
}) {
  const userId = getGuestId();
  
  const newGeneration: Generation = {
    id: Math.random().toString(36).substr(2, 9),
    userId: userId,
    type: data.type,
    prompt: data.prompt,
    content: data.content,
    metadata: data.metadata,
    createdAt: new Date().toISOString()
  };
  
  generations.push(newGeneration);
  return newGeneration;
}

export async function getGenerations() {
  const userId = getGuestId();
  
  // Filter by userId and sort by createdAt descending
  return generations
    .filter(gen => gen.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
