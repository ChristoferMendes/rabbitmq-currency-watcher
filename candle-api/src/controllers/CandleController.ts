import { Candle, CandleModel } from "../models/CandleModel";

export default class CandleController {
  public async save(candle: Candle) {
    const newCandle = await CandleModel.create(candle)

    return newCandle
  }

  public async findLastCandles(quantity: number) {
    const n = quantity > 0 ? quantity : 10
    const lastCandles = CandleModel
      .find()
      .sort({ _id: -1 })
      .limit(n)

    return lastCandles
  }
}