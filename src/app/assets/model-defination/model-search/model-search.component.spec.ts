import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelSearchComponent } from './model-search.component';

describe('ModelSearchComponent', () => {
  let component: ModelSearchComponent;
  let fixture: ComponentFixture<ModelSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModelSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
