import { db } from '../database/db';

const { Schema } = db;

export const Activity = db.model(
  'activity',
  new Schema({
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cash: {
      type: Number,
    },
    userId: {
      type: Object,
      ref: 'user',
      required: true
    }
  }, {timestamps: true })
);
