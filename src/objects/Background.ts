import * as Phaser from 'phaser';
import { GameConfig } from '../config/gameConfig';

export class Background {
  private scene: Phaser.Scene;
  private bg1: Phaser.GameObjects.TileSprite;
  private bg2: Phaser.GameObjects.TileSprite;
  private ground: Phaser.GameObjects.TileSprite;
  private isMoving: boolean = true;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createBackground();
  }

  private createBackground(): void {
    // Sky background
    this.bg1 = this.scene.add.tileSprite(
      0, 
      0, 
      this.scene.cameras.main.width,
      this.scene.cameras.main.height,
      'background'
    );
    this.bg1.setOrigin(0, 0);
    this.bg1.setDepth(0);
    
    // Ground
    const groundY = this.scene.cameras.main.height - 112;
    this.ground = this.scene.add.tileSprite(
      0,
      groundY,
      this.scene.cameras.main.width,
      112,
      'ground'
    );
    this.ground.setOrigin(0, 0);
    this.ground.setDepth(1);
    
    // Add ground collision
    const groundCollider = this.scene.physics.add.staticGroup();
    const collider = groundCollider.create(
      this.scene.cameras.main.width / 2,
      groundY + 56,
      'ground'
    ) as Phaser.Physics.Arcade.Sprite;
    
    collider.setVisible(false);
    collider.setSize(this.scene.cameras.main.width, 112);
    collider.setImmovable(true);
    
    // Expose the ground collider
    this.scene.data.set('groundCollider', groundCollider);
  }

  update(): void {
    if (!this.isMoving) return;
    
    // Scroll the background
    this.bg1.tilePositionX += 0.5;
    this.ground.tilePositionX += 2;
  }

  stop(): void {
    this.isMoving = false;
  }

  resume(): void {
    this.isMoving = true;
  }
}
