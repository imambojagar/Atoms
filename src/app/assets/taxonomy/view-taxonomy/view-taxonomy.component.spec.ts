import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTaxonomyComponent } from './view-taxonomy.component';

describe('ViewTaxonomyComponent', () => {
  let component: ViewTaxonomyComponent;
  let fixture: ComponentFixture<ViewTaxonomyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTaxonomyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTaxonomyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
