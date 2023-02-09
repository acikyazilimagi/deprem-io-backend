const CollabrationController = require('../Controller/Collabration/CollabrationController');

module.exports = (app) => {
  app.get('/collabration', CollabrationController.getAll);
  app.get('/collabration/:id', CollabrationController.show);
  app.put('/collabration/:id', CollabrationController.update);
  app.delete('/collabration/:id', CollabrationController.delete);
  app.post('/collabration', CollabrationController.store);
}
