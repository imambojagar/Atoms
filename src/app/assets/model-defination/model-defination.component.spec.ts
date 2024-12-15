import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelDefinationComponent } from './model-defination.component';

describe('ModelDefinationComponent', () => {
  let component: ModelDefinationComponent;
  let fixture: ComponentFixture<ModelDefinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelDefinationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModelDefinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
