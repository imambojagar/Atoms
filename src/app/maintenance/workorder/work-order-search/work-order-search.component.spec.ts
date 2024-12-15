import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderSearchComponent } from './work-order-search.component';

describe('WorkOrderSearchComponent', () => {
  let component: WorkOrderSearchComponent;
  let fixture: ComponentFixture<WorkOrderSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
