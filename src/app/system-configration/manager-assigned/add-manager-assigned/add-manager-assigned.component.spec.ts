import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManagerAssignedComponent } from './add-manager-assigned.component';

describe('AddManagerAssignedComponent', () => {
  let component: AddManagerAssignedComponent;
  let fixture: ComponentFixture<AddManagerAssignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddManagerAssignedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddManagerAssignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
