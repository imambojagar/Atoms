import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetDashboardReportComponent } from './budget-dashboard-report.component';

describe('BudgetDashboardReportComponent', () => {
  let component: BudgetDashboardReportComponent;
  let fixture: ComponentFixture<BudgetDashboardReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetDashboardReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetDashboardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
