import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEmployeeRateComponent } from './add-edit-employee-rate.component';

describe('AddEditEmployeeRateComponent', () => {
  let component: AddEditEmployeeRateComponent;
  let fixture: ComponentFixture<AddEditEmployeeRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditEmployeeRateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditEmployeeRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
