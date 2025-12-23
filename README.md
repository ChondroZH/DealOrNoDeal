# Deal or No Deal

A browser-based implementation of the classic game show "Deal or No Deal" built with vanilla JavaScript, HTML, and CSS. Test your luck and strategy as you face off against the Banker!

## Game Overview

Deal or No Deal is a game of chance and nerve where you select briefcases containing hidden cash prizes. As you eliminate cases, the mysterious Banker makes offers to buy your case. Will you take the deal or risk it all for a bigger prize?

## Features

- 10 Briefcases with prizes ranging from $1 to $300
- Dynamic Banker Offers based on remaining prizes
- 3 Exciting Rounds with strategic case selection
- Final Switch Decision between your case and the last remaining case
- Sound Effects using Web Audio API for an immersive experience
- Responsive Design that works on desktop and mobile devices
- Visual Prize Board showing eliminated and remaining prizes
- Animated Reveals with smooth transitions and effects
- Interactive Rules Page explaining game mechanics

## How to Play

1. **Choose Your Case**: Select one briefcase from the 10 available - this is your case!
2. **Open Cases**: Each round, open a set number of cases to reveal their prizes
   - Round 1: Open 3 cases
   - Round 2: Open 3 cases
   - Round 3: Open 2 cases
3. **Face the Banker**: After each round, the Banker makes an offer based on remaining prizes
4. **Deal or No Deal**: Accept the offer (DEAL) or continue playing (NO DEAL)
5. **Final Decision**: If you reach the end and reject the final offer, choose to keep your case or switch to the last remaining case

## Prize Values

The game includes 10 prize amounts:
- $1, $5, $10, $20, $30, $50, $80, $100, $200, $300

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/DealOrNoDeal.git
cd DealOrNoDeal
```

2. Open `index.html` in your web browser

That's it! No build process or dependencies required.

### Playing Online

Simply open `index.html` in any modern web browser:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Technologies Used

- HTML5 - Structure and markup
- CSS3 - Styling with gradients, animations, and responsive design
- JavaScript (ES6+) - Game logic and interactivity
- Web Audio API - Dynamic sound effects

## Project Structure

```
DealOrNoDeal/
├── index.html      # Main game page
├── rules.html      # Rules and instructions page
├── styles.css      # All styling and animations
├── script.js       # Game logic and functionality
├── LICENSE         # Public domain license
└── README.md       # This file
```

## Features Breakdown

### Game Mechanics
- Random prize distribution for each game
- Banker algorithm that adjusts offers based on remaining prizes
- Round-based progression system
- Case swapping option in final round

### Visual Design
- Gradient backgrounds with blue theme
- Gold accents for interactive elements
- Smooth animations for case reveals
- Responsive grid layout for briefcases
- Real-time prize board updates

### Audio System
- Click sounds for case selection
- Reveal sounds based on prize values
- Special Banker offer sound
- Victory fanfares (different for various prize levels)
- Top prize celebration sequence

## Game Strategy Tips

- Early rounds: Hope to eliminate low-value cases
- Watch the prize board to track remaining values
- Banker offers are influenced by remaining prize averages
- Consider the risk vs. reward of each decision
- Trust your instincts!

## License

This project is released into the public domain under The Unlicense. See the LICENSE file for details.

## Acknowledgments

- Inspired by the TV game show "Deal or No Deal"
- Built as a learning project for web development
