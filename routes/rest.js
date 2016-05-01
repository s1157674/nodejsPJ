var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//var MONGODBURL = 'mongodb://ccccccc:23382338@192.168.1.211/nodejsPJ';
var MONGODBURL = 'mongodb://ccccccc:23382338@ds064718.mlab.com:64718/restaurantrestaurant'; // 500 MB MongoLab (USA)
//var MONGODBURL = 'mongodb://ccccccc:23382338@l.ikomoe.com/nodejsPJ';
//var MONGODBURL = 'mongodb://*******:********@192.168.1.211/nodejsPJ'; Masked Username Password for github public
var assert = require('assert');
var restaurant = require('../models/restaurant');
var db = mongoose.connection;

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});


var index = function (query, next) {

    /*  for (var key in query) {
     var query_item = query[key];
     }*/


    var selector = {};
    if (query.name) selector.name = {'$regex': query.name};
    if (query.cuisine) selector.cuisine = {'$regex': query.cuisine};
    if (query.borough) selector.borough = {'$regex': query.borough};
    if (query.restaurant_id) selector.restaurant_id = {'$regex': query.restaurant_id};

    if (query.building) {
        selector['address.building'] = {'$regex': query.building};
    }
    if (query.zipcode) {
        selector['address.zipcode'] = {'$regex': query.zipcode};
    }
    if (query.street) {
        selector['address.street'] = {'$regex': query.street};
    }


    var sortor = {};

    var limit = 100;
    if (query.display) {
        limit = parseInt(query.display, 10);
    }


    /*  for (var key in query) {
     var query_item = query[key];
     }*/

    // console.log(selector);
    // console.log(limit);
    // console.log(sortor);


    mongoose.connect(MONGODBURL, function (err) {
        if (err != null) {
            db.close();
            next({}, "mongoose.connect fail");
            return;
        }
        var restaurant = mongoose.model('Restaurant');
        restaurant.find(
            selector,
            {
                grades: 1,
                borough: 1,
                cuisine: 1,
                name: 1,
                restaurant_id: 1
            }
            ,
            function (err, results) {
                if (err != null) {
                    console.log(err);
                    db.close();
                    next({}, "restaurant.find fail");
                    return;
                }
                db.close();
                next(results);
            }
        ).sort(sortor).limit(limit);
    });
};
var create = function (body, next) {
    mongoose.connect(MONGODBURL, function (err) {
        if (err != null) {
            db.close();
            next({}, "mongoose.connect fail");
            return;
        }
        var restaurant = mongoose.model('Restaurant');
        var new_restaurant = new restaurant(body);

        //var _id = new_restaurant._id;
        var id = mongoose.Types.ObjectId();
        new_restaurant._id=id;
        new_restaurant.grades = [];
        new_restaurant.validate(function (err) {
            if (err != null) {
                db.close();
                next({}, err.message, err);
                return;
            } else {
                restaurant.create(new_restaurant, function (err, results) {
                    if (err != null) {
                        console.log(err);
                        db.close();
                        next({}, "restaurant.create fail");
                        return;
                    }
                    db.close();
                    next(results);
                });
                //** change to use _id
                // restaurant.count({_id: _id}, function (err, count) {
                //     if (err != null) {
                //         db.close();
                //         next({}, "restaurant.findOne fail");
                //         return;
                //     }
                //     console.log(count);
                //     if (count > 0) {
                //         db.close();
                //         next({}, "Restaurant ID Exist");
                //         return;
                //     } else {   }
                //
                //
                // });
            }
        });


    });
};
var show = function (_id, next) {
    mongoose.connect(MONGODBURL, function (err) {
        if (err != null) {
            db.close();
            next({}, "mongoose.connect fail");
            return;
        }
        var restaurant = mongoose.model('Restaurant');
        restaurant.findById(_id, function (err, results) {
            if (err != null) {
                db.close();
                next({}, "restaurant.findOne fail");
                return;
            }
            db.close();
            next(results);
        });
    });
};
var update = function (_id, body, next) {
    mongoose.connect(MONGODBURL, function (err) {
        if (err != null) {
            db.close();
            next({}, "mongoose.connect fail");
            return;
        }
        var restaurant = mongoose.model('Restaurant');
        var update_restaurant = new restaurant(body);

        update_restaurant.validate(function (err) {
            if (err != null) {
                db.close();
                next({}, err.message, err);
                return;
            } else {
                restaurant.findById(_id, function (err, result) {
                    if (err != null) {
                        db.close();
                        next({}, "restaurant.findOne fail");
                        return;
                    }

                    result.address = update_restaurant.address;
                    result.borough = update_restaurant.borough;
                    result.cuisine = update_restaurant.cuisine;
                    result.name = update_restaurant.name;
                    result.restaurant_id = update_restaurant.restaurant_id;

                    result.save(function (err) {
                        if (err != null) {
                            console.log(err);
                            db.close();
                            next({}, "update_restaurant.save fail");
                            return;
                        }
                        db.close();
                        next(result);
                    });
                });
            }
        });


    });
};
var destroy = function (_id, next) {
    mongoose.connect(MONGODBURL, function (err) {
        if (err != null) {
            db.close();
            next({}, "mongoose.connect fail");
            return;
        }
        var restaurant = mongoose.model('Restaurant');
        restaurant.remove(_id, function (err, results) {
            if (err != null) {
                db.close();
                next({}, "restaurant.remove fail");
                return;
            }
            db.close();
            next(results);
        });
    });
};

var listGrade = function (_id, next) {
    mongoose.connect(MONGODBURL, function (err) {
        if (err != null) {
            db.close();
            next({}, "mongoose.connect fail");
            return;
        }
        var restaurant = mongoose.model('Restaurant');
        restaurant.findById(_id, function (err, result) {
            if (err != null) {
                db.close();
                next({}, "restaurant.findById fail");
                return;
            }
            db.close();
            next(result.grades);
        });
    });
};
var pushGrade = function (_id, body, next) {
    mongoose.connect(MONGODBURL, function (err) {
        if (err != null) {
            next({}, "mongoose.connect fail");
            db.close();
            return;
        }
        var restaurant = mongoose.model('Restaurant');
        var grade = mongoose.model('Grade');
        var new_grade = new grade(body);
        restaurant.findByIdAndUpdate(_id, {$push: {grades: new_grade}}, function (err, result) {
            if (err != null) {
                next({}, "restaurant.findByIdAndUpdate fail");
                db.close();
                return;
            }
            db.close();
            next(result);
        });

    });
};
var updateGrade = function (_id, body, next) {
    mongoose.connect(MONGODBURL, function (err) {
        if (err != null) {
            db.close();
            next({}, "mongoose.connect fail");
            return;
        }
        var restaurant = mongoose.model('Restaurant');
        var grade = mongoose.model('Grade');
        var new_grades = [];

        body.forEach(function (item) {
            var new_grade = new grade(item);
            new_grades.push(new_grade);
        });


        restaurant.findByIdAndUpdate(_id, {grades: new_grades}, function (err, result) {
            if (err != null) {
                db.close();
                next({}, "restaurant.findByIdAndUpdate fail");
                return;
            }
            db.close();
            next(result);
        });
    });
};
var pullGrade = function (_id, body, next) {
    mongoose.connect(MONGODBURL, function (err) {
        if (err != null) {
            db.close();
            next({}, "mongoose.connect fail");
            return;
        }
        var restaurant = mongoose.model('Restaurant');
        var grade = mongoose.model('Grade');
        var new_grade = new grade(body);
        restaurant.findByIdAndUpdate(_id, {$pull: {grades: new_grade}}, function (err, result) {
            if (err != null) {
                db.close();
                next({}, "restaurant.findByIdAndUpdate fail");
                return;
            }
            db.close();
            next(result);
        });

    });
};

//GUI
router.get('/', function (req, res) {
    index(req.query, function (results, errorMessage) {
        //avgScore
        var output_results=[];
        for(var i=0;i<results.length;i++){
            var avgScore=0;
            results[i].grades.forEach(function (grade) {
                avgScore+=grade.score;
            });
            if(results[i].grades.length==0){
                avgScore= 'N/A';
            }else {
                avgScore /= results[i].grades.length;
                avgScore=avgScore.toFixed(2)
            }
            var newResult = JSON.parse(JSON.stringify(results[i]));
            newResult.avgScore=avgScore;
            results[i]=newResult;
        }

        if(req.query.sort){
            if(req.query.sort=='score'){
                var direction=(req.query.direction == null) ? 1 : req.query.direction;
                var undirection;
                if(direction<0){
                    undirection=1;
                }else {
                    undirection=-1;
                }

                console.log(123);
                results.sort(function (a, b) {
                    if (parseFloat(a.avgScore)  > parseFloat(b.avgScore)) {
                        return direction;
                    }
                    if (parseFloat(a.avgScore) < parseFloat(b.avgScore)) {
                        return undirection;
                    }
                    // a must be equal to b
                    return 0;
                });

            }
        }


        var j = {};
        j.errorMessages = errorMessage;
        j.result = results;
        //    console.log(j);
        res.render('index', j);
    })
});


//GET	    /rest/restaurant	            index
//POST	    /rest/restaurant/create	        create
//GET	    /rest/restaurant/{_id}	        show
//PUT	    /rest/restaurant/{_id}	        update
//DELETE	/rest/restaurant/{_id}	        destroy
router.get('/rest/restaurant', urlencodedParser, function (req, res) {
    index(req.query, function (results, errorMessage) {
        //avgScore
        var output_results=[];
        for(var i=0;i<results.length;i++){
            var avgScore=0;
            results[i].grades.forEach(function (grade) {
                avgScore+=grade.score;
            });
            if(results[i].grades.length==0){
                avgScore= 'N/A';
            }else {
                avgScore /= results[i].grades.length;
                avgScore=avgScore.toFixed(2)
            }
            var newResult = JSON.parse(JSON.stringify(results[i]));
            newResult.avgScore=avgScore;
            results[i]=newResult;
        }

        if(req.query.sort){
            if(req.query.sort=='score'){
                var direction=(req.query.direction == null) ? 1 : req.query.direction;
                var undirection;
                if(direction<0){
                    undirection=1;
                }else {
                    undirection=-1;
                }

                console.log(123);
                results.sort(function (a, b) {
                    if (parseFloat(a.avgScore)  > parseFloat(b.avgScore)) {
                        return direction;
                    }
                    if (parseFloat(a.avgScore) < parseFloat(b.avgScore)) {
                        return undirection;
                    }
                    // a must be equal to b
                    return 0;
                });

            }
        }

        var j = {};
        j.errorMessages = errorMessage;
        j.result = results;
        res.json(j);
        res.end('Connection closed', 200);
    });
});
router.post('/rest/restaurant/create', jsonParser, function (req, res) {
    create(req.body, function (results, errorMessage, err) {
        var j = {};

        if (errorMessage != null) {
            j.errorMessages = errorMessage;
        }
        if (err != null) {
            for (var key in err.errors) {
                var error = err.errors[key];
                delete error.message;
                delete error.name;
                delete error.properties;
                delete error.message;
                delete error.value;
                if (key == 'address.coord' && error.kind == 'Array')error.kind = 'Number';
            }
            j.errors = err.errors;
        }
        j.result = results;
        res.json(j);
        res.end('Connection closed', 200);
    });
});
router.get('/rest/restaurant/:_id', function (req, res) {
    show(req.params, function (results, errorMessage) {
        var j = {};
        j.errorMessages = errorMessage;
        j.result = results;
        res.json(j);
        res.end('Connection closed', 200);
    });
});
router.put('/rest/restaurant/:_id', jsonParser, function (req, res) {
    update(req.params, req.body, function (results, errorMessage, err) {
        var j = {};

        if (errorMessage != null) {
            j.errorMessages = errorMessage;
        }
        console.log(err);
        if (err != null) {
            for (var key in err.errors) {
                var error = err.errors[key];
                delete error.message;
                delete error.name;
                delete error.properties;
                delete error.message;
                delete error.value;
                if (key == 'address.coord' && error.kind == 'Array')error.kind = 'Number';
            }
            j.errors = err.errors;
        }
        j.result = results;
        res.json(j);
        res.end('Connection closed', 200);
    });
});
router.delete('/rest/restaurant/:_id', jsonParser, function (req, res) {
    destroy(req.params, function (results, errorMessage) {
        res.json(results);
        res.end('Connection closed', 200);
    });
});

//GET	    /rest/restaurant/{restaurant_id}/grade 	                    listGrade
//POST	    /rest/restaurant/{restaurant_id}/grade                      pushGrade
//PUT	    /rest/restaurant/{restaurant_id}/grade                      updateGrade
//DELETE	/rest/restaurant/{restaurant_id}/grade	                    pullGrade
router.get('/rest/restaurant/:_id/grade', function (req, res) {
    listGrade(req.params, function (results, errorMessage) {
        res.json(results);
        res.end('Connection closed', 200);
    });
});
router.post('/rest/restaurant/:_id/grade', function (req, res) {
    pushGrade(req.params, req.body, function (results, errorMessage) {
        res.json(results);
        res.end('Connection closed', 200);
    });
});
router.put('/rest/restaurant/:_id/grade', function (req, res) {
    updateGrade(req.params, req.body, function (results, errorMessage) {
        res.json(results);
        res.end('Connection closed', 200);
    });
});
router.delete('/rest/restaurant/:_id/grade', function (req, res) {
    pullGrade(req.params, req.body, function (results, errorMessage) {
        res.json(results);
        res.end('Connection closed', 200);
    });
});


module.exports = router;
