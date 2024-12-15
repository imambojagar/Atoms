import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurrentTaskComponent } from './recurrent-task.component';

describe('RecurrentTaskComponent', () => {
  let component: RecurrentTaskComponent;
  let fixture: ComponentFixture<RecurrentTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurrentTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecurrentTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
