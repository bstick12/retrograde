'use strict';
module.exports = function(app) {

  var retros = require('../controllers/retroController');

  app.route('/api/retros')
    .get(retros.list_retros);

  app.route('/api/retros/:retroId')
    .get(retros.get_a_retro);

  app.route('/api/retros/:retroId/grade')
    .get(retros.grade_a_retro);
};
