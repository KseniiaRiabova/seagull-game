import {
  GameState,
  GameConfig,
  Room,
  SeagullWave,
  RandomAlgorithm,
} from '../types/index.js';
import { AudioManager } from '../managers/AudioManager.js';
import { UIManager } from '../managers/UIManager.js';
import { RandomGenerators } from '../utils/RandomGenerators.js';

export class SeagullGame {
  private gameState: GameState;
  private gameConfig: GameConfig;
  private rooms: Room[] = [];
  private seagullWaves: SeagullWave[] = [];
  private audioManager: AudioManager;
  private uiManager: UIManager;
  private randomGenerators: RandomGenerators;
  private timerInterval: number | null = null;
  private seagullMoveTimeout: number | null = null;

  constructor() {
    this.gameConfig = {
      totalRooms: 9,
      totalSeagulls: 3,
      selectionTimer: 5,
      seagullMoveTime: 5000,
    };

    this.gameState = this.createInitialState();
    this.audioManager = new AudioManager();
    this.uiManager = new UIManager();
    this.randomGenerators = new RandomGenerators();

    this.setupEventListeners();
    this.setupSeagullWaves();
  }

  private createInitialState(): GameState {
    return {
      currentSeagullWave: 0,
      totalSeagulls: this.gameConfig.totalSeagulls,
      playerAlive: true,
      gameActive: false,
      selectedRoomId: null,
      timer: this.gameConfig.selectionTimer,
      seagullsDefeated: [],
    };
  }

  private setupEventListeners(): void {
    document.addEventListener('game:start-game', () => this.startNewGame());
    document.addEventListener('game:restart-game', () =>
      this.restartCurrentWave()
    );
    document.addEventListener('game:reset-game', () => this.resetGame());
    document.addEventListener('game:room-selected', (e: any) => {
      this.selectRoom(e.detail.roomId);
    });
    document.addEventListener('game:ready-to-select', () => {
      this.startSelectionTimer();
    });
    document.addEventListener('game:toggle-music', () => {
      this.toggleMusic();
    });
  }

  private setupSeagullWaves(): void {
    const algorithms: RandomAlgorithm[] = ['fisher-yates', 'lcg', 'perlin'];

    this.seagullWaves = algorithms.map((algorithm, index) => ({
      id: index + 1,
      algorithm,
      targetRoom: 0,
      isActive: false,
    }));
  }

  public async startNewGame(): Promise<void> {
    console.log('Starting new game...');

    await this.audioManager.initialize();
    if (!this.audioManager.isPlaying() && !this.audioManager.isMusicMuted()) {
      await this.audioManager.startMusic();
    }

    this.gameState = this.createInitialState();
    this.gameState.gameActive = true;
    this.randomGenerators.resetSeeds();

    this.rooms = this.uiManager.createGameBoard(this.gameConfig.totalRooms);

    this.uiManager.resetAllSeagulls();

    this.startSeagullWave();
  }

  private startSeagullWave(): void {
    if (this.gameState.currentSeagullWave >= this.gameConfig.totalSeagulls) {
      this.gameWon();
      return;
    }

    console.log(
      `Starting seagull wave ${this.gameState.currentSeagullWave + 1}`
    );

    this.uiManager.clearAllRoomStates();
    this.uiManager.resetSeagullPosition();

    this.gameState.currentSeagullWave++;
    this.uiManager.updateSeagullCounter(
      this.gameState.currentSeagullWave,
      this.gameConfig.totalSeagulls
    );

    const currentWave =
      this.seagullWaves[this.gameState.currentSeagullWave - 1];
    currentWave.isActive = true;

    this.uiManager.showSeagullForWave(this.gameState.currentSeagullWave);

    currentWave.targetRoom = this.randomGenerators.getRandomRoom(
      currentWave.algorithm,
      this.gameConfig.totalRooms
    );

    console.log(
      `Seagull ${this.gameState.currentSeagullWave} using ${currentWave.algorithm} algorithm`
    );

    this.gameState.selectedRoomId = null;

    this.uiManager.showSelectionPrompt();
  }

  private startSelectionTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.gameState.timer = this.gameConfig.selectionTimer;
    this.uiManager.updateTimer(this.gameState.timer);

    this.timerInterval = window.setInterval(() => {
      this.gameState.timer--;
      this.uiManager.updateTimer(this.gameState.timer);

      if (this.gameState.timer <= 0) {
        this.handleTimerExpired();
      }
    }, 1000);
  }

  private handleTimerExpired(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.gameState.selectedRoomId === null) {
      this.gameOver("Time's up! You didn't select a room!");
      return;
    }

    this.startSeagullMovement();
  }

  private startSeagullMovement(): void {
    const currentWave =
      this.seagullWaves[this.gameState.currentSeagullWave - 1];

    this.uiManager.showSeagullMovementForWave(
      this.gameState.currentSeagullWave,
      currentWave.targetRoom
    );

    this.seagullMoveTimeout = window.setTimeout(() => {
      this.resolveSeagullWave();
    }, this.gameConfig.seagullMoveTime);
  }

  private toggleMusic(): void {
    const isMuted = this.audioManager.toggleMusic();
    this.uiManager.updateMusicButton(isMuted);
  }

  private resolveSeagullWave(): void {
    const currentWave =
      this.seagullWaves[this.gameState.currentSeagullWave - 1];

    if (!currentWave) {
      console.error(
        'Current wave is undefined! Current wave index:',
        this.gameState.currentSeagullWave - 1
      );
      return;
    }

    this.uiManager.showSeagullInRoom(currentWave.targetRoom);

    if (this.gameState.selectedRoomId === currentWave.targetRoom) {
      this.gameOver('TOh no! Your food is gone!');
    } else {
      this.gameState.seagullsDefeated.push(currentWave.id);
      currentWave.isActive = false;

      setTimeout(() => {
        this.uiManager.fadeOutSeagullInRoom(currentWave.targetRoom);
        this.uiManager.convertRoomToSeagullDancing(currentWave.targetRoom);
      }, 1000);

      setTimeout(() => {
        this.startSeagullWave();
      }, 3000);
    }
  }

  private selectRoom(roomId: number): void {
    if (!this.gameState.gameActive || this.gameState.selectedRoomId !== null) {
      return;
    }

    this.gameState.selectedRoomId = roomId;
    this.uiManager.selectRoom(roomId);

    console.log(`Player selected room ${roomId}`);

    // Stop the timer and immediately start seagull movement
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.startSeagullMovement();
  }

  private gameOver(message?: string): void {
    console.log('Game Over:', message);

    this.gameState.gameActive = false;
    this.gameState.playerAlive = false;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.seagullMoveTimeout) {
      clearTimeout(this.seagullMoveTimeout);
      this.seagullMoveTimeout = null;
    }

    this.uiManager.showGameOver(message);
  }

  private gameWon(): void {
    console.log('Game Won!');

    this.gameState.gameActive = false;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.seagullMoveTimeout) {
      clearTimeout(this.seagullMoveTimeout);
      this.seagullMoveTimeout = null;
    }

    this.uiManager.showVictory();
  }

  private restartCurrentWave(): void {
    console.log('Restarting current wave...');

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.seagullMoveTimeout) {
      clearTimeout(this.seagullMoveTimeout);
      this.seagullMoveTimeout = null;
    }

    this.gameState.playerAlive = true;
    this.gameState.gameActive = true;
    this.gameState.selectedRoomId = null;
    this.gameState.timer = this.gameConfig.selectionTimer;
    this.gameState.currentSeagullWave--;

    if (!this.audioManager.isPlaying() && !this.audioManager.isMusicMuted()) {
      this.audioManager.startMusic();
    }

    this.startSeagullWave();
  }

  private resetGame(): void {
    console.log('Resetting game...');

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.seagullMoveTimeout) {
      clearTimeout(this.seagullMoveTimeout);
      this.seagullMoveTimeout = null;
    }

    this.gameState = this.createInitialState();
    this.randomGenerators.resetSeeds();

    this.setupSeagullWaves();

    this.uiManager.clearAllRoomStates();
    this.uiManager.resetAllSeagulls();
  }
}
