import mongoose from 'mongoose';

export async  function DbConnect() {
  await mongoose.connect(`${process.env.DB}`);
  console.log('mongoose is connected');
}

DbConnect().catch((err) => console.log(err));

export const db = mongoose;