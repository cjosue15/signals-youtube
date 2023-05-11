import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-button',
  template: `
    <button class="minus" (click)="minus()">-</button>
    <div>{{ quantity() }}</div>
    <button class="add" (click)="add()">+</button>
  `,
  host: {
    class: 'app-button',
  },
  styles: [
    `
      :host {
        display: flex;
      }

      button {
        background: #f4a261;
        color: #000;
        border: none;
        width: 30px;
        height: 30px;
        font-size: 20px;
        cursor: pointer;
      }

      button.minus {
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
      }

      button.add {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
      }

      div {
        background: #f4a261;
        color: #000;
        font-size: 16px;
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
      }
    `,
  ],
})
export class ButtonComponent {
  @Input({ required: true }) public set value(value: number) {
    this.quantity.set(value);
  }

  @Output() onChangeQuantity = new EventEmitter<number>();

  quantity = signal(0);

  add(): void {
    this.quantity.update((value) => value + 1);
    this.onChangeQuantity.emit(this.quantity());
  }

  minus(): void {
    if (this.quantity() <= 1) return;
    this.quantity.update((value) => value - 1);
    this.onChangeQuantity.emit(this.quantity());
  }
}
