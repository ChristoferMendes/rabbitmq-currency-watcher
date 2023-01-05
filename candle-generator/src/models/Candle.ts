import CandleColor from "../enums/CandleColor";

export default class Candle {

  low: number;
  high: number;
  open: number;
  close: number;
  color: CandleColor;
  finalDateTime: Date | undefined;
  values: number[]
  currency: string

  constructor(currency: string) {
    this.currency = currency;
    this.low = Infinity
    this.high = 0;
    this.close = 0;
    this.open = 0;
    this.values = []
    this.color = CandleColor.UNDETERMINED
    this.finalDateTime = undefined
  }

  public addValue(value: number) {
    this.values.push(value);

    if (this.values.length == 1) {
      this.open = value;
    }

    if (this.low > value) {
      this.low = value;
    }

    if (this.high < value) {
      this.high = value;
    }

  }

  public closeCandle() {
    if (this.values.length > 0) {
      this.close = this.values[this.values.length - 1]
      this.finalDateTime = new Date();

      this.color = this.determineColor();
    }
  }

  public toSimbleObject () {
    const { values, ...rest } = this;

    return rest;
  }

  private determineColor () {
    let determinedColor = CandleColor.UNDETERMINED

    const stockDropped = this.open > this.close;
    if (stockDropped) {
      determinedColor = CandleColor.RED
      return determinedColor;
    }

    const stockUp = this.close > this.open;
    if (stockUp) {
      determinedColor = CandleColor.GREEN;
      return determinedColor;
    }

    return determinedColor
  }
}