// components/group-selector.component.ts - Component for selecting book group
import { Component, Input, Output, EventEmitter } from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import {BibleTrackerService} from '../bible-tracker-service';

@Component({
  selector: 'app-group-selector',
  imports: [
    NgClass,
    NgForOf
  ],
  template: `
    <div class="bg-white p-4 rounded shadow mb-6">
      <h3 class="text-lg font-semibold mb-2">Select Book Group</h3>
      <div class="flex flex-wrap gap-2">
        <button
          *ngFor="let group of availableGroups"
          (click)="selectGroup(group)"
          class="px-4 py-2 rounded-lg"
          [ngClass]="selectedGroup === group ?
            'bg-blue-600 text-white' :
            'bg-gray-200 hover:bg-gray-300 text-gray-800'"
        >
          <div class="text-center">
            <div class="font-semibold">{{ group }}</div>
            <div class="text-xs">{{ getGroupStats(group).percentComplete }}% Complete</div>
          </div>
        </button>
      </div>
      <div class="mt-4 text-right">
        <button
          (click)="onResetGroup()"
          class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Reset {{ selectedGroup }}
        </button>
      </div>
    </div>
  `
})
export class GroupSelectorComponent {
  @Input() availableGroups: string[] = [];
  @Input() selectedGroup: string = '';

  @Output() groupChange = new EventEmitter<string>();
  @Output() resetGroup = new EventEmitter<void>();

  constructor(private bibleTrackerService: BibleTrackerService) {}

  selectGroup(group: string): void {
    this.groupChange.emit(group);
  }

  onResetGroup(): void {
    if (confirm(`Are you sure you want to reset all progress for ${this.selectedGroup} books?`)) {
      this.resetGroup.emit();
    }
  }

  getGroupStats(group: string): { percentComplete: number, completedChapters: number, totalChapters: number } {
    return this.bibleTrackerService.calculateGroupStats(group);
  }
}
