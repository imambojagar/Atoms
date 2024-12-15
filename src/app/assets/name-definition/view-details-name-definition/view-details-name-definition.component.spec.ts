import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailsNameDefinitionComponent } from './view-details-name-definition';

describe('ViewDetailsNameDefinitionComponent', () => {
  let component: ViewDetailsNameDefinitionComponent;
  let fixture: ComponentFixture<ViewDetailsNameDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDetailsNameDefinitionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDetailsNameDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
