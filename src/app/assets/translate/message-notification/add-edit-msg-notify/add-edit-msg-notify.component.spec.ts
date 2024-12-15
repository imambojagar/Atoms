import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMsgNotifyComponent } from './add-edit-msg-notify.component';

describe('AddEditMsgNotifyComponent', () => {
  let component: AddEditMsgNotifyComponent;
  let fixture: ComponentFixture<AddEditMsgNotifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditMsgNotifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditMsgNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
