import { db } from '../database/db';

const { Schema } = db;

export const Token = db.model(
  'token',
  new Schema({
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600
    },
    userId: {
      type: Object,
      ref: 'user',
      required: true
    }
  })
);
