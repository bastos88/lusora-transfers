export function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDaysFromToday(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDateForInput(date);
}

export function buildDateTime(date: string, time: string): Date | null {
  if (!date || !time) {
    return null;
  }

  const value = new Date(`${date}T${time}:00`);
  return Number.isNaN(value.getTime()) ? null : value;
}

export function formatBookingDate(date: string, time: string): string {
  const value = buildDateTime(date, time);

  if (!value) {
    return 'Data por confirmar';
  }

  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(value);
}

export const timeOptions: string[] = Array.from({ length: 48 }, (_, index) => {
  const hour = Math.floor(index / 2);
  const minutes = index % 2 === 0 ? '00' : '30';
  return `${String(hour).padStart(2, '0')}:${minutes}`;
});
