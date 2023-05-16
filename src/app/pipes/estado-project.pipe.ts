import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoProject'
})
export class EstadoProjectPipe implements PipeTransform {
  transform(value: number): string {
    if (value === 1) {
      return 'En Proceso';
    } else if (value === 2) {
      return 'Stand By';
    } else if (value === 3) {
      return 'Terminado';
    } else {
      return 'Desconocido';
    }
  }
}
