import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePositionRateComponent } from './employee-position-rate.component';

describe('EmployeePositionRateComponent', () => {
  let component: EmployeePositionRateComponent;
  let fixture: ComponentFixture<EmployeePositionRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeePositionRateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeePositionRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
