import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchNameDefinitionComponent } from './search-name-definition.component';

describe('SearchNameDefinitionComponent', () => {
  let component: SearchNameDefinitionComponent;
  let fixture: ComponentFixture<SearchNameDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchNameDefinitionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchNameDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
