import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeChipComponent } from './type-chip.component';

describe('TypeChipComponent', () => {
  let component: TypeChipComponent;
  let fixture: ComponentFixture<TypeChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeChipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
