// components/verse-selector.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-verse-selector',
  standalone: true,
  imports: [
    NgClass,
    NgFor
  ],
  styleUrls: ['../shared-bubble-styles.scss'],
  template: `
    <div class="mt-4">
      <h4 class="text-md font-medium mb-2">Verses</h4>

      <!-- Progress Bar -->
      <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div
          class="h-2 rounded-full"
          [ngClass]="{
            'bg-green-600': progressPercent === 100,
            'bg-blue-500': progressPercent > 0 && progressPercent < 100,
            'bg-gray-200': progressPercent === 0
          }"
          [style.width.%]="progressPercent"
        ></div>
      </div>

      <!-- Verse bubbles -->
      <div class="verse-container">
        <button
          *ngFor="let i of versesArray; trackBy: trackByFn"
          (click)="toggleVerse(i)"
          class="verse-bubble"
          [ngClass]="{
            'not-selected': !isVerseSelected(i),
            'selected': isVerseSelected(i)
          }"
        >
          {{ i }}
        </button>
      </div>

      <div class="flex justify-between mt-4">
        <button
          (click)="selectAll()"
          class="verse-action-button primary"
        >
          Select All
        </button>

        <button
          (click)="clearAll()"
          class="verse-action-button secondary"
        >
          Clear All
        </button>
      </div>
    </div>
  `
})
export class VerseSelectorComponent {
  @Input() totalVerses: number = 0;
  @Input() versesMemorized: boolean[] = [];

  @Output() versesChange = new EventEmitter<boolean[]>();

  ngOnChanges(): void {
    // Make sure versesMemorized is always the right length
    if (!this.versesMemorized || this.versesMemorized.length !== this.totalVerses) {
      this.versesMemorized = Array(this.totalVerses).fill(false);
    }
  }

  get versesArray(): number[] {
    return Array.from({ length: this.totalVerses }, (_, i) => i + 1);
  }

  get progressPercent(): number {
    if (!this.totalVerses) return 0;
    const memorizedCount = this.versesMemorized.filter(v => v).length;
    return Math.round((memorizedCount / this.totalVerses) * 100);
  }

  isVerseSelected(verseNumber: number): boolean {
    return this.versesMemorized[verseNumber - 1];
  }

  toggleVerse(verseNumber: number): void {
    if (verseNumber < 1 || verseNumber > this.totalVerses) return;

    // Create a new array to ensure change detection
    const updatedVerses = [...this.versesMemorized];
    updatedVerses[verseNumber - 1] = !updatedVerses[verseNumber - 1];

    this.versesMemorized = updatedVerses;
    this.versesChange.emit(updatedVerses);
  }

  selectAll(): void {
    this.versesMemorized = Array(this.totalVerses).fill(true);
    this.versesChange.emit(this.versesMemorized);
  }

  clearAll(): void {
    this.versesMemorized = Array(this.totalVerses).fill(false);
    this.versesChange.emit(this.versesMemorized);
  }

  trackByFn(index: number): number {
    return index;
  }
}
