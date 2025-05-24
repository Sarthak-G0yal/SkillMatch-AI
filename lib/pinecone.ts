// lib/pinecone.ts
import { Pinecone } from '@pinecone-database/pinecone';

export function initPinecone() {
  // With PINECONE_API_KEY set, no args are needed
  return new Pinecone();
}
