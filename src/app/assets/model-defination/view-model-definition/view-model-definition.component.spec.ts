import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewModelDefinitionComponent } from './view-model-definition.component';

describe('ViewModelDefinitionComponent', () => {
  let component: ViewModelDefinitionComponent;
  let fixture: ComponentFixture<ViewModelDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewModelDefinitionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewModelDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
