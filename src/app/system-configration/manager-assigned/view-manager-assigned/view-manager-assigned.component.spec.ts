import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewManagerAssignedComponent } from './view-manager-assigned.component';

describe('ViewManagerAssignedComponent', () => {
  let component: ViewManagerAssignedComponent;
  let fixture: ComponentFixture<ViewManagerAssignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewManagerAssignedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewManagerAssignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
