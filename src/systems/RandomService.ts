export interface RandomSource {
  next(): number;
  nextInt(min: number, max: number): number;
}

export class RandomService implements RandomSource {
  next(): number {
    return Math.random();
  }

  nextInt(min: number, max: number): number {
    if (max <= min) {
      return min;
    }

    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}
