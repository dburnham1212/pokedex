import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TypeChipComponent } from '../../../../components/type-chip/type-chip.component';

@Component({
  selector: 'app-damage-relation-display',
  standalone: true,
  imports: [
    CommonModule,
    TypeChipComponent
  ],
  templateUrl: './damage-relation-display.component.html',
  styleUrl: './damage-relation-display.component.css'
})
export class DamageRelationDisplayComponent {
  @Input() title!: string;
  @Input() relationArray!: any;
  @Input() underlined = false;
}
