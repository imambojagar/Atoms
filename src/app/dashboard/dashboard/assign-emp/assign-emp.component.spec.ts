import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignEmpComponent } from './assign-emp.component';

describe('AssignEmpComponent', () => {
  let component: AssignEmpComponent;
  let fixture: ComponentFixture<AssignEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignEmpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
