# Spotlight Effect Application

A modern, maintainable JavaScript application that creates an interactive spotlight effect on an image using a canvas overlay.

## Features

- **Interactive Spotlight:** The spotlight smoothly follows mouse movement, with animated transitions for position and radius.
- **Multiple Spotlights:** Define any number of spotlight regions with configurable positions and radii.
- **Animated Dimming Overlay:** The background dims smoothly when a spotlight is active, with customizable opacity and animation speed.
- **Sequence Mode:** Automatically animates each spotlight in sequence, highlighting each region for a set duration (see `SequenceManager`).
- **Configurable:** All spotlight, animation, and overlay parameters (positions, radii, easing, opacity, etc.) are centralized in `src/config.js` for easy adjustment.
- **Responsive Canvas:** Canvas overlay automatically resizes to match the underlying image.
- **Hit-Testing:** Detects when the mouse is inside any spotlight region for precise interaction.
- **Extensible & Modular:** All logic is encapsulated in ES6 classes (`SpotlightTool`, `Spotlight`, `SpotlightAnimation`, `DimOverlay`, `SequenceManager`) for clarity, maintainability, and easy feature addition.
- **Easy Integration:** Works with any image and canvas elements. Minimal setup required.

## Structure

```
spotlight/
├── src/
│   ├── App.js              # Minimal application entrypoint, delegates to SpotlightTool
│   ├── SpotlightTool.js    # Handles all spotlight/canvas logic, events, and animation
│   ├── Spotlight.js        # Spotlight region class
│   ├── SpotlightAnimation.js # Spotlight animation and rendering
│   ├── DimOverlay.js       # Dimming overlay animation
│   ├── config.js           # Central configuration
│   ├── main.js             # Entrypoint
│   └── ...
├── index.html              # Demo HTML (provide your own image/canvas elements)
├── package.json            # (if using npm or Vite)
└── README.md               # This file
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (for running with Vite or any dev server)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd spotlight
   ```
2. **Install dependencies (if using Vite):**
   ```sh
   npm install
   ```

### Running the App

If using Vite or another dev server:

```sh
npm run dev
```

## Configuration

Edit `src/config.js` to:

- Add/remove spotlight points
- Adjust animation easings
- Change dimming opacity

## Code Overview

- **`App.js`**: Minimal entrypoint that creates the image and passes it (with config) to `SpotlightTool`, which manages all spotlight/canvas logic.
- **`SpotlightTool.js`**: Handles all canvas drawing, resizing, spotlight/overlay instantiation, and event logic for the spotlight effect.
- **`Spotlight.js`**: Represents a single spotlight region and provides hit-testing.
- **`SpotlightAnimation.js`**: Handles smooth animation and rendering of the spotlight.
- **`DimOverlay.js`**: Manages the animated dimming overlay.
- **`config.js`**: Central place for all animation and spotlight parameters.

## Customization

- Change the image or canvas element IDs in `index.html` or in the `App` constructor.
- Adjust `SPOTLIGHT_CONFIG` for different spotlight effects.

## License

MIT

---

For questions or improvements, feel free to open an issue or submit a pull request.
