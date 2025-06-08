import * as Phaser from 'phaser';
import { GameConfig } from '../config/gameConfig';
import { Background } from '../objects/Background';

export class MenuScene extends Phaser.Scene {
  private background: Background;
  private titleText: Phaser.GameObjects.Text;
  private startButton: Phaser.GameObjects.Image;
  private bird: Phaser.GameObjects.Sprite;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    // Create background
    this.background = new Background(this);
    
    // Create title
    this.titleText = this.add.text(
      this.cameras.main.width / 2,
      80,
      'FLAPPY BIRD',
      {
        fontFamily: 'Arial',
        fontSize: '32px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6
      }
    );
    this.titleText.setOrigin(0.5);
    
    // Show high score in menu
    const storedHighScore = localStorage.getItem('flappyHighScore');
    const highScore = storedHighScore ? parseInt(storedHighScore) : 0;
    
    if (highScore > 0) {
      this.add.text(
        this.cameras.main.width / 2,
        120,
        `High Score: ${highScore}`,
        {
          fontFamily: 'Arial',
          fontSize: '18px',
          color: '#FFD700',
          stroke: '#000000',
          strokeThickness: 3
        }
      ).setOrigin(0.5);
    }
    
    // Create animated bird
    this.bird = this.add.sprite(
      this.cameras.main.width / 2,
      180,
      'bird-mid'
    );
    
    // Check if animation already exists before creating
    if (!this.anims.exists('menu-fly')) {
      this.anims.create({
        key: 'menu-fly',
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
    
    this.bird.play('menu-fly');
    
    // Add floating animation
    this.tweens.add({
      targets: this.bird,
      y: 200,
      duration: 1000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
    
    // Create start button (using text instead of missing image)
    this.startButton = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 80,
      'START GAME',
      {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
        backgroundColor: '#4CAF50',
        padding: { x: 20, y: 10 }
      }
    ) as any;
    this.startButton.setOrigin(0.5);
    this.startButton.setInteractive();
    
    // Add hover effect
    this.startButton.on('pointerover', () => {
      this.startButton.setScale(1.1);
    });
    
    this.startButton.on('pointerout', () => {
      this.startButton.setScale(1);
    });
    
    // Start game on click
    this.startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
    
    // Add keyboard input
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
    
    // Add instructions
    this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height - 50,
      'Press SPACE or Click to Flap',
      {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2
      }
    ).setOrigin(0.5);
  }

  update(): void {
    this.background.update();
  }
}
