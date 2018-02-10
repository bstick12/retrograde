'use strict';

var request = require('request')

var project = conf.get('project');
var bearerToken = conf.get('bearerToken');


var callAPI = function(url, dataHandler) {

  request.get(url , {
    'json' : true,
    'auth' : {
      'bearer': bearerToken
    }
  }, function(error, response, body) {
    if(error) {
      return console.error('List retros failed:', error);
    };
    dataHandler(body);
  });

}

var internal_list_retros = function(dataHandler) {

  callAPI( 'https://retros-iad-api.cfapps.io/retros/' + project + '/archives', dataHandler);

}

exports.list_retros = function(req,res) {

  internal_list_retros(function(data) {
    res.json(data.archives);
  });

};

var internal_get_a_retro = function(retroId, dataHandler) {
  callAPI('https://retros-iad-api.cfapps.io/retros/' + project + '/archives/' + retroId, dataHandler);
}

exports.get_a_retro = function(req,res) {

  var retroId = req.params.retroId;

  internal_get_a_retro(retroId, function(data) {
    res.json(data);
  });

};

var internal_grade_a_retro = function(retroId, dataHandler) {

  console.log("Calling grading for " + retroId);

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

  var grade_retro = function(data) {

    retro_grade['category'] = count_by_category(data.retro.items);
    retro_grade['author'] = count_by_author(data.retro.items);
    dataHandler(retro_grade);

  };

  internal_get_a_retro(retroId, grade_retro);

}

exports.grade_a_retro = function(req,res) {

  var retroId = req.params.retroId;

  internal_grade_a_retro(retroId, function (data) {
    res.json(data);
  });

};

var sleep = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function internal_grade_retros(dataHandler) {

  var graded_retros = [];

  internal_list_retros(async function(body) {
    var retros = body.archives;

    retros.forEach(function(retro, i) {
      internal_grade_a_retro(retro.id, function(graded_retro) {
        graded_retros.push(graded_retro);
      });
    });

    while(true) {
      if(retros.length == graded_retros.length) {
        dataHandler(graded_retros);
        return;
      } else {
        console.log('Going to sleep '  + graded_retros.length);
        await sleep(100);
      }
    }

  });

};

exports.grade_retros = function(req,res) {

  internal_grade_retros(function(data) {
    res.json(data);
  });

};

