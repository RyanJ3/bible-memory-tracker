// components/testament-selector.component.ts - Enhanced version
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BibleTrackerService } from '../bible-tracker-service';
import { ConfirmationModalComponent } from "./confirmation-modal";

@Component({
  selector: 'app-testament-selector',
  standalone: true,
  imports: [CommonModule, ConfirmationModalComponent],
  template: `
    <div class="bg-white p-4 rounded shadow mb-6">
      <h3 class="text-lg font-semibold mb-2">Select Testament</h3>
      <div class="flex flex-wrap gap-3">
        <button
            *ngFor="let testament of testaments"
            (click)="selectTestament(testament)"
            class="testament-card"
            [class.old-testament]="testament === 'Old Testament'"
            [class.new-testament]="testament === 'New Testament'"
            [class.active]="selectedTestament === testament"
        >
          <div class="card-content">
            <div class="font-semibold text-base">{{ testament }}</div>
            <div class="mt-2 h-1.5 bg-gray-200 rounded-full">
              <div
                  class="h-1.5 rounded-full transition-width"
                  [ngClass]="{
                  'bg-amber-500': testament === 'Old Testament',
                  'bg-indigo-500': testament === 'New Testament'
                }"
                  [style.width.%]="getTestamentStats(testament).percentComplete"
              ></div>
            </div>
            <div class="text-xs mt-1.5 flex justify-between">
              <span class="completion-badge"
                    [ngClass]="{
                  'bg-amber-100 text-amber-800': testament === 'Old Testament',
                  'bg-indigo-100 text-indigo-800': testament === 'New Testament'
                }">
                {{ getTestamentStats(testament).percentComplete }}% Complete
              </span>
            </div>
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
  `,
  styles: [`
    .testament-card {
      flex: 1;
      min-width: 220px;
      padding: 12px 16px;
      border-radius: 8px;
      transition: all 0.2s ease;
      border: 1px solid #e5e7eb;
      position: relative;
      overflow: hidden;
    }

    .testament-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .testament-card.active {
      transform: translateY(-2px);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
    }

    .old-testament.active {
      border-color: #f59e0b;
      background-color: #fffbeb;
    }

    .new-testament.active {
      border-color: #6366f1;
      background-color: #eef2ff;
    }

    .card-content {
      position: relative;
      z-index: 2;
    }

    .old-testament .font-semibold {
      color: #b45309;
    }

    .new-testament .font-semibold {
      color: #4f46e5;
    }

    .transition-width {
      transition: width 0.3s ease-in-out;
    }

    .completion-badge {
      padding: 2px 8px;
      border-radius: 9999px;
      white-space: nowrap;
    }

    /* Add decorative background element that appears when card is active */
    .testament-card.active::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 30%;
      height: 100%;
      clip-path: polygon(100% 0, 0 0, 100% 100%);
      opacity: 0.08;
      z-index: 1;
    }

    .old-testament.active::before {
      background: linear-gradient(135deg, #f59e0b, #fbbf24);
    }

    .new-testament.active::before {
      background: linear-gradient(135deg, #6366f1, #818cf8);
    }

    @media (max-width: 640px) {
      .testament-card {
        min-width: 140px;
        padding: 10px 12px;
      }
    }
  `]
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
