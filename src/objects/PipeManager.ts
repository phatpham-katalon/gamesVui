import * as Phaser from 'phaser';
import { GameConfig } from '../config/gameConfig';

export class PipeManager {
  private scene: Phaser.Scene;
  private pipes: Phaser.Physics.Arcade.Group;
  private timer: Phaser.Time.TimerEvent;
  private lastPipeX: number = 0;
  private passedPipes: number = 0;
  private scoreTriggers: Array<{x: number, y: number, scored: boolean, initialX: number}> = []; // Manual tracking

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    console.log('PipeManager constructor called');
    this.createPipeGroup();
    this.setupTimer();
    console.log('PipeManager initialized');
  }

  private createPipeGroup(): void {
    this.pipes = this.scene.physics.add.group({
      allowGravity: false,
      immovable: true
    });
  }

  private setupTimer(): void {
    console.log('Setting up pipe timer');
    // Create first pipes immediately, then every 2 seconds
    this.createPipes(); // Create first set immediately
    
    this.timer = this.scene.time.addEvent({
      delay: 2000, // Increased to 2 seconds for better spacing
      callback: this.createPipes,
      callbackScope: this,
      loop: true
    });
    console.log('Timer created:', this.timer);
  }

  createPipes(): void {
    const rightEdge = this.scene.cameras.main.width;
    const minY = 120; // Minimum Y position for gap center
    const maxY = this.scene.cameras.main.height - 120; // Maximum Y position for gap center
    const centerY = Phaser.Math.Between(minY, maxY);
    
    console.log('Creating pipes at:', rightEdge + 50, centerY);
    
    // Create top pipe
    const topPipe = this.pipes.create(
      rightEdge + 50, 
      centerY - GameConfig.pipes.spacing.vertical / 2, 
      'pipe'
    ) as Phaser.Physics.Arcade.Sprite;
    
    if (!topPipe) {
      console.error('Failed to create top pipe');
      return;
    }
    
    topPipe.setOrigin(0.5, 1); // Set origin to bottom center
    topPipe.setFlipY(true);    // Flip the pipe
    topPipe.setDepth(1);
    topPipe.setVelocityX(GameConfig.pipes.speed);
    
    console.log('Top pipe created:', topPipe.x, topPipe.y);
    
    // Create bottom pipe
    const bottomPipe = this.pipes.create(
      rightEdge + 50, 
      centerY + GameConfig.pipes.spacing.vertical / 2, 
      'pipe'
    ) as Phaser.Physics.Arcade.Sprite;
    
    if (!bottomPipe) {
      console.error('Failed to create bottom pipe');
      return;
    }
    
    bottomPipe.setOrigin(0.5, 0); // Set origin to top center
    bottomPipe.setDepth(1);
    bottomPipe.setVelocityX(GameConfig.pipes.speed);
    
    console.log('Bottom pipe created:', bottomPipe.x, bottomPipe.y);
    
    // Store the x position for scoring
    this.lastPipeX = rightEdge + 50;
    
    // Add score trigger to manual tracking array
    this.scoreTriggers.push({
      x: rightEdge + 50,
      y: centerY,
      scored: false,
      initialX: rightEdge + 50
    });
    
    console.log('Score trigger added to manual tracking:', rightEdge + 50, centerY);
  }

  update(): void {
    // Remove pipes that are off screen
    this.pipes.getChildren().forEach((pipe: Phaser.GameObjects.GameObject) => {
      const pipeSprite = pipe as Phaser.Physics.Arcade.Sprite;
      
      if (pipeSprite.x < -50) {
        this.pipes.remove(pipeSprite, true, true);
      }
    });
    
    // Manual score detection
    this.checkScoreManually();
    
    // Clean up old score triggers
    const oldCount = this.scoreTriggers.length;
    this.scoreTriggers = this.scoreTriggers.filter(trigger => trigger.x > -100);
    if (this.scoreTriggers.length !== oldCount) {
      console.log('Cleaned up score triggers, remaining:', this.scoreTriggers.length);
    }
    
    // Debug: Log score triggers positions every 2 seconds
    if (this.scene.game.loop.frame % 120 === 0 && this.scoreTriggers.length > 0) {
      console.log('Active score triggers:', this.scoreTriggers.map(t => `X:${Math.round(t.x)} scored:${t.scored}`));
    }
  }

  private checkScoreManually(): void {
    // Get bird position from scene data
    const birdSprite = (this.scene as any).bird?.getSprite();
    if (!birdSprite) return;
    
    const birdX = birdSprite.x;
    const birdY = birdSprite.y;
    
    // Update score trigger positions (they move with pipes)
    this.scoreTriggers.forEach(trigger => {
      // Calculate current X position based on pipe speed and time
      const deltaTime = this.scene.game.loop.delta / 1000; // Convert to seconds
      trigger.x += GameConfig.pipes.speed * deltaTime;
    });
    
    // Check each score trigger
    this.scoreTriggers.forEach(trigger => {
      // Score when pipe passes bird (pipe moves from right to left)
      if (!trigger.scored && trigger.x <= birdX && trigger.x > birdX - 50) {
        console.log('🎯 Manual score detection! Pipe passed bird at X:', Math.round(trigger.x), 'Bird X:', Math.round(birdX));
        trigger.scored = true;
        this.passedPipes++;
        console.log('✅ New score:', this.passedPipes);
        
        // Emit score event
        this.scene.events.emit('score-updated', this.passedPipes);
      }
    });
  }

  handleScoreTrigger(bird: any, trigger: any): void {
    // This method is now unused, but keeping for compatibility
    console.log('handleScoreTrigger called (unused)');
  }

  getPipes(): Phaser.Physics.Arcade.Group {
    return this.pipes;
  }

  reset(): void {
    console.log('Resetting PipeManager');
    
    // Clear all pipes and triggers
    this.pipes.clear(true, true);
    this.passedPipes = 0;
    this.scoreTriggers = []; // Clear manual tracking
    
    // Remove existing timer
    if (this.timer) {
      this.timer.destroy();
    }
    
    // Create new timer
    this.setupTimer();
    
    console.log('PipeManager reset complete');
  }

  getScore(): number {
    return this.passedPipes;
  }

  pauseSpawning(): void {
    this.timer.paused = true;
  }

  resumeSpawning(): void {
    this.timer.paused = false;
  }
}
