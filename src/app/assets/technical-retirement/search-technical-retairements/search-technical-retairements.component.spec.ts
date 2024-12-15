import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTechnicalRetairementsComponent } from './search-technical-retairements.component';

describe('SearchTechnicalRetairementsComponent', () => {
  let component: SearchTechnicalRetairementsComponent;
  let fixture: ComponentFixture<SearchTechnicalRetairementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchTechnicalRetairementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchTechnicalRetairementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
