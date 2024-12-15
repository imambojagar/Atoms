import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAssetInformationComponent } from './update-asset-information.component';

describe('UpdateAssetInformationComponent', () => {
  let component: UpdateAssetInformationComponent;
  let fixture: ComponentFixture<UpdateAssetInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAssetInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateAssetInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
