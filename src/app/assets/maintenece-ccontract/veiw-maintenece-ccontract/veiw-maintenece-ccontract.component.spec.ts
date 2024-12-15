import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeiwMainteneceCcontractComponent } from './veiw-maintenece-ccontract.component';

describe('VeiwMainteneceCcontractComponent', () => {
  let component: VeiwMainteneceCcontractComponent;
  let fixture: ComponentFixture<VeiwMainteneceCcontractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeiwMainteneceCcontractComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VeiwMainteneceCcontractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
