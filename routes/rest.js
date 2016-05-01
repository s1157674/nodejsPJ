var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//var MONGODBURL = 'mongodb://ccccccc:23382338@192.168.1.211/nodejsPJ';
var MONGODBURL = 'mongodb://ccccccc:23382338@l.ikomoe.com/nodejsPJ';
//var MONGODBURL = 'mongodb://ccccccc:23382338@192.168.1.211/nodejsPJ'; Masked Username Password
var assert = require('assert');
var restaurant = require('../models/restaurant');
var db = mongoose.connection;

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});


var index = function (next) {
    mongoose.connect(MONGODBURL, function (err) {
        if (err != null) {
            db.close();
            next({}, "mongoose.connect fail");
            return;
        }
        var restaurant = mongoose.model('Restaurant');
        restaurant.find({}, {
            grades: 1,
            borough: 1,
            cuisine: 1,
            name: 1,
            restaurant_id: 1,
            _id: 0
        }, {limit: 100}, function (err, results) {
            if (err != null) {
                db.close();
                next({}, "restaurant.find fail");
                return;
            }
            db.close();
            next(results);
        });

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

        var restaurant_id=new_restaurant.restaurant_id;
        console.log(restaurant_id);

        new_restaurant.grades = [];
        restaurant.count({restaurant_id:restaurant_id} ,function (err, count) {
            if (err != null) {
                db.close();
                next({}, "restaurant.findOne fail");
                return;
            }
            console.log(count);
            if (count >0) {
                db.close();
                next({}, "Restaurant ID Exist");
                return;
            }else{
                restaurant.create(new_restaurant, function (err, results) {
                    if (err != null) {
                        db.close();
                        next({}, "restaurant.create fail");
                        return;
                    }
                    db.close();
                    next(results);
                });
            }
        });
    });
};
var show = function (restaurant_id, next) {
    mongoose.connect(MONGODBURL, function (err) {
        if (err != null) {
            db.close();
            next({}, "mongoose.connect fail");
            return;
        }
        var restaurant = mongoose.model('Restaurant');
        restaurant.findOne(restaurant_id,{_id:0} ,function (err, results) {
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
var update = function (restaurant_id, body, next) {
    mongoose.connect(MONGODBURL, function (err) {
        if (err != null) {
            db.close();
            next({}, "mongoose.connect fail");
            return;
        }
        var restaurant = mongoose.model('Restaurant');
        var update_restaurant = new restaurant(body);


        restaurant.findOne(restaurant_id, function (err, result) {
            if (err != null) {
                db.close();
                next({}, "restaurant.findOne fail");
                return;
            }

            result.address = update_restaurant.address;
            result.borough = update_restaurant.borough;
            result.cuisine = update_restaurant.cuisine;
            result.name = update_restaurant.name;
            //result.restaurant_id = update_restaurant.restaurant_id; //should not be edit

            result.save(function (err) {
                if (err != null) {
                    db.close();
                    next({}, "update_restaurant.save fail");
                    return;
                }
                db.close();
                next(result);
            });
        });

    });
};
var destroy = function (restaurant_id, next) {
    mongoose.connect(MONGODBURL, function (err) {
        if (err != null) {
            db.close();
            next({}, "mongoose.connect fail");
            return;
        }
        var restaurant = mongoose.model('Restaurant');
        restaurant.remove(restaurant_id, function (err, results) {
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

var listGrade = function (restaurant_id, next) {
    mongoose.connect(MONGODBURL, function (err) {
        if (err != null) {
            db.close();
            next({}, "mongoose.connect fail");
            return;
        }
        var restaurant = mongoose.model('Restaurant');
        restaurant.findOne(restaurant_id, function (err, result) {
            if (err != null) {
                db.close();
                next({}, "restaurant.findOne fail");
                return;
            }
            db.close();
            next(result.grades);
        });
    });
};
var pushGrade = function (restaurant_id, body, next) {
    mongoose.connect(MONGODBURL, function (err) {
        if (err != null) {
            next({}, "mongoose.connect fail");
            db.close();
            return;
        }
        var restaurant = mongoose.model('Restaurant');
        var grade = mongoose.model('Grade');
        var new_grade = new grade(body);
        restaurant.findOneAndUpdate(restaurant_id, {$push: {grades: new_grade}}, function (err, result) {
            if (err != null) {
                next({}, "restaurant.findOneAndUpdate fail");
                db.close();
                return;
            }
            db.close();
            next(result);
        });

    });
};
var updateGrade = function (restaurant_id, body, next) {
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


        restaurant.findOneAndUpdate(restaurant_id, {grades: new_grades}, function (err, result) {
            if (err != null) {
                db.close();
                next({}, "restaurant.findOneAndUpdate fail");
                return;
            }
            db.close();
            next(result);
        });
    });
};
var pullGrade = function (restaurant_id, body, next) {
    mongoose.connect(MONGODBURL, function (err) {
        if (err != null) {
            db.close();
            next({}, "mongoose.connect fail");
            return;
        }
        var restaurant = mongoose.model('Restaurant');
        var grade = mongoose.model('Grade');
        var new_grade = new grade(body);
        restaurant.findOneAndUpdate(restaurant_id, {$pull: {grades: new_grade}}, function (err, result) {
            if (err != null) {
                db.close();
                next({}, "restaurant.findOneAndUpdate fail");
                return;
            }
            db.close();
            next(result);
        });

    });
};

//GUI
router.get('/', function (req, res) {
    index(function (results,errorMessage) {
        var j={};
        j.errorMessages=errorMessage;
        j.result=results;
        console.log(j);
        res.render('index', j);
    })
});





//GET	    /rest/restaurant	                        index
//POST	    /rest/restaurant/create	                    create
//GET	    /rest/restaurant/{restaurant_id}	        show
//PUT	    /rest/restaurant/{restaurant_id}	        update
//DELETE	/rest/restaurant/{restaurant_id}	        destroy
router.get('/rest/restaurant', function (req, res) {
    console.log(123);
    index(function (results, errorMessage) {
        var j={};
        j.errorMessages=errorMessage;
        j.result=results;
        res.json(j);
        res.end('Connection closed',200);
    });
});
router.post('/rest/restaurant/create', jsonParser, function (req, res) {
    create(req.body, function (results, errorMessage) {
        var j={};
        j.errorMessages=errorMessage;
        j.result=results;
        res.json(j);
        res.end('Connection closed',200);
    });
});
router.get('/rest/restaurant/:restaurant_id', function (req, res) {
    show(req.params, function (results, errorMessage) {
        var j={};
        j.errorMessages=errorMessage;
        j.result=results;
        res.json(j);
        res.end('Connection closed',200);
    });
});
router.put('/rest/restaurant/:restaurant_id', jsonParser, function (req, res) {
    update(req.params, req.body, function (results, errorMessage) {
        var j={};
        j.errorMessages=errorMessage;
        j.result=results;
        res.json(j);
        res.end('Connection closed',200);
    });
});
router.delete('/rest/restaurant/:restaurant_id', jsonParser, function (req, res) {
    destroy(req.params, function (results, errorMessage) {
        res.json(results);
        res.end('Connection closed',200);
    });
});

//GET	    /rest/restaurant/{restaurant_id}/grade 	                    listGrade
//POST	    /rest/restaurant/{restaurant_id}/grade                      pushGrade
//PUT	    /rest/restaurant/{restaurant_id}/grade                      updateGrade
//DELETE	/rest/restaurant/{restaurant_id}/grade	                    pullGrade
router.get('/rest/restaurant/:restaurant_id/grade', function (req, res) {
    listGrade(req.params, function (results, errorMessage) {
        res.json(results);
        res.end('Connection closed',200);
    });
});
router.post('/rest/restaurant/:restaurant_id/grade', function (req, res) {
    pushGrade(req.params, req.body, function (results, errorMessage) {
        res.json(results);
        res.end('Connection closed',200);
    });
});
router.put('/rest/restaurant/:restaurant_id/grade', function (req, res) {
    updateGrade(req.params, req.body, function (results, errorMessage) {
        res.json(results);
        res.end('Connection closed',200);
    });
});
router.delete('/rest/restaurant/:restaurant_id/grade', function (req, res) {
    pullGrade(req.params, req.body, function (results, errorMessage) {
        res.json(results);
        res.end('Connection closed',200);
    });
});


module.exports = router;
