var mongoose = require('mongoose');


var gradeSchema = mongoose.Schema({
    date: { type: Date, default: Date.now },
    grade: {type: String,required: true, minLength: 1, maxLength: 5},
    score: {type: Number,required: true, min: 0 }
},{ _id : false });

var restaurantSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    address: {
        building: {type: String,required: true, minlength: 1, maxlength: 100},
        coord: [ {type: Number,required: true}],
        street: {type: String,required: true, minlength: 1, maxlength: 100},
        zipcode: {type: String,required: true, minlength: 1, maxlength: 20}
    },
    borough: {type: String,required: true, minlength: 1, maxlength: 100},
    cuisine: {type: String, required: true, minlength: 1, maxlength: 200},
    grades: [gradeSchema],
    name: {type: String, required: true, minlength: 1, maxlength: 200},
    restaurant_id: {type: String, required: true, minlength: 1, maxlength: 20}
});

//module.exports = restaurantSchema;
mongoose.model('Restaurant',restaurantSchema);
mongoose.model('Grade',gradeSchema);

// {
//     "address":{
//     "building":"1007",
//     "coord":[
//         -73.856077,
//         40.848447
//     ],
//         "street":"Morris Park Ave",
//         "zipcode":"10462"
// },
//     "borough":"Bronx",
//     "cuisine":"Bakery",
//     "grades":[
//     {
//         "date":{},
//         "grade":"A",
//         "score":2
//     },
//     {
//         "date":{
//             "$date":1378857600000
//         },
//         "grade":"A",
//         "score":6
//     },
//     {
//         "date":{
//             "$date":1358985600000
//         },
//         "grade":"A",
//         "score":10
//     },
//     {
//         "date":{
//             "$date":1322006400000
//         },
//         "grade":"A",
//         "score":9
//     },
//     {
//         "date":{
//             "$date":1299715200000
//         },
//         "grade":"B",
//         "score":14
//     }
// ],
//     "name":"Morris Park Bake Shop",
//     "restaurant_id":"30075445"
// }