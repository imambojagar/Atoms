import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecurrentTaskComponent } from './add-recurrent-task.component';

describe('AddRecurrentTaskComponent', () => {
  let component: AddRecurrentTaskComponent;
  let fixture: ComponentFixture<AddRecurrentTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRecurrentTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddRecurrentTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
