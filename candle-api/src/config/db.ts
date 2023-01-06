import { config } from 'dotenv'
import { connect } from 'mongoose'

export const connectToMongoDb = async () => {
  config();

  const MONGODB_CONNECTION_URL = process.env.MONGODB_CONNECTION_URL as string;

  try {
    await connect(MONGODB_CONNECTION_URL);
    console.log('connected to mongodb')
  } catch (erro) {
    console.log('mongodb connection error', erro)
  }
}