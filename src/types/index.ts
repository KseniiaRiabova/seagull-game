export interface Room {
  id: number;
  selected: boolean;
  seagullInside: boolean;
  element: HTMLElement;
}

export interface GameState {
  currentSeagullWave: number;
  totalSeagulls: number;
  playerAlive: boolean;
  gameActive: boolean;
  selectedRoomId: number | null;
  timer: number;
  seagullsDefeated: number[];
}

export interface SeagullWave {
  id: number;
  algorithm: 'fisher-yates' | 'lcg' | 'perlin';
  targetRoom: number;
  isActive: boolean;
}

export interface GameConfig {
  totalRooms: number;
  totalSeagulls: number;
  selectionTimer: number;
  seagullMoveTime: number;
}

export type GameScreen = 'start' | 'game' | 'game-over' | 'victory';

export type RandomAlgorithm = 'fisher-yates' | 'lcg' | 'perlin';
