import * as Phaser from 'phaser';
import { GameConfig } from './config/gameConfig';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';

// Game configuration
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GameConfig.width,
  height: GameConfig.height,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: GameConfig.physics.gravity },
      debug: GameConfig.debug
    }
  },
  scene: [
    BootScene,
    MenuScene,
    GameScene,
    GameOverScene
  ]
};

// Create and start the game
new Phaser.Game(config);
