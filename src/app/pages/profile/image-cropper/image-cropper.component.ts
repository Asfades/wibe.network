import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  HostListener,
} from '@angular/core';
import { Observable, Subject, combineLatest, of } from 'rxjs';
import {
  map,
  concatMap,
  shareReplay,
  pairwise,
  withLatestFrom,
  tap,
  startWith
} from 'rxjs/operators';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit {
  @Input() imageFile: File;
  @Input() width: number;
  @Input() height: number;
  @Input() zoom$: Observable<number>;
  @Input() round: boolean;

  @Output() blobImage = new EventEmitter<string>();

  private canvas = document.createElement('canvas');
  private ctx = this.canvas.getContext('2d');
  private img = new Image();

  private picturePressed = false;
  private lastPosition = new Coordinates(0, 0);

  private backgroundPosition$: Observable<Coordinates>;
  private cursorPosition$ = new Subject<Coordinates>();
  private emitImage$: Observable<any>;
  private backgroundBase64Source$: Observable<string>;
  private backgroundSizeString$: Observable<string>;
  private backgroundPositionString$: Observable<string>;
  backgroundParameters$: Observable<{
    source: string,
    size: string,
    position: string
  }>;

  constructor() { }

  @HostListener('window:mousemove', ['$event'])
  mouseMoveHandler(event: MouseEvent) {
    if (this.picturePressed) {
      const coordinates = new Coordinates(event.clientX, event.clientY);
      this.cursorPosition$.next(coordinates);
    }
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    this.picturePressed = false;
    this.cursorPosition$.next(null);
  }

  onMouseDown(event: MouseEvent) {
    event.stopPropagation();
    this.picturePressed = true;
    this.cursorPosition$.next(new Coordinates(event.clientX, event.clientY));
  }

  ngOnInit(): void {
    const base64Image$ = new Observable<string | ArrayBuffer>((observer) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
        observer.next(base64Image);
      };
      reader.readAsDataURL(this.imageFile);
    }).pipe(shareReplay(1));

    const imageResolution$ = base64Image$.pipe(
      concatMap((base64Image: string) => new Observable<Resolution>((observer) => {
        this.img.onload = () => {
          observer.next(new Resolution(this.img.width, this.img.height));
        };

        this.img.src = base64Image;
      })),
      startWith(new Resolution(0, 0)),
      shareReplay(1)
    );

    const proportions$ = combineLatest([
      imageResolution$,
      this.zoom$ || of(0)
    ]).pipe(
      map(([resolution, zoom]) => {
        const minResolutionSide = Math.min(resolution.width, resolution.height);
        const minPicSize = Math.min(this.width, this.height);
        const initial = minResolutionSide / minPicSize;
        const zoomed = initial - (initial - 1) * zoom; // the min value is 1

        this.canvas.width = minPicSize * zoomed;
        this.canvas.height = minPicSize * zoomed;

        return {
          initial,
          zoomed
        };
      })
    );

    const imageSize$ = combineLatest([
      imageResolution$,
      proportions$
    ]).pipe(
      map(([resolution, proportions]) => {
        const width = Math.round(resolution.width / proportions.zoomed);
        const height = Math.round(resolution.height / proportions.zoomed);

        return new Resolution(width, height);
      }),
      shareReplay(1)
    );

    this.backgroundSizeString$ = imageSize$.pipe(
      map((resolution: Resolution) => `${resolution.width}px ${resolution.height}px`)
    );

    this.backgroundBase64Source$ = base64Image$.pipe(
      map((base64image: ArrayBuffer | string) => `url("${base64image}")`)
    );

    this.backgroundPosition$ = this.cursorPosition$.pipe(
      pairwise(),
      map(([previousCoordinates, currentCoordinates]) => {
        if (!previousCoordinates || !currentCoordinates) {
          return this.lastPosition;
        }

        const deltaPosition = new Coordinates(
          currentCoordinates.x - previousCoordinates.x,
          currentCoordinates.y - previousCoordinates.y
        );

        const positionX = this.lastPosition.x + deltaPosition.x;
        const positionY = this.lastPosition.y + deltaPosition.y;

        const newCoordinates = new Coordinates(positionX, positionY);

        return newCoordinates;
      }),
      withLatestFrom(imageSize$),
      map(([coordinates, size]) => {
        return this.validateBackgroundPosition(coordinates, size);
      }),
      startWith(new Coordinates(0, 0)),
      shareReplay(1)
    );

    this.backgroundPositionString$ = this.backgroundPosition$.pipe(
      map((coordinates: Coordinates) => `${coordinates.x}px ${coordinates.y}px`)
    );

    this.emitImage$ = this.backgroundPosition$.pipe(
      withLatestFrom(proportions$),
      tap(([coordinates, proportions]) => {
        const width = this.width * proportions.zoomed;
        const height = this.height * proportions.zoomed;
        this.ctx.drawImage(
          this.img,
          -coordinates.x * proportions.zoomed,
          -coordinates.y * proportions.zoomed,
          width,
          height,
          0,
          0,
          width,
          height
        );
        this.blobImage.emit(this.canvas.toDataURL());
      })
    );

    this.backgroundParameters$ = combineLatest([
      this.backgroundBase64Source$,
      this.backgroundSizeString$,
      this.backgroundPositionString$
    ]).pipe(
      map(([source, size, position]) => ({source, size, position}))
    );
  }

  emitImage() {
    const sub = this.emitImage$.subscribe();
    sub.unsubscribe();
  }

  private validateBackgroundPosition(position: Coordinates, size: Resolution): Coordinates {
    let validatedX = Math.floor(position.x);
    let validatedY = Math.floor(position.y);

    const toRightMaxPosition = -(size.width - this.width);
    if (position.x < toRightMaxPosition) {
      validatedX = toRightMaxPosition;
    } else if (position.x > 0) {
      validatedX = 0;
    }

    const toBottomMaxPosition = -(size.height - this.height);
    if (position.y < toBottomMaxPosition) {
      validatedY = toBottomMaxPosition;
    } else if (position.y > 0) {
      validatedY = 0;
    }

    const newCoordinates = new Coordinates(validatedX, validatedY);
    this.lastPosition = newCoordinates;

    return newCoordinates;
  }

}

export class Coordinates {
  constructor(
    public x: number,
    public y: number
  ) {}
}

export class Resolution {
  constructor(
    public width: number,
    public height: number
  ) {}
}
