import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const VoteScheme = new Schema({
  date: {
    type: String,
  },
  people: {
    type: [String]
  }
});

export const EventSchema = new Schema({
  name: {
    type: String,
  },
  dates: {
    type: [String]
  },
  votes: {
    type: [VoteScheme]
  }
});

export interface Vote {
  _id?: string,
  date: string,
  people: string[]
}

export interface Event {
  __v?: number,
  _id?: string,
  id: string,
  name: string,
  dates: string[],
  votes?: Vote[]
}