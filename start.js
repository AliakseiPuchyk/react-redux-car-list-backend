const express = require("express");
const mongoClient = require("mongodb").MongoClient;

const app = express();
const url = "mongodb://localhost:27017/usersdb";

app.use(express.static(__dirname + "/public"));
app.get("/api/getCars", function(req, res) {
    if (req.query.page && req.query.limit) {
        req.query.page = Number(req.query.page) - 1;
        req.query.limit = Number(req.query.limit);
    }

    res.append("Access-Control-Allow-Origin", "*");
    res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.append("Access-Control-Allow-Headers", "Content-Type");
    mongoClient.connect(
        url,
        function(err, client) {
            client
                .db("carsDB")
                .collection("cars_huge")
                .find({})
                .skip(req.query.page * req.query.limit)
                .limit(req.query.limit)
                .toArray(function(err, cars) {
                    res.send(cars);
                    client.close();
                });
        }
    );
});

app.get("/api/getColleLength", function(req, res) {
    res.append("Access-Control-Allow-Origin", "*");
    res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.append("Access-Control-Allow-Headers", "Content-Type");
    mongoClient.connect(
        url,
        function(err, client) {
            client
                .db("carsDB")
                .collection("cars_huge")
                .find({})
                .count()
                .then(value => {
                    collectionLength = { data: value };
                    res.send(collectionLength);
                });

            client.close();
        }
    );
});

app.listen(3001, function() {
    console.log("Сервер ожидает подключения...");
});
