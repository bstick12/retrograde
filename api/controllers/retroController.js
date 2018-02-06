'use strict';

var request = require('request')

var project = conf.get('project');
var bearerToken = conf.get('bearerToken');

exports.list_retros = function(req,res) {

  request.get('https://retros-iad-api.cfapps.io/retros/' + project + '/archives', {
    'json' : true,
    'auth' : {
      'bearer': bearerToken
    }
  }, function(error, response, body) {
    if(error) {
      return console.error('List retros failed:', error);
    };
    res.json(body.archives);
  });

};

var apply_to_retro = function(retroId, apply) {

  request.get('https://retros-iad-api.cfapps.io/retros/' + project + '/archives/' + retroId, {
    'json' : true,
    'auth' : {
      'bearer': bearerToken
    }
  }, apply);

};

exports.get_a_retro = function(req,res) {

  var retroId = req.params.retroId;

  var write_to_res = function(error, response, body) {
    if(error) {
      return console.error('Get a retro failed:', error);
    };
    res.json(body);
  }

  apply_to_retro(retroId, write_to_res);

};

exports.grade_a_retro = function(req,res) {

  var retroId = req.params.retroId;

  var count_by_author = function(retro_items) {

    var author_regex = /\[(.*)\]/;

    return retro_items.reduce(function(map, retro_item){

      var author = author_regex.exec(retro_item.description);
      if(author) {
        map[author[0].toLowerCase()] = (map[author[0].toLowerCase()]||0)+1;
      } else {
        map['unknown'] = (map['unknown']||0)+1;
      }
      return map;
    }, Object.create(null));

  }

  var count_by_category = function(retro_items) {

    return retro_items.reduce(function(map, retro_item){
      var category = retro_item.category;
      map[category] = (map[category]||0)+1;
      return map;
    }, Object.create(null));

  }

  var retro_grade = {};

  var count_by_owner = function(error, response, body) {

    if(error) {
      return console.error('Get a retro failed:', error);
    };

    retro_grade['category'] = count_by_category(body.retro.items);
    retro_grade['author'] = count_by_author(body.retro.items);
    res.json(retro_grade);

  };

  apply_to_retro(retroId, count_by_owner);

};


