import { Room, GameScreen } from '../types/index.js';

export class UIManager {
  private currentScreen: GameScreen = 'start';

  constructor() {
    this.bindEventListeners();
  }

  private bindEventListeners(): void {
    const startBtn = document.getElementById('start-btn');
    startBtn?.addEventListener('click', () => {
      this.showScreen('game');
      this.dispatchGameEvent('start-game');
    });

    const tryAgainBtn = document.getElementById('try-again-btn');
    tryAgainBtn?.addEventListener('click', () => {
      this.showScreen('game');
      this.dispatchGameEvent('restart-game');
    });

    const playAgainBtn = document.getElementById('play-again-btn');
    playAgainBtn?.addEventListener('click', () => {
      this.showScreen('start');
      this.dispatchGameEvent('reset-game');
    });

    const readyBtn = document.getElementById('ready-btn');
    readyBtn?.addEventListener('click', () => {
      this.hideSelectionPrompt();
      this.dispatchGameEvent('ready-to-select');
    });

    const musicToggleBtn = document.getElementById('music-toggle-btn');
    musicToggleBtn?.addEventListener('click', () => {
      this.dispatchGameEvent('toggle-music');
    });
  }

  public showScreen(screen: GameScreen): void {
    const screens = document.querySelectorAll('.screen');
    screens.forEach((s) => s.classList.remove('active'));

    const targetScreen = document.getElementById(`${screen}-screen`);
    if (targetScreen) {
      targetScreen.classList.add('active');
    }

    this.currentScreen = screen;
  }

  public createGameBoard(totalRooms: number): Room[] {
    const gameBoard = document.getElementById('game-board');
    if (!gameBoard) return [];

    gameBoard.innerHTML = '';

    const rooms: Room[] = [];

    for (let i = 1; i <= totalRooms; i++) {
      const roomElement = document.createElement('div');
      roomElement.className = 'room';
      roomElement.dataset.roomId = i.toString();
      roomElement.innerHTML = `<span class="room-number">${i}</span>`;

      roomElement.addEventListener('click', () => {
        this.selectRoom(i);
        this.dispatchGameEvent('room-selected', { roomId: i });
      });

      gameBoard.appendChild(roomElement);

      rooms.push({
        id: i,
        selected: false,
        seagullInside: false,
        element: roomElement,
      });
    }

    return rooms;
  }

  public selectRoom(roomId: number): void {
    const rooms = document.querySelectorAll('.room');
    rooms.forEach((room) => {
      room.classList.remove('selected');
    });

    const selectedRoom = document.querySelector(`[data-room-id="${roomId}"]`);
    if (selectedRoom) {
      selectedRoom.classList.add('selected');
    }
  }

  public showSeagullInRoom(roomId: number): void {
    const room = document.querySelector(`[data-room-id="${roomId}"]`);
    if (room) {
      room.classList.add('has-seagull');
    }
  }

  public clearSeagullsFromRooms(): void {
    const rooms = document.querySelectorAll('.room');
    rooms.forEach((room) => {
      room.classList.remove('has-seagull');
    });
  }

  public updateTimer(seconds: number): void {
    const timerElement = document.getElementById('timer');
    if (timerElement) {
      timerElement.textContent = seconds.toString();
    }
  }

  public updateSeagullCounter(current: number, total: number): void {
    const counterElement = document.getElementById('counter');
    if (counterElement) {
      counterElement.textContent = `${current}/${total}`;
    }
  }

  public showSeagullMovement(targetRoomId: number): void {
    const seagullContainer = document.getElementById('seagull-container');
    const targetRoom = document.querySelector(
      `[data-room-id="${targetRoomId}"]`
    );

    if (seagullContainer && targetRoom) {
      seagullContainer.classList.add('moving');

      const rect = targetRoom.getBoundingClientRect();
      const gameScreen = document.getElementById('game-screen');
      const gameScreenRect = gameScreen!.getBoundingClientRect();

      const x = rect.left - gameScreenRect.left - 10 + (rect.width - 150) / 2;
      const y = rect.top - gameScreenRect.top - 10 + (rect.height - 150) / 2;

      seagullContainer.style.transform = `translate(${x}px, ${y}px)`;
    }
  }

  public showSeagullForWave(waveNumber: number): void {
    for (let i = 1; i <= 3; i++) {
      const seagullContainer = document.getElementById(
        `seagull-container-${i}`
      );
      if (seagullContainer) {
        seagullContainer.classList.add('hidden');
      }
    }

    const currentSeagullContainer = document.getElementById(
      `seagull-container-${waveNumber}`
    );
    if (currentSeagullContainer) {
      currentSeagullContainer.classList.remove('hidden');
      currentSeagullContainer.classList.remove('moving');
      currentSeagullContainer.style.transform = 'translate(50px, 100px)';
    }
  }

  public showSeagullMovementForWave(
    waveNumber: number,
    targetRoomId: number
  ): void {
    const seagullContainer = document.getElementById(
      `seagull-container-${waveNumber}`
    );
    const targetRoom = document.querySelector(
      `[data-room-id="${targetRoomId}"]`
    );

    if (seagullContainer && targetRoom) {
      seagullContainer.classList.remove('hidden');
      seagullContainer.classList.add('moving');

      const rect = targetRoom.getBoundingClientRect();
      const gameScreen = document.getElementById('game-screen');
      const gameScreenRect = gameScreen!.getBoundingClientRect();

      const x = rect.left - gameScreenRect.left - 10 + (rect.width - 150) / 2;
      const y = rect.top - gameScreenRect.top - 10 + (rect.height - 150) / 2;

      seagullContainer.style.transform = `translate(${x}px, ${y}px)`;
    }
  }

  public resetSeagullPosition(): void {
    const seagullContainer = document.getElementById('seagull-container');
    if (seagullContainer) {
      seagullContainer.classList.remove('moving');
      seagullContainer.style.transform = 'translate(50px, 100px)'; // Reset to initial position
    }
  }

  public resetSeagullPositionForWave(waveNumber: number): void {
    const seagullContainer = document.getElementById(
      `seagull-container-${waveNumber}`
    );
    if (seagullContainer) {
      seagullContainer.classList.remove('moving');
      seagullContainer.style.transform = 'translate(50px, 100px)'; // Reset to initial position
    }
  }

  public updateMusicButton(isMuted: boolean): void {
    const musicBtn = document.getElementById('music-toggle-btn');
    if (musicBtn) {
      if (isMuted) {
        musicBtn.classList.add('muted');
        musicBtn.textContent = '🔇';
      } else {
        musicBtn.classList.remove('muted');
        musicBtn.textContent = '🎵';
      }
    }
  }

  public resetAllSeagulls(): void {
    for (let i = 1; i <= 3; i++) {
      const seagullContainer = document.getElementById(
        `seagull-container-${i}`
      );
      if (seagullContainer) {
        seagullContainer.classList.add('hidden');
        seagullContainer.classList.remove('moving');
        seagullContainer.style.transform = 'translate(50px, 100px)'; // Reset to initial position
      }
    }
  }

  public showGameOver(title: string = 'You Died!'): void {
    const gameOverTitle = document.getElementById('game-over-title');
    if (gameOverTitle) {
      gameOverTitle.textContent = title;
    }
    this.showScreen('game-over');
  }

  public showVictory(): void {
    this.showScreen('victory');
  }

  public showSelectionPrompt(): void {
    const prompt = document.getElementById('selection-prompt');
    if (prompt) {
      prompt.classList.remove('hidden');
    }
  }

  public hideSelectionPrompt(): void {
    const prompt = document.getElementById('selection-prompt');
    if (prompt) {
      prompt.classList.add('hidden');
    }
  }

  public convertRoomToSeagullDancing(roomId: number): void {
    const room = document.querySelector(`[data-room-id="${roomId}"]`);
    if (room) {
      room.classList.remove('has-seagull', 'selected');
      room.classList.add('seagull-dancing');
    }
  }

  public clearAllRoomStates(): void {
    const rooms = document.querySelectorAll('.room');
    rooms.forEach((room) => {
      room.classList.remove('selected', 'has-seagull', 'seagull-dancing');
    });
  }

  public fadeOutSeagullInRoom(roomId: number): void {
    const room = document.querySelector(`[data-room-id="${roomId}"]`);
    if (room) {
      room.classList.remove('has-seagull');
      setTimeout(() => {
        room.classList.remove('selected');
      }, 500);
    }
  }

  private dispatchGameEvent(eventType: string, data?: any): void {
    const event = new CustomEvent(`game:${eventType}`, { detail: data });
    document.dispatchEvent(event);
  }

  public getCurrentScreen(): GameScreen {
    return this.currentScreen;
  }
}
