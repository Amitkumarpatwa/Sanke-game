# Snake Game 🐍⚡
 
A fully responsive, cyberpunk-themed Snake game built with HTML5, CSS3, and JavaScript. Features neon glowing visuals, multiple difficulty levels, dark/light theme switching, wraparound walls, and smooth gameplay across all devices.
 
## Description
 
Classic Snake game reimagined with a Neon/Cyberpunk aesthetic. Navigate your snake to eat food, grow longer, and achieve high scores. The game features a deep dark background with glowing cyan, pink, and purple neon colours, a pulsing neon-pink food item, and a snake that fades from cyan to purple along its length. Three difficulty levels (Easy, Intermediate, Hard) let players choose their challenge, and scores are tracked separately per level.
 
## Tech Stack
 
- **HTML5** - Semantic markup and canvas element for game rendering
- **CSS3** - Cyberpunk theme with CSS variables, neon glow effects, scanline overlay, clip-path geometry, and responsive design
- **JavaScript (Vanilla)** - Game logic, animations, collision detection, and state management
- **LocalStorage API** - Persistent high scores and theme preferences
- **Canvas API** - 2D graphics rendering with `shadowBlur` neon glow effects
- **Google Fonts** - Orbitron (display/headings) and Rajdhani (body text)
 
## Features
 
- 🎮 **Three Difficulty Levels** - Easy, Intermediate, and Hard with colour-coded neon borders (green / cyan / pink)
- 🌓 **Dark/Light Theme** - Both themes use the cyberpunk palette; toggle with the button in the header
- 📱 **Fully Responsive** - Optimised for desktop, tablet, and mobile with breakpoints at 768px, 480px, and 360px
- 🎯 **Separate High Scores** - Best scores tracked independently per difficulty level
- 🔄 **Wraparound Walls** - Snake passes through walls and reappears on the opposite side
- ⌨️ **Multiple Controls** - Keyboard arrows/WASD, on-screen d-pad buttons, and touch swipe gestures
- ⏸️ **Pause/Resume** - Spacebar or pause button with visual feedback
- 💾 **Auto-Save** - Preferences and scores saved automatically via LocalStorage
- ✨ **Neon Glow Effects** - Canvas `shadowBlur` on the snake, pulsing animated food, sweeping border animation, and a subtle CRT scanline overlay
 
## Visual Style
 
| Element | Colour |
|---|---|
| Snake head | Neon cyan `#00f5ff` with glow |
| Snake body | Cyan → purple gradient fade |
| Food | Pulsing neon pink `#ff007f` |
| Canvas grid | Near-invisible cyan lines |
| Easy level card | Neon green `#39ff14` border |
| Intermediate level card | Neon cyan `#00f5ff` border |
| Hard level card | Neon pink `#ff007f` border |
| Buttons | Cyan-to-purple gradient |
| Secondary buttons | Pink-to-purple gradient |
 
## How to Play
 
1. Open `index.html` in a web browser
2. Select a difficulty level (Easy, Intermediate, or Hard)
3. Click **Start Game** or press **Spacebar**
4. Control the snake using:
   - **Desktop**: Arrow keys or WASD
   - **Mobile**: On-screen d-pad or swipe gestures
5. Eat the food to grow and increase your score
6. Avoid colliding with yourself
7. Pass through walls to continue playing
 
## Installation
 
No installation required. Simply:
 
1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. Start playing
 
## File Structure
 
```
Snake game/
├── index.html      # Main HTML structure
├── style.css       # Cyberpunk styling, neon theme, and responsive design
├── script.js       # Game logic, canvas drawing, and neon colour effects
└── README.md       # Project documentation
```
 
## Browser Compatibility
 
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera
 
## Controls
 
| Input | Action |
|---|---|
| ↑ / W | Move Up |
| ↓ / S | Move Down |
| ← / A | Move Left |
| → / D | Move Right |
| Space | Pause / Resume |
| Swipe (mobile) | Directional swipe gesture |
 
## Game Rules
 
- Snake grows when it eats food
- Score increases by 10 points per food item eaten
- Game ends if the snake collides with itself
- Walls are wraparound — the snake passes through and reappears on the other side
- High scores are saved per difficulty level and persist between sessions
 
## Customisation
 
The game uses CSS variables for easy theming. Modify colours in `style.css`:
 
```css
:root {
    --neon-cyan: #00f5ff;
    --neon-pink: #ff007f;
    --neon-green: #39ff14;
    --neon-purple: #bf00ff;
    /* ... more variables ... */
}
```
 
Canvas colours (snake and food) are set in `script.js` inside the `drawSnake()` and `drawFood()` functions.
 
## Future Enhancements
 
- Sound effects and synthwave background music
- Power-ups and special items with unique neon colours
- Multiplayer mode
- Cloud leaderboard
- Custom snake skins
- Additional game modes (timed, maze)
 
## License
 
This project is open source and available for personal and educational use.
 
## Credits
 
Built with vanilla web technologies and a neon aesthetic.
 







