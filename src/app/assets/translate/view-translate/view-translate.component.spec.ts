import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTranslateComponent } from './view-translate.component';

describe('ViewTranslateComponent', () => {
  let component: ViewTranslateComponent;
  let fixture: ComponentFixture<ViewTranslateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTranslateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTranslateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
