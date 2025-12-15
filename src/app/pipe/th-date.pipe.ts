import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thDate',
  standalone: true
})
export class ThDatePipe implements PipeTransform {

   transform(startDate?: string | Date, endDate?: string | Date): string {
    if (!startDate) return '-';

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    const thaiMonth = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.',
      'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.',
      'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    const format = (d: Date) => {
      const day = d.getDate();
      const month = thaiMonth[d.getMonth()];
      const year = d.getFullYear() + 543;
      return `${day} ${month} ${year}`;
    };

    if (!end || start.toDateString() === end.toDateString()) {
      return format(start);
    }

    if (
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    ) {
      return `${start.getDate()}–${end.getDate()} ${
        thaiMonth[start.getMonth()]
      } ${start.getFullYear() + 543}`;
    }

    return `${format(start)} – ${format(end)}`;
  }

}
