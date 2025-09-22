import { SeagullGame } from './game/SeagullGame.js';

console.log(
  '%c🐦 YOU LOST! 🐦',
  'color: #ff4444; font-size: 48px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);'
);
console.log(
  '%cSeagull caught you in the console!',
  'color: #ffd700; font-size: 24px; font-weight: bold;'
);
console.log(
  '%cNow close the developer tools and play the game properly!',
  'color: #00ff00; font-size: 16px; font-weight: bold;'
);
console.log(
  '%cP.S. - Nice try checking the code though!',
  'color: #00bfff; font-size: 14px; font-style: italic;'
);

document.addEventListener('DOMContentLoaded', () => {
  console.log('Seagull Game Loading...');

  // Add secret developer commands to window
  (window as any).seagullSecrets = {
    help: () => {
      console.log(`
🎮 SECRET DEVELOPER COMMANDS:
• Press ↑↑↓↓←→←→BA on keyboard for Konami Code (makes seagulls spin!)
• seagullSecrets.help() - Show this help

The Konami sequence: ↑↑↓↓←→←→BA
      `);
    },
  };

  // Konami Code Implementation
  const konamiSequence = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'KeyB',
    'KeyA',
  ];
  let konamiIndex = 0;
  let konamiTimeout: number | null = null;

  document.addEventListener('keydown', (event) => {
    // Reset timeout on each keypress
    if (konamiTimeout) {
      clearTimeout(konamiTimeout);
    }

    if (event.code === konamiSequence[konamiIndex]) {
      konamiIndex++;
      console.log(
        `Konami progress: ${konamiIndex}/${konamiSequence.length} - ${event.code}`
      );

      if (konamiIndex === konamiSequence.length) {
        // Konami code completed!
        console.log('🎉 KONAMI CODE ACTIVATED! 🎉');
        console.log(
          'All seagulls are now spinning and partying for 10 seconds!'
        );

        // Make all seagulls spin
        const seagulls = document.querySelectorAll(
          '.seagull-img, .welcome-seagull'
        );
        seagulls.forEach((seagull: any) => {
          seagull.style.animation = 'spin 0.5s linear infinite';
        });

        // Reset after 10 seconds
        setTimeout(() => {
          seagulls.forEach((seagull: any) => {
            seagull.style.animation = '';
          });
          console.log("🐦 Party's over! Back to normal, seagulls!");
        }, 10000);

        konamiIndex = 0;
      } else {
        // Set timeout to reset sequence if user pauses too long
        konamiTimeout = window.setTimeout(() => {
          konamiIndex = 0;
          console.log('Konami sequence reset - too slow!');
        }, 3000);
      }
    } else {
      // Wrong key, reset sequence
      konamiIndex = 0;
      console.log('Konami sequence reset - wrong key!');
    }
  });

  console.log(
    '%cTry typing: seagullSecrets.help()',
    'color: #ff6b6b; font-weight: bold;'
  );

  try {
    const game = new SeagullGame();
    console.log('Seagull Game Initialized!');

    (window as any).seagullGame = game;

    // LinkedIn seagull hover effect
    const seagullLink = document.querySelector('.seagull-link') as HTMLElement;
    const welcomeSeagull = document.querySelector(
      '.welcome-seagull'
    ) as HTMLElement;

    if (seagullLink && welcomeSeagull) {
      seagullLink.addEventListener('mouseenter', () => {
        // Add golden glow effect on hover
        welcomeSeagull.style.filter =
          'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))';
        welcomeSeagull.style.transform = 'scale(1.1)';
      });

      seagullLink.addEventListener('mouseleave', () => {
        // Remove effects when not hovering
        welcomeSeagull.style.filter = '';
        welcomeSeagull.style.transform = '';
      });
    }

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  } catch (error) {
    console.error('Failed to initialize Seagull Game:', error);
  }
});
