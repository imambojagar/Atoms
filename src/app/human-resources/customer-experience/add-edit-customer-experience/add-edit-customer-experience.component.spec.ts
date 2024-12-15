import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCustomerExperienceComponent } from './add-edit-customer-experience.component';

describe('AddEditCustomerExperienceComponent', () => {
  let component: AddEditCustomerExperienceComponent;
  let fixture: ComponentFixture<AddEditCustomerExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditCustomerExperienceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCustomerExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
