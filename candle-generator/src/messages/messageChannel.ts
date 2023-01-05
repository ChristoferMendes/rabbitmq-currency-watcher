import { config } from 'dotenv'
import { connect } from 'amqplib'

export const createMessageChannel = async () => {
  config()

  try {
    const CONNECTION_URL = process.env.AMQP_SERVER as string;
    const connection = await connect(CONNECTION_URL);
    const channel = await connection.createChannel();

    const QUEUE_NAME = process.env.QUEUE_NAME as string;
    await channel.assertQueue(QUEUE_NAME)

    console.log('Connected to RabbitMQ')
    return channel;
  } catch (err) {
    console.log('====================================');
    console.log(`Error while trying to connect to RabbitMQ`);
    console.log(err)
    console.log('====================================');
    return null;
  }
}