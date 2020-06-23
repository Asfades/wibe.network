import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';
import { NotFoundService } from './not-found.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  public name = '';

  constructor(
    private notFoundService: NotFoundService
  ) {
    this.name = this.notFoundService.username;
  }

  ngOnInit(): void {
  }

}
