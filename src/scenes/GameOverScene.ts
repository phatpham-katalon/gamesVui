import * as Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  private score: number = 0;
  private highScore: number = 0;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: { score: number }): void {
    console.log('GameOverScene init with data:', data);
    this.score = data.score || 0;
    console.log('Current score:', this.score);
    
    // Get high score from local storage
    const storedHighScore = localStorage.getItem('flappyHighScore');
    this.highScore = storedHighScore ? parseInt(storedHighScore) : 0;
    console.log('Stored high score:', this.highScore);
    
    // Update high score if needed
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('flappyHighScore', String(this.highScore));
      console.log('New high score saved:', this.highScore);
    }
  }

  create(): void {
    console.log('Creating GameOverScene with score:', this.score, 'high score:', this.highScore);
    
    // Add background (semi-transparent overlay)
    const overlay = this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.7
    );
    
    // Add game over image
    const gameOver = this.add.image(
      this.cameras.main.width / 2,
      120,
      'game-over'
    );
    
    // Create score panel background
    const panelBg = this.add.rectangle(
      this.cameras.main.width / 2,
      220,
      200,
      100,
      0x8B4513,
      0.8
    );
    // panelBg.setStroke(0xFFFFFF, 2); // Remove this line as Rectangle doesn't have setStroke
    
    // Add score text
    const scoreText = this.add.text(
      this.cameras.main.width / 2,
      200,
      `Score: ${this.score}`,
      {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
      }
    );
    scoreText.setOrigin(0.5);
    
    // Add high score text with different color if it's a new record
    const isNewRecord = this.score === this.highScore && this.score > 0;
    const highScoreText = this.add.text(
      this.cameras.main.width / 2,
      240,
      `High Score: ${this.highScore}`,
      {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: isNewRecord ? '#FFD700' : '#ffffff', // Gold if new record
        stroke: '#000000',
        strokeThickness: 3
      }
    );
    highScoreText.setOrigin(0.5);
    
    // Add "NEW RECORD!" text if applicable
    if (isNewRecord) {
      const newRecordText = this.add.text(
        this.cameras.main.width / 2,
        270,
        'NEW RECORD!',
        {
          fontFamily: 'Arial',
          fontSize: '16px',
          color: '#FFD700',
          stroke: '#000000',
          strokeThickness: 2
        }
      );
      newRecordText.setOrigin(0.5);
      
      // Add blinking effect
      this.tweens.add({
        targets: newRecordText,
        alpha: 0.3,
        duration: 500,
        yoyo: true,
        repeat: -1
      });
    }
    
    // Add restart button
    const restartButton = this.add.text(
      this.cameras.main.width / 2,
      320,
      'RESTART',
      {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
        backgroundColor: '#FF5722',
        padding: { x: 20, y: 10 }
      }
    ).setOrigin(0.5);
    restartButton.setInteractive();
    
    // Add hover effect
    restartButton.on('pointerover', () => {
      restartButton.setScale(1.1);
    });
    
    restartButton.on('pointerout', () => {
      restartButton.setScale(1);
    });
    
    // Restart game on click
    restartButton.on('pointerdown', () => {
      console.log('Restarting game...');
      this.scene.start('GameScene');
    });
    
    // Add menu button
    const menuButton = this.add.text(
      this.cameras.main.width / 2,
      380,
      'Main Menu',
      {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
        backgroundColor: '#2196F3',
        padding: { x: 15, y: 8 }
      }
    ).setOrigin(0.5);
    menuButton.setInteractive();
    
    // Add hover effect
    menuButton.on('pointerover', () => {
      menuButton.setScale(1.1);
    });
    
    menuButton.on('pointerout', () => {
      menuButton.setScale(1);
    });
    
    // Go to menu on click
    menuButton.on('pointerdown', () => {
      console.log('Going to menu...');
      this.scene.start('MenuScene');
    });
    
    // Add keyboard input
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
    
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('MenuScene');
    });
  }
}
