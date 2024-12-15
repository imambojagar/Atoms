import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchServiceDeliveryComponent } from './search-service-delivery.component';

describe('SearchServiceDeliveryComponent', () => {
  let component: SearchServiceDeliveryComponent;
  let fixture: ComponentFixture<SearchServiceDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchServiceDeliveryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchServiceDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
