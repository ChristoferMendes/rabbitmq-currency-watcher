import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { ICandle } from "./typescript";
import Chart from 'react-apexcharts'
import { api } from "../../services/api";

const socket = io('http://localhost:3000');

export function Candle() {
  const [candles, setCandles] = useState<ICandle[]>([])
  const [isConnected, setIsConnected] = useState(false)


  useEffect(() => {
    socket.on('connect', () => setIsConnected(true))

    socket.on('disconnect', () => setIsConnected(false))


    getLastCandles();
    captureMessage();


  }, [])

  const captureMessage = () => {
    socket.on('newCandle', (msg: ICandle) => {
      console.log(msg)
      setCandles(prev => [...prev, msg])
    })
  }

  const getLastCandles = async () => {
    const lastCandles = await api.get<ICandle[]>('/candles/5');

    setCandles(lastCandles.data)
  }

  const returnXAndYOfACandle = (candle: ICandle) => ({ x: candle.finalDateTime, y: [candle.open, candle.high, candle.low, candle.close] })

  const candleChartData = candles.map(returnXAndYOfACandle)

  return (
    <Chart type="candlestick" options={{
      chart: {
        type: 'candlestick',
        height: 350
      },
      title: {
        text: `Bitcoin last prices - ${String(isConnected)}`,
        align: 'center'
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    }}
      series={[
        {
          data: candleChartData
        }
      ]}
    />
  );
}
