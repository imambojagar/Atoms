import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeeRateComponent } from './view-employee-rate.component';

describe('ViewEmployeeRateComponent', () => {
  let component: ViewEmployeeRateComponent;
  let fixture: ComponentFixture<ViewEmployeeRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEmployeeRateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEmployeeRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
