export interface StationeryItem {
  id: number;
  desc: string;
  unit: string;
  period: string;
}

export interface IndentData {
  zone: string;
  adminName: string;
  date: string;
  quantities: Record<number, number>;
  remarks: Record<number, string>;
  vendorEmail?: string;
  senderEmail?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
}

