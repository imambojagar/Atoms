import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelCreationComponent } from './model-creation.component';

describe('ModelCreationComponent', () => {
  let component: ModelCreationComponent;
  let fixture: ComponentFixture<ModelCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModelCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
