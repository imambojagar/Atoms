import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgControlComponent } from './org-control.component';

describe('OrgControlComponent', () => {
  let component: OrgControlComponent;
  let fixture: ComponentFixture<OrgControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrgControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
