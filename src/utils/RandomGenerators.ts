import { RandomAlgorithm } from '../types/index.js';

export class RandomGenerators {
  private fisherYatesSeed: number;
  private lcgSeed: number;
  private perlinSeed: number;

  constructor() {
    this.fisherYatesSeed = Date.now();
    this.lcgSeed = Date.now() % 2147483647;
    this.perlinSeed = Date.now();
  }

  /**
   * Fisher-Yates Shuffle Algorithm
   * Creates a shuffled array and returns the first element as random choice
   */
  private fisherYatesRandom(max: number): number {
    const array = Array.from({ length: max }, (_, i) => i + 1);

    for (let i = array.length - 1; i > 0; i--) {
      // Simple pseudo-random number generator for consistent seeding
      this.fisherYatesSeed = (this.fisherYatesSeed * 9301 + 49297) % 233280;
      const j = Math.floor((this.fisherYatesSeed / 233280) * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array[0];
  }

  /**
   * Linear Congruential Generator (LCG)
   * Uses the formula: (a * seed + c) mod m
   */
  private lcgRandom(max: number): number {
    const a = 1664525;
    const c = 1013904223;
    const m = 2147483647; // 2^31 - 1

    this.lcgSeed = (a * this.lcgSeed + c) % m;
    return Math.floor((this.lcgSeed / m) * max) + 1;
  }

  /**
   * Simplified Perlin Noise-based random number
   * Uses time-based noise for room selection
   */
  private perlinRandom(max: number): number {
    const time = Date.now() / 1000;
    this.perlinSeed += 0.1;

    // Simple noise function approximation
    const x = Math.sin(this.perlinSeed * 12.9898) * 43758.5453;
    const noise = x - Math.floor(x);

    // Combine with time for more variation
    const timeNoise = Math.sin(time * 0.5) * 0.5 + 0.5;
    const combined = (noise + timeNoise) / 2;

    return Math.floor(combined * max) + 1;
  }

  /**
   * Get a random room number using the specified algorithm
   */
  public getRandomRoom(algorithm: RandomAlgorithm, maxRooms: number): number {
    switch (algorithm) {
      case 'fisher-yates':
        return this.fisherYatesRandom(maxRooms);
      case 'lcg':
        return this.lcgRandom(maxRooms);
      case 'perlin':
        return this.perlinRandom(maxRooms);
      default:
        throw new Error(`Unknown algorithm: ${algorithm}`);
    }
  }

  /**
   * Reset all seeds for a new game
   */
  public resetSeeds(): void {
    const newSeed = Date.now();
    this.fisherYatesSeed = newSeed;
    this.lcgSeed = newSeed % 2147483647;
    this.perlinSeed = newSeed;
  }
}
