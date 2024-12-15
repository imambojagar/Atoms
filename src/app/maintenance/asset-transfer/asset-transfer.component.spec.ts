import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransferComponent } from './asset-transfer.component';

describe('AssetTransferComponent', () => {
  let component: AssetTransferComponent;
  let fixture: ComponentFixture<AssetTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetTransferComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssetTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
