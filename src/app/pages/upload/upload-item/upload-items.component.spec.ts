import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadItemsComponent } from './upload-items.component';

describe('UploadItemComponent', () => {
  let component: UploadItemsComponent;
  let fixture: ComponentFixture<UploadItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
