export class RateLimiter {
  private requestCount: number = 0;
  private lastReset: number = Date.now();
  private remainingRequests: number;
  private resetInterval: number;

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {
    this.remainingRequests = maxRequests;
    this.resetInterval = windowMs;
  }

  tryAcquire(): boolean {
    const now = Date.now();

    // Reset if window has passed
    if (now - this.lastReset >= this.resetInterval) {
      this.requestCount = 0;
      this.lastReset = now;
      this.remainingRequests = this.maxRequests;
    }

    // Check if we can make another request
    if (this.requestCount >= this.maxRequests) {
      return false;
    }

    this.requestCount++;
    this.remainingRequests--;
    return true;
  }

  updateLimits(remaining: number, resetInSeconds: number): void {
    this.remainingRequests = remaining;
    this.resetInterval = resetInSeconds * 1000;
    this.lastReset = Date.now();
  }

  getRemainingRequests(): number {
    return this.remainingRequests;
  }

  getTimeUntilReset(): number {
    const now = Date.now();
    return Math.max(0, this.resetInterval - (now - this.lastReset));
  }
}