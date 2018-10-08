import { ContactController } from "../controllers/eventsController";

export class Routes {

  public contactController: ContactController = new ContactController()

  public routes(app): void {
    app.route('/api/v1/event/list').get(this.contactController.getEventList);
    app.route('/api/v1/event/:id').get(this.contactController.getEvent);
    app.route('/api/v1/event/').post(this.contactController.addNewEvent);
    app.route('/api/v1/event/:id/vote').post(this.contactController.voteEvent);
    app.route('/api/v1/event/:id/results').get(this.contactController.getEventResults);
  }
}