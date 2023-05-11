import {
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { NgForOf } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonComponent } from './button.component';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface ProductForm {
  name: FormControl<string | null>;
  price: FormControl<number | null>;
  quantity: FormControl<number | null>;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgForOf, ReactiveFormsModule, ButtonComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  products = signal<Product[]>(
    this._getProductsFromLocalStorage<Product[]>('products') || []
  );

  uniqueID = signal<number>(
    this._getProductsFromLocalStorage<number>('uniqueID') || 0
  );

  totalPrice = computed(() => {
    return this.products().reduce((previous, current) => {
      return previous + current.price * current.quantity;
    }, 0);
  });

  message = signal('');

  form: FormGroup;

  private _fb = inject(FormBuilder);

  constructor() {
    this.form = this._fb.group<ProductForm>({
      name: this._fb.control(''),
      quantity: this._fb.control(1),
      price: this._fb.control(0),
    });

    effect(() => {
      localStorage.setItem('products', JSON.stringify(this.products()));
    });

    effect(() => {
      localStorage.setItem('uniqueID', JSON.stringify(this.uniqueID()));
    });
  }

  addProduct(): void {
    this.uniqueID.update((id) => id + 1);
    this.products.update((products) => [
      ...products,
      {
        id: this.uniqueID(),
        ...this.form.value,
      },
    ]);
    this.form.reset({
      name: '',
      price: 0,
      quantity: 1,
    });
  }

  changeQuantity(id: number, quantity: number) {
    this.products.mutate((productToChanges) => {
      const productToChange = productToChanges.find(
        (product) => product.id === id
      );

      if (productToChange) {
        productToChange.quantity = quantity;
      }
    });
  }

  deleteProduct(id: number): void {
    this.products.update((currentProducts) =>
      currentProducts.filter((item) => item.id !== id)
    );
  }

  sendMessage() {
    this.message.set('Hola como estas');
  }

  private _getProductsFromLocalStorage<T>(key: string): T | null {
    const products = localStorage.getItem(key);
    return products ? JSON.parse(products) : null;
  }
}
