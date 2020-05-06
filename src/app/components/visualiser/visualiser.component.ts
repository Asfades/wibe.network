import { Component, OnInit, ViewChild, ElementRef, NgZone, OnDestroy } from '@angular/core';

import { AudioService } from '@services/audio.service';

@Component({
  selector: 'app-visualiser',
  templateUrl: './visualiser.component.html',
  styleUrls: ['./visualiser.component.scss']
})
export class VisualiserComponent implements OnInit, OnDestroy {
  @ViewChild('visualisationCanvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  private animationId: number;
  private contextSizes: {
    width: number;
    height: number;
  };

  constructor(
    private audioService: AudioService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.contextSizes = {
      width: this.canvas.nativeElement.width,
      height: this.canvas.nativeElement.height
    };
    this.ctx.fillStyle = '#ffffff';
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.audioService.amplitudeArray$.subscribe((amplitudeArray: Uint8Array) => {
      this.ngZone.runOutsideAngular(() => {
        this.clearCanvas();
        this.animationId = requestAnimationFrame(this.drawRainbow(amplitudeArray));
      });
    });
  }

  drawRainbow(amplitudeArray: Uint8Array) {
    return () => {
      for (let i = 0; i < amplitudeArray.length - 4; i = i + 4) {
        this.ctx.strokeStyle = `hsl(${i / 4}, 50%, 50%)`;
        this.ctx.beginPath();
        this.ctx.moveTo(i, this.getVertical(amplitudeArray[i]));
        this.ctx.lineTo(i + 4, this.getVertical(amplitudeArray[i + 4]));
        this.ctx.stroke();
      }
      // this.ctx.closePath();
    };
  }

  drawAmplitude(amplitudeArray: Uint8Array) {
    return () => {
      this.ctx.beginPath();
      for (let i = 0; i < amplitudeArray.length; i = i + 4) {
        this.ctx.lineTo(i, this.getVertical(amplitudeArray[i]));
      }
      this.ctx.stroke();
      this.ctx.closePath();
    };
  }

  private getVertical(amplitude: number) {
    return this.contextSizes.height - amplitude - 1;
  }

  drawPixels(amplitudeArray: Uint8Array) {
    return () => {
      for (let i = 0; i < amplitudeArray.length; i++) {
        const y = this.getVertical(amplitudeArray[i]);
        this.ctx.fillRect(i, y, 1, 1);
      }
    };
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.contextSizes.width, this.contextSizes.height);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }

}
