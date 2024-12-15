import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEmailNotifyComponent } from './add-edit-email-notify.component';

describe('AddEditEmailNotifyComponent', () => {
  let component: AddEditEmailNotifyComponent;
  let fixture: ComponentFixture<AddEditEmailNotifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditEmailNotifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditEmailNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
