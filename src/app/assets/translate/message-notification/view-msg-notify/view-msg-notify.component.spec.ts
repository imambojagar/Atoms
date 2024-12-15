import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMsgNotifyComponent } from './view-msg-notify.component';

describe('ViewMsgNotifyComponent', () => {
  let component: ViewMsgNotifyComponent;
  let fixture: ComponentFixture<ViewMsgNotifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMsgNotifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMsgNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
