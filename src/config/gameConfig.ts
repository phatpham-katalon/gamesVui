export const GameConfig = {
  width: 288,
  height: 512,
  physics: {
    gravity: 700
  },
  bird: {
    initialPosition: { x: 50, y: 250 },
    flapStrength: -350,
    rotation: {
      up: -0.5,
      down: 0.5
    }
  },
  pipes: {
    speed: -200,
    spacing: {
      horizontal: 200,
      vertical: 150
    },
    holeHeight: 120
  },
  background: {
    speed: -50
  },
  debug: false
};
