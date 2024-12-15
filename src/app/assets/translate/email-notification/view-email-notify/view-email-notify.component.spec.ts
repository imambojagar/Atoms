import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmailNotifyComponent } from './view-email-notify.component';

describe('ViewEmailNotifyComponent', () => {
  let component: ViewEmailNotifyComponent;
  let fixture: ComponentFixture<ViewEmailNotifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEmailNotifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEmailNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
