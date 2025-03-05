// components/testament-selector.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BibleTrackerService } from '../bible-tracker-service';
import {ConfirmationModalComponent} from "./confirmation-modal";

@Component({
  selector: 'app-testament-selector',
  standalone: true,
  imports: [CommonModule, ConfirmationModalComponent, ConfirmationModalComponent],
  template: `
    <div class="bg-white p-4 rounded shadow mb-6">
      <h3 class="text-lg font-semibold mb-2">Select Testament</h3>
      <div class="flex flex-wrap gap-2">
        <button
            *ngFor="let testament of testaments"
            (click)="selectTestament(testament)"
            class="px-4 py-2 rounded-lg"
            [ngClass]="selectedTestament === testament ?
            'bg-blue-600 text-white' :
            'bg-gray-200 hover:bg-gray-300 text-gray-800'"
        >
          <div class="text-center">
            <div class="font-semibold">{{ testament }}</div>
            <div class="text-xs">{{ getTestamentStats(testament).percentComplete }}% Complete</div>
          </div>
        </button>
      </div>
      <div class="mt-4 text-right">
        <button
            (click)="showConfirmModal()"
            class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Reset {{ selectedTestament }}
        </button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <app-confirmation-modal
        [isVisible]="isConfirmModalVisible"
        [title]="'Reset Testament'"
        [message]="'Are you sure you want to reset all progress for ' + selectedTestament + '? This action cannot be undone.'"
        [confirmText]="'Reset'"
        (confirm)="confirmReset()"
        (cancel)="cancelReset()"
    ></app-confirmation-modal>
  `
})
export class TestamentSelectorComponent {
  @Input() testaments: string[] = [];
  @Input() selectedTestament: string = '';

  @Output() testamentChange = new EventEmitter<string>();
  @Output() resetTestament = new EventEmitter<void>();

  isConfirmModalVisible: boolean = false;

  constructor(private bibleTrackerService: BibleTrackerService) {}

  selectTestament(testament: string): void {
    this.testamentChange.emit(testament);
  }

  showConfirmModal(): void {
    this.isConfirmModalVisible = true;
  }

  confirmReset(): void {
    this.resetTestament.emit();
    this.isConfirmModalVisible = false;
  }

  cancelReset(): void {
    this.isConfirmModalVisible = false;
  }

  getTestamentStats(testament: string): { percentComplete: number } {
    return this.bibleTrackerService.calculateTestamentStats(testament);
  }
}
