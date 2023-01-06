import { Channel, connect } from "amqplib";
import { config } from "dotenv";
import { Server } from "socket.io";
import * as http from 'http'
import CandleController from "../controllers/CandleController";
import { Candle } from "../models/CandleModel";

config()

export default class CandleMessageChannel {

  private _channel: Channel | undefined
  private _candleController: CandleController
  private _io: Server

  constructor(server: http.Server) {
    this._candleController = new CandleController();
    this._io = new Server(server, {
      cors: {
        origin: '*'
      }
    });
    this._io.on('connection', () => console.log('Web socket connection created'))
    this._channel = undefined;

  }

  private async _createMessageChannel () {
    try {
      const connection = await connect(process.env.AMQP_SERVER as string)
      this._channel = await connection.createChannel();
      this._channel.assertQueue(process.env.QUEUE_NAME as string)
      console.log('connected to RabbitMQ')
    } catch (err) {
      console.log('Connection to RabbitMQ failed')
      console.log(err)
    }
  }

  async consumeMessages() {
    await this._createMessageChannel();
    if (!this._channel) return;

    
    this._channel?.consume(process.env.QUEUE_NAME as string, async (msg) => {
     
      if (!msg) return;
      const candleObj = JSON.parse(msg.content.toString())
      console.log('Message received');
      console.log(candleObj)
      this._channel?.ack(msg)

      const candle: Candle = candleObj;
      this._candleController.save(candle);

      console.log('Candle saved to database')
      this._io.emit(process.env.SOCKET_EVENT_NAME as string, candle)
      console.log('New candle emited by web socket')
    })

    console.log('Candle consumer started')
  }

  private _serverConfig () {
    return {
      cors: {
        origin: process.env.SOCKET_CLIENT_SERVER,
        methods: ["GET", "POST"]
      }
    }
  }
}