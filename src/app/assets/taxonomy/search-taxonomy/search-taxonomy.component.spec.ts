import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTaxonomyComponent } from './search-taxonomy.component';

describe('SearchTaxonomyComponent', () => {
  let component: SearchTaxonomyComponent;
  let fixture: ComponentFixture<SearchTaxonomyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchTaxonomyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchTaxonomyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
