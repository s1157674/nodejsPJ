var mongoose = require('mongoose');


var gradeSchema = mongoose.Schema({
    date: Date,
    grade: String,
    score: Number
},{ _id : false });

var restaurantSchema = mongoose.Schema({
    address: {
        building: String,
        coord: [Number],
        street: String,
        zipcode: String
    },
    borough: String,
    cuisine: String,
    grades: [gradeSchema],
    name: String,
    restaurant_id: String
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