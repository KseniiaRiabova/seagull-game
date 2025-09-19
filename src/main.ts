import { SeagullGame } from './game/SeagullGame.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Seagull Game Loading...');

  try {
    const game = new SeagullGame();
    console.log('Seagull Game Initialized!');

    (window as any).seagullGame = game;
  } catch (error) {
    console.error('Failed to initialize Seagull Game:', error);
  }
});
