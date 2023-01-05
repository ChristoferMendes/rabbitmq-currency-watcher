import { config } from 'dotenv'
import { connect } from 'mongoose'

export const connectToMongoDb = async () => {
  config();

  const MONGODB_CONNECTION_URL = process.env.MONGODB_CONNECTION_URL as string;

  await connect(MONGODB_CONNECTION_URL);
}