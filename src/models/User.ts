import { db } from '../database/db';

const { Schema } = db;

export const User = db.model(
  'user',
  new Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    photo_id: {
      type: String,
    },
    occupation: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    tfa_secret: {
      type: String,
      default: ''
    }
  }, {timestamps: true })
);
