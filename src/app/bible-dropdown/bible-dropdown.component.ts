import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Component} from '@angular/core';

@Component({
  selector: 'app-bible-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <select [(ngModel)]="selectedBook">
      <option *ngFor="let book of bibleBooks" [value]="book.name">
        {{book.name}}
      </option>
    </select>
    <p>Selected: {{selectedBook}}</p>
  `
})
export class BibleDropdownComponent {
  selectedBook: string = 'Genesis';

  bibleBooks: Array<{name: string, testament: string, group: string}> = [
    { name: "Genesis", testament: "Old Testament", group: "Torah" },
    { name: "Exodus", testament: "Old Testament", group: "Torah" },
    { name: "Leviticus", testament: "Old Testament", group: "Torah" },
    { name: "Matthew", testament: "New Testament", group: "Gospels" },
    { name: "Mark", testament: "New Testament", group: "Gospels" },
    { name: "Luke", testament: "New Testament", group: "Gospels" },
    { name: "John", testament: "New Testament", group: "Gospels" }
  ];
}
