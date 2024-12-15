import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssetInventoryComponent } from './view-asset-inventory.component';

describe('ViewAssetInventoryComponent', () => {
  let component: ViewAssetInventoryComponent;
  let fixture: ComponentFixture<ViewAssetInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAssetInventoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAssetInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
