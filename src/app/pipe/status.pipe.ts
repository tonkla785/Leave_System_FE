import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
  standalone: true,
})
export class StatusPipe implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case 'รออนุมัติ':
        return 'pending';
      case 'อนุมัติ':
        return 'approved';
      case 'ไม่อนุมัติ':
        return 'rejected';
      default:
        return '';
    }
  }
}
