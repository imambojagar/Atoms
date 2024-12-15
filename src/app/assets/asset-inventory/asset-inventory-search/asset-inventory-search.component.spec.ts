import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetInventorySearchComponent } from './asset-inventory-search.component';

describe('AssetInventorySearchComponent', () => {
  let component: AssetInventorySearchComponent;
  let fixture: ComponentFixture<AssetInventorySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetInventorySearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssetInventorySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
