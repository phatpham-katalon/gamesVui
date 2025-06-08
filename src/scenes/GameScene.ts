import * as Phaser from 'phaser';
import { GameConfig } from '../config/gameConfig';
import { Bird } from '../objects/Bird';
import { PipeManager } from '../objects/PipeManager';
import { Background } from '../objects/Background';

export class GameScene extends Phaser.Scene {
  private bird: Bird;
  private pipeManager: PipeManager;
  private background: Background;
  private scoreText: Phaser.GameObjects.Text;
  private score: number = 0;
  private isGameOver: boolean = false;
  private scoreSound: Phaser.Sound.BaseSound;
  private hitSound: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    console.log('GameScene created');
    
    // Reset game state
    this.score = 0;
    this.isGameOver = false;
    
    // Create background
    this.background = new Background(this);
    
    // Create bird
    this.bird = new Bird(this);
    console.log('Bird created');
    
    // Create pipe manager
    this.pipeManager = new PipeManager(this);
    console.log('PipeManager created');
    
    // Create score text
    this.scoreText = this.add.text(
      this.cameras.main.width / 2,
      50,
      '0',
      {
        fontFamily: 'Arial',
        fontSize: '32px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6
      }
    );
    this.scoreText.setOrigin(0.5);
    this.scoreText.setDepth(20);
    
    // Setup sounds
    this.scoreSound = this.sound.add('score');
    this.hitSound = this.sound.add('hit');
    
    // Setup collisions
    console.log('Setting up collisions...');
    
    this.physics.add.collider(
      this.bird.getSprite(),
      this.data.get('groundCollider'),
      this.gameOver,
      undefined,
      this
    );
    
    this.physics.add.collider(
      this.bird.getSprite(),
      this.pipeManager.getPipes(),
      (bird, object) => {
        console.log('Collision with pipe - Game Over!');
        this.gameOver();
      },
      undefined,
      this
    );
    
    console.log('Collisions setup complete');
    
    // Setup input
    this.input.on('pointerdown', this.flap, this);
    this.input.keyboard.on('keydown-SPACE', this.flap, this);
    
    // Listen for score updates
    this.events.on('score-updated', this.updateScore, this);
    
    console.log('GameScene setup complete');
  }

  update(): void {
    if (this.isGameOver) return;
    
    this.bird.update();
    this.pipeManager.update();
    this.background.update();
    
    // Debug: Log bird position every 60 frames (1 second at 60fps)
    if (this.game.loop.frame % 60 === 0) {
      const birdSprite = this.bird.getSprite();
      console.log('Bird position:', birdSprite.x, birdSprite.y);
    }
  }

  private flap(): void {
    if (this.isGameOver) return;
    this.bird.flap();
  }

  private checkScore(bird: any, pipe: any): void {
    console.log('Overlap detected with:', pipe);
    this.pipeManager.handleScoreTrigger(bird, pipe);
  }

  private updateScore(score: number): void {
    console.log('Score updated to:', score);
    this.score = score;
    this.scoreText.setText(String(this.score));
    this.scoreSound.play();
  }

  private gameOver(): void {
    if (this.isGameOver) return;
    
    this.isGameOver = true;
    console.log('Game Over! Final score:', this.score);
    this.hitSound.play();
    
    // Stop game elements
    this.bird.die();
    this.pipeManager.pauseSpawning();
    this.background.stop();
    
    // Show game over after a short delay
    this.time.delayedCall(1000, () => {
      console.log('Switching to GameOverScene with score:', this.score);
      this.scene.start('GameOverScene', { score: this.score });
    });
  }
}
