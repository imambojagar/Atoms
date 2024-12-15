import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDeliveryManagementComponent } from './service-delivery-management.component';

describe('ServiceDeliveryManagementComponent', () => {
  let component: ServiceDeliveryManagementComponent;
  let fixture: ComponentFixture<ServiceDeliveryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceDeliveryManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceDeliveryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
