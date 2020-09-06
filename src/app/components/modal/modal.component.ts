import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() title: string;
  @Input() width: number;
  @Output() hide = new EventEmitter<void>();

  mouseDownOnOverlay = false;

  constructor() { }

  ngOnInit(): void {
  }

  onMouseDown() {
    this.mouseDownOnOverlay = true;
  }

  hideModal() {
    if (this.mouseDownOnOverlay) {
      this.hide.emit();
      this.mouseDownOnOverlay = false;
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
    this.mouseDownOnOverlay = false;
  }

}
