export class AudioManager {
  private audio: HTMLAudioElement;
  private isInitialized: boolean = false;
  private isMuted: boolean = false;

  constructor() {
    this.audio = new Audio();
    this.setupAudio();
  }

  private setupAudio(): void {
    this.audio.src = 'src/seagull/seagull.m4a';
    this.audio.loop = true;
    this.audio.preload = 'auto';

    // Handle audio events
    this.audio.addEventListener('ended', () => {
      this.restartMusic();
    });

    this.audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
    });

    this.audio.volume = 0.5;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      await this.audio.load();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  public async startMusic(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.isMuted) {
      try {
        await this.audio.play();
      } catch (error) {
        console.error('Failed to start music:', error);
        // Browser might block autoplay, user needs to interact first
      }
    }
  }

  public stopMusic(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  public pauseMusic(): void {
    this.audio.pause();
  }

  public resumeMusic(): void {
    if (this.isInitialized && !this.isMuted) {
      this.audio.play().catch((error) => {
        console.error('Failed to resume music:', error);
      });
    }
  }

  public toggleMusic(): boolean {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.audio.pause();
    } else {
      this.resumeMusic();
    }

    return this.isMuted;
  }

  public isMusicMuted(): boolean {
    return this.isMuted;
  }

  private restartMusic(): void {
    this.audio.currentTime = 0;
    this.audio.play().catch((error) => {
      console.error('Failed to restart music:', error);
    });
  }

  public setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  public isPlaying(): boolean {
    return (
      !this.audio.paused && !this.audio.ended && this.audio.currentTime > 0
    );
  }
}
