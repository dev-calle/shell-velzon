import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estado'
})
export class EstadoPipe implements PipeTransform {
  transform(value: number): string {
    if (value === 1) {
      return 'Activo';
    } else if (value === 2) {
      return 'Inactivo';
    } else {
      return 'Desconocido';
    }
  }
}
