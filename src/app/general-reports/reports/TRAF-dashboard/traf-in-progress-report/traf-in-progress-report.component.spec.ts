import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TRAFInProgressReportComponent } from './traf-in-progress-report.component';

describe('TRAFInProgressReportComponent', () => {
  let component: TRAFInProgressReportComponent;
  let fixture: ComponentFixture<TRAFInProgressReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TRAFInProgressReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TRAFInProgressReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
