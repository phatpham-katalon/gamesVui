import * as Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
    
    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff'
    });
    loadingText.setOrigin(0.5, 0.5);
    
    const percentText = this.add.text(width / 2, height / 2, '0%', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff'
    });
    percentText.setOrigin(0.5, 0.5);
    
    // Loading events
    this.load.on('progress', (value: number) => {
      percentText.setText(parseInt(String(value * 100)) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });
    
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });
    
    // Add error handling
    this.load.on('loaderror', (file: any) => {
      console.error('Failed to load:', file.key, file.url);
    });
    
    this.load.on('filecomplete', (key: string) => {
      console.log('Loaded:', key);
    });
    
    // Set base URL for assets
    this.load.baseURL = './';
    
    // Load assets
    this.load.image('background', 'src/assets/images/background.png');
    this.load.image('ground', 'src/assets/images/ground.png');
    this.load.image('pipe', 'src/assets/images/pipe.png');
    this.load.image('game-over', 'src/assets/images/gameover.png');
    this.load.image('message', 'src/assets/images/message.png');
    
    // Use existing bird sprites
    this.load.image('bird-up', 'src/assets/images/yellowbird-upflap.png');
    this.load.image('bird-mid', 'src/assets/images/yellowbird-midflap.png');
    this.load.image('bird-down', 'src/assets/images/yellowbird-downflap.png');
    
    // Load audio
    this.load.audio('flap', 'src/assets/audio/flap.wav');
    this.load.audio('score', 'src/assets/audio/score.wav');
    this.load.audio('hit', 'src/assets/audio/hit.wav');
  }

  create(): void {
    this.scene.start('MenuScene');
  }
}
