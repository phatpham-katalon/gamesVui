import * as Phaser from 'phaser';
import { GameConfig } from '../config/gameConfig';

export class Bird {
  private scene: Phaser.Scene;
  private sprite: Phaser.Physics.Arcade.Sprite;
  private isDead: boolean = false;
  private flapSound: Phaser.Sound.BaseSound;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createBird();
    this.createAnimations();
    this.setupSound();
  }

  private createBird(): void {
    const { x, y } = GameConfig.bird.initialPosition;
    this.sprite = this.scene.physics.add.sprite(x, y, 'bird-mid');
    this.sprite.setOrigin(0.5);
    this.sprite.setDepth(2);
    this.sprite.setBounce(0.1);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.body.setSize(this.sprite.width - 8, this.sprite.height - 8);
  }

  private createAnimations(): void {
    // Check if animation already exists before creating
    if (!this.scene.anims.exists('fly')) {
      this.scene.anims.create({
        key: 'fly',
        frames: [
          { key: 'bird-up' },
          { key: 'bird-mid' },
          { key: 'bird-down' },
          { key: 'bird-mid' }
        ],
        frameRate: 10,
        repeat: -1
      });
    }
    
    this.sprite.play('fly');
  }

  private setupSound(): void {
    this.flapSound = this.scene.sound.add('flap');
  }

  flap(): void {
    if (this.isDead) return;
    
    this.sprite.setVelocityY(GameConfig.bird.flapStrength);
    this.flapSound.play();
  }

  update(): void {
    if (this.isDead) return;
    
    // Rotate bird based on velocity
    if (this.sprite.body.velocity.y < 0) {
      // Going up
      this.sprite.setRotation(GameConfig.bird.rotation.up);
    } else {
      // Going down
      this.sprite.setRotation(Math.min(
        GameConfig.bird.rotation.down,
        this.sprite.rotation + 0.05
      ));
    }
  }

  die(): void {
    this.isDead = true;
    this.sprite.anims.stop();
  }

  reset(): void {
    const { x, y } = GameConfig.bird.initialPosition;
    this.sprite.setPosition(x, y);
    this.sprite.setVelocity(0, 0);
    this.sprite.setRotation(0);
    this.sprite.play('fly');
    this.isDead = false;
  }

  getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  isDying(): boolean {
    return this.isDead;
  }
}
