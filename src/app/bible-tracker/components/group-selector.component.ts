// components/group-selector.component.ts - Enhanced version
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BibleTrackerService } from '../bible-tracker-service';
import { ConfirmationModalComponent } from "./confirmation-modal";

@Component({
  selector: 'app-group-selector',
  standalone: true,
  imports: [CommonModule, ConfirmationModalComponent],
  template: `
    <div class="bg-white p-4 rounded shadow mb-6">
      <h3 class="text-lg font-semibold mb-3">Select Book Group</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <button
            *ngFor="let group of availableGroups"
            (click)="selectGroup(group)"
            class="group-card"
            [class.active]="selectedGroup === group"
        >
          <div class="card-content">
            <h4 class="group-name">{{ group }}</h4>

            <div class="progress-container">
              <div
                  class="progress-bar"
                  [style.width.%]="getGroupStats(group).percentComplete"
              ></div>
            </div>

            <div class="stats">
              <div class="completion-badge">
                {{ getGroupStats(group).percentComplete }}%
              </div>
              <div class="chapters-text">
                {{ getGroupStats(group).completedChapters }}/{{ getGroupStats(group).totalChapters }}
              </div>
            </div>
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
  `,
  styles: [`
    .group-card {
      background-color: white;
      text-align: left;
      border-radius: 8px;
      padding: 12px;
      border: 1px solid #e5e7eb;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
      width: 100%;
    }

    .group-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      border-color: #dbeafe;
      background-color: #f9fafb;
    }

    .group-card.active {
      border-color: #3b82f6;
      background-color: #eff6ff;
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
    }

    .group-card.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 3px;
      background-color: #3b82f6;
    }

    .card-content {
      position: relative;
      z-index: 2;
    }

    .group-name {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #1f2937;
    }

    .active .group-name {
      color: #1e40af;
    }

    .progress-container {
      height: 4px;
      background-color: #f3f4f6;
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #60a5fa);
      border-radius: 2px;
      transition: width 0.3s ease;
    }

    .stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .completion-badge {
      background-color: #dbeafe;
      color: #1e40af;
      font-size: 11px;
      font-weight: 500;
      padding: 2px 6px;
      border-radius: 9999px;
    }

    .chapters-text {
      font-size: 11px;
      color: #6b7280;
    }

    /* Add subtle pattern to active cards */
    .group-card.active::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-image: radial-gradient(#3b82f6 1px, transparent 1px);
      background-size: 16px 16px;
      opacity: 0.03;
      z-index: 1;
    }

    @media (max-width: 640px) {
      .group-name {
        font-size: 14px;
      }

      .completion-badge, .chapters-text {
        font-size: 10px;
      }
    }
  `]
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
