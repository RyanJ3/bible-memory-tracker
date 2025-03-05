// components/group-selector.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BibleTrackerService } from '../bible-tracker-service';
import {ConfirmationModalComponent} from "./confirmation-modal";

@Component({
  selector: 'app-group-selector',
  standalone: true,
  imports: [CommonModule, ConfirmationModalComponent],
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
          (click)="showConfirmModal()"
          class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Reset {{ selectedGroup }}
        </button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <app-confirmation-modal
      [isVisible]="isConfirmModalVisible"
      [title]="'Reset Book Group'"
      [message]="'Are you sure you want to reset all progress for ' + selectedGroup + ' books? This action cannot be undone.'"
      [confirmText]="'Reset'"
      (confirm)="confirmReset()"
      (cancel)="cancelReset()"
    ></app-confirmation-modal>
  `
})
export class GroupSelectorComponent {
  @Input() availableGroups: string[] = [];
  @Input() selectedGroup: string = '';

  @Output() groupChange = new EventEmitter<string>();
  @Output() resetGroup = new EventEmitter<void>();

  isConfirmModalVisible: boolean = false;

  constructor(private bibleTrackerService: BibleTrackerService) {}

  selectGroup(group: string): void {
    this.groupChange.emit(group);
  }

  showConfirmModal(): void {
    this.isConfirmModalVisible = true;
  }

  confirmReset(): void {
    this.resetGroup.emit();
    this.isConfirmModalVisible = false;
  }

  cancelReset(): void {
    this.isConfirmModalVisible = false;
  }

  getGroupStats(group: string): { percentComplete: number, completedChapters: number, totalChapters: number } {
    return this.bibleTrackerService.calculateGroupStats(group);
  }
}
