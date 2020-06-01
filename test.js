// const musicAPI = require("music-api-next")

// musicAPI
//   .getComment({
//     id: "1399646264",
//     page: 3,
//     limit: 20,
//     vendor: 'netease'
//   })
//   .then(comments => console.log(comments))
//   .catch(error => console.log(error.message));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
 
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("runoob");
    var myobj = { name: "菜鸟教程", url: "www.runoob" };
    dbo.collection("site").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("文档插入成功");
        db.close();
    });
});