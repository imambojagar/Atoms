import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDeliveryTimelineComponent } from './service-delivery-timeline.component';

describe('ServiceDeliveryTimelineComponent', () => {
  let component: ServiceDeliveryTimelineComponent;
  let fixture: ComponentFixture<ServiceDeliveryTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceDeliveryTimelineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceDeliveryTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
