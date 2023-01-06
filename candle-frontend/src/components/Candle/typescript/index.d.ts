export interface ICandle {
  currency: string;
  low: number;
  high: number;
  close: number;
  open: number;
  color: string;
  finalDateTime: Date;
}