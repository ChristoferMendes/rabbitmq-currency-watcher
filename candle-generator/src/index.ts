import { config } from 'dotenv'
import axios from 'axios'
import Period from './enums/Period';
import Candle from './models/Candle';
import { createMessageChannel } from './messages/messageChannel';

config();

const readMarketPrice = async () => {
  const URL = process.env.PRICES_API as string;
  const result = await axios.get(URL)
  const data = result.data;
  const price = data.bitcoin.usd;
  return price;

}

const generateCandles = async () => {

  const messageChannel = await createMessageChannel();

  if (!messageChannel) return;

  while(true) {
    const loopTimes = Period.ONE_MINUTE / Period.TEN_SECONDS;

    const candle = new Candle('BTC')
    console.log('====================================');
    console.log('Generating new candle...');
    console.log('====================================');

    for (let i = 0; i < loopTimes; i++) {
      const price = await readMarketPrice();
      candle.addValue(price);
      console.log('====================================');
      console.log(`Market price #${i + 1} of ${loopTimes}`);
      console.log('====================================');
      await new Promise(resolve   => setTimeout(resolve, Period.TEN_SECONDS))
    }

    candle.closeCandle();
    console.log('Candle closed');

    const candleObj = candle.toSimbleObject();
    console.log(candleObj)
    const candleJson = JSON.stringify(candleObj);

    const QUERY_NAME = process.env.QUEUE_NAME as string;

    messageChannel.sendToQueue(QUERY_NAME, Buffer.from(candleJson))
    console.log('candle sent to queue')
  }
}

generateCandles();
