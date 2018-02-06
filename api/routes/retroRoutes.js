'use strict';
module.exports = function(app) {

  var retros = require('../controllers/retroController');

  app.route('/retros')
    .get(retros.list_retros);

  app.route('/retros/:retroId')
    .get(retros.get_a_retro);

  app.route('/retros/:retroId/grade')
    .get(retros.grade_a_retro);
};
