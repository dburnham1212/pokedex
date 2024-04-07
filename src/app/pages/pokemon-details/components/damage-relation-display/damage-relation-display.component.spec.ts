import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageRelationDisplayComponent } from './damage-relation-display.component';

describe('DamageRelationDisplayComponent', () => {
  let component: DamageRelationDisplayComponent;
  let fixture: ComponentFixture<DamageRelationDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DamageRelationDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DamageRelationDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
