import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewModelCreationComponent } from './view-model-creation.component';

describe('ViewModelCreationComponent', () => {
  let component: ViewModelCreationComponent;
  let fixture: ComponentFixture<ViewModelCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewModelCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewModelCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
