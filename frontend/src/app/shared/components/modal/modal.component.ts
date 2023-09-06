import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [CommonModule],
})
export class ModalComponent implements OnInit {
  @Input()
  open: BehaviorSubject<boolean>;
  @Input()
  width: number;
  @Input()
  height: number;
  isOpen: boolean;

  ngOnInit() {
    this.open.subscribe((value) => {
      this.isOpen = value;
    });
  }

  onClose() {
    // if (this.open) this.open = !this.open;
    this.open.next(false);
  }
}
