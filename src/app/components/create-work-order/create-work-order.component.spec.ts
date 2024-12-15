import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkOrderComponent } from './create-work-order.component';

describe('CreateWorkOrderComponent', () => {
  let component: CreateWorkOrderComponent;
  let fixture: ComponentFixture<CreateWorkOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateWorkOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
