import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunfactrerModelMangementComponent } from './munfactrer-model-mangement.component';

describe('MunfactrerModelMangementComponent', () => {
  let component: MunfactrerModelMangementComponent;
  let fixture: ComponentFixture<MunfactrerModelMangementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MunfactrerModelMangementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MunfactrerModelMangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
