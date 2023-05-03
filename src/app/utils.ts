import { FormControl, ValidationErrors } from "@angular/forms";

const cartData = [
  { id: 1, img: 'assets/images/products/img-1.png', product: "Branded T-Shirts", quantity: 10, price: 32 },
  { id: 2, img: 'assets/images/products/img-2.png', product: "Bentwood Chair", quantity: 5, price: 18 },
  { id: 3, img: 'assets/images/products/img-3.png', product: "Borosil Paper Cup", quantity: 3, price: 250 },
  { id: 4, img: 'assets/images/products/img-6.png', product: "Gray Styled T-Shirt", quantity: 1, price: 1250 },
  { id: 5, img: 'assets/images/products/img-5.png', product: "Stillbird Helmet", quantity: 2, price: 495 },
];
export { cartData };

export function nonEmptyArrayValidator(control: FormControl): ValidationErrors | null {
  if (!control.value || control.value.length === 0) {
    return { nonEmptyArray: true };
  }
  return null;
}

export function formattedFirstDayOfMonth(): string {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return firstDayOfMonth.toISOString().slice(0, 10);
}

export function formattedLastDayOfMonth(): string {
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return lastDayOfMonth.toISOString().slice(0, 10);
}