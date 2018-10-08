import * as mongoose from 'mongoose';
import * as _ from "lodash";
import { EventSchema, Event, Vote } from '../models/eventsModel';
import { Request, Response } from 'express';

const EventDb = mongoose.model('event', EventSchema);

const removeExtraProperties = (event: Event): Event => {
  event.votes = event.votes.filter(vote => vote.people.length > 0);
  const votes = event.votes.map(vote => {
    return {
      date: vote.date,
      people: vote.people,
    };
  });
  return {
    id: event._id,
    name: event.name,
    dates: event.dates,
    votes
  };
};

export class ContactController {
  public getEventList(req: Request, res: Response) {
    EventDb.find({}, (error, events: Event[]) => {
      if (error) {
        res.status(500).send(error);
      }
      res.status(200).json(events.map(event => {
        return {
          id: event._id, name: event.name
        };
      }));
    });
  }

  public addNewEvent(req: Request, res: Response) {
    const event: Event = req.body;

    if (!event.name || !event.dates) {
      res.status(400).send({ error: "invalid request" });
      return;
    }
    const emptyVotes: Vote[] = [];
    event.dates.forEach(date => {
      const vote: Vote = {
        date,
        people: []
      };
      emptyVotes.push(vote);
    });
    event.votes = emptyVotes;
    const newEvent = new EventDb(req.body);
    newEvent.save((error, event: Event) => {
      if (error) {
        res.status(500).send(error);
      }
      res.status(200).json({ id: event._id });
    });
  }

  public getEvent(req: Request, res: Response) {
    const id: string = req.params.id;

    if (!id) {
      res.status(400).send({ error: "invalid request" });
      return;
    }
    EventDb.findById(id, (error, event: Event) => {
      if (error) {
        res.status(500).send(error);
      }
      res.status(200).json(removeExtraProperties(event))
    });
  }

  public voteEvent(req: Request, res: Response) {
    const id: string = req.params.id;
    const name: string = req.body.name;
    const dates: string[] = req.body.votes;

    if (!id || !name || !dates) {
      res.status(400).send({ error: "invalid request" });
      return;
    }
    EventDb.findById(id, (err, event: Event) => {
      if (err) {
        res.send(err);
      }
      dates.forEach(date => {
        const foundVote = event.votes.find(vote => vote.date === date);
        if (foundVote && !foundVote.people.find(user => user === name)) {
          foundVote.people.push(name);
        }
      });
      EventDb.updateOne(event, (error, update) => {
        if (error) {
          res.status(500).send(error);
        }
        res.status(200).json(removeExtraProperties(event));
      });
    });
  }

  public getEventResults(req: Request, res: Response) {
    const id: string = req.params.id;

    if (!id) {
      res.status(400).send({ error: "invalid request" });
      return;
    }
    EventDb.findById(id, (error, event: Event) => {
      if (error) {
        res.status(500).send(error);
      }
      let users: string[] = [];
      event.votes.forEach(vote => {
        users = [...users, ...vote.people];
      });
      const uniqUsersCount = _.uniqWith(users, _.isEqual).length;
      const suitableDates = event.votes.filter(vote => vote.people.length === uniqUsersCount)
      res.status(200).json({
        id,
        name: event.name,
        suitableDates
      })
    });
  }
}