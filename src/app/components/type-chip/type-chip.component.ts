import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-type-chip',
  standalone: true,
  imports: [
    CommonModule,
    MatChipsModule
  ],
  templateUrl: './type-chip.component.html',
  styleUrl: './type-chip.component.css'
})
export class TypeChipComponent {
  @Input() type: any;
}
