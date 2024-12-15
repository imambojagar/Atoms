import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectsControlComponent } from './defects-control.component';

describe('DefectsControlComponent', () => {
  let component: DefectsControlComponent;
  let fixture: ComponentFixture<DefectsControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefectsControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DefectsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
