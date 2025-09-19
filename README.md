# Seagull Game

<div align="center">
  <img src="src/seagull/seagull.gif" alt="Seagull Animation" width="200"/>
</div>

A responsive web game where you hide from seagulls using TypeScript and advanced random algorithms.

## Game Features

- **Responsive Design**: Works on all devices (desktop, tablet, mobile)
- **3 Random Algorithms**: Each seagull uses different AI:
  - Seagull 1: Fisher-Yates shuffle algorithm
  - Seagull 2: Linear Congruential Generator (LCG)
  - Seagull 3: Perlin Noise-based selection
- **Background Music**: Looping soundtrack for immersive experience
- **Progressive Difficulty**: Face 3 seagulls, each with unique behavior
- **Dynamic Grid**: 9 rooms with varied sizes
- **Visual Effects**: Animated seagull movement and room selection

## How to Play

1. Turn on music for better experience
2. Click "Start Game" to begin
3. When timer starts (5 seconds), quickly select a room by clicking on it
4. Watch the seagull move to its chosen room
5. If the seagull chooses your room - you lose!
6. Survive all 3 seagulls to win!

## Development

### Prerequisites

- Node.js (v14 or higher)
- TypeScript

### Setup

```bash
npm install
npm run build
npm run serve
```

### Development Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode for development
- `npm run serve` - Start local server

### Project Structure

```
src/
├── game/
│   └── SeagullGame.ts      # Main game logic
├── managers/
│   ├── AudioManager.ts     # Background music handling
│   └── UIManager.ts        # User interface management
├── utils/
│   └── RandomGenerators.ts # Random number algorithms
├── types/
│   └── index.ts           # TypeScript interfaces
└── main.ts                # Entry point

styles/
└── main.css               # Responsive CSS styles

assets/
└── seagull/
    ├── seagull.gif        # Seagull animation
    ├── seagull-happy.png  # Happy seagull (game over)
    ├── seagull-sad.png    # Sad seagull (victory)
    └── seagull.m4a        # Background music
```

## Technical Details

### Random Algorithms

1. **Fisher-Yates Shuffle**: Creates a shuffled array of all rooms, selects first
2. **Linear Congruential Generator**: Uses mathematical formula `(a * seed + c) mod m`
3. **Perlin Noise**: Time-based noise function for organic randomness

### Responsive Design

- CSS Grid for dynamic room layouts
- Clamp() functions for scalable typography
- Media queries for mobile, tablet, and landscape orientations
- Touch-friendly interface elements

### Audio System

- Automatic looping of background music
- Browser autoplay policy compliance
- Error handling for audio failures

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Controls

- **Mouse**: Click to select rooms
- **Touch**: Tap to select rooms (mobile/tablet)
- **Keyboard**: Not supported (visual game only)

Enjoy the game and try to outsmart the seagulls! 🐦
