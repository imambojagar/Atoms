import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMainteneceCcontractComponent } from './search-maintenece-ccontract.component';

describe('SearchMainteneceCcontractComponent', () => {
  let component: SearchMainteneceCcontractComponent;
  let fixture: ComponentFixture<SearchMainteneceCcontractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchMainteneceCcontractComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchMainteneceCcontractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
