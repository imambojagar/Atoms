import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainteneceCcontractManagementComponent } from './maintenece-ccontract-management.component';

describe('MainteneceCcontractManagementComponent', () => {
  let component: MainteneceCcontractManagementComponent;
  let fixture: ComponentFixture<MainteneceCcontractManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainteneceCcontractManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainteneceCcontractManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
