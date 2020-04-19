import { Component, OnInit, Input } from '@angular/core';

import { Track } from '@entities/track.model';

@Component({
  selector: 'app-playlist-item',
  templateUrl: './playlist-item.component.html',
  styleUrls: ['./playlist-item.component.scss']
})
export class PlaylistItemComponent implements OnInit {
  @Input() track: Track;
  @Input() id: number;
  @Input() active: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
