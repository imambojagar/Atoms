import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMunafacturerModelComponent } from './search-munafacturer-model.component';

describe('SearchMunafacturerModelComponent', () => {
  let component: SearchMunafacturerModelComponent;
  let fixture: ComponentFixture<SearchMunafacturerModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchMunafacturerModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchMunafacturerModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
