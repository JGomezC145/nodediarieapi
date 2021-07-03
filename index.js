// Firebase App (the core Firebase SDK) is always required and
const express = require("express");
const app = express();
var url = require('url');
const port = 3000;
var dbCollection = 'ProductosData'
var firebase = require("firebase/app");


function revAPIOwner(api) {
    if (api === "AlzaJGCDEV") {
        return "[ADMIN-DEV] JeremyGomez"
    } else if (api === "Alza1405J") {
        return "[TEST] Jeremy Gomez"
    } else if (api === "AlzaJJ01") {
        return "Jeremy Gomez"
    } else {
        return "???"
    }
}

function revAPIValidate(api) {
    if (api === "AlzaJGCDEV") {
        return true
    } else if (api === "Alza1405J") {
        return true
    } else if (api === "AlzaJJ01") {
        return true
    } else {
        return false
    }
}

// Add the Firebase products that you want to use
require("firebase/firestore");

var firebaseConfig = {
    apiKey: "AIzaSyBroxZ7MFy2cXE10I38UY8xTgjnQFAc6dw",
    authDomain: "tienda-de-productos1.firebaseapp.com",
    projectId: "tienda-de-productos1",
    storageBucket: "tienda-de-productos1.appspot.com",
    messagingSenderId: "286525481195",
    appId: "1:286525481195:web:ad2e95bcec80cb008d5eae"
}

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();



app.get("/", (req, res) => {
    res.send('Request denied. <br> <br> Error: <b>BadRequest-NoParams</b>');
});

app.get("/doc", async (req, res) => {
    var q = url.parse(req.url, true).query
    //res.send({data: {code: q.code, api: q.api}})

    if (q.code || q.apiKey) {
        if (revAPIValidate(q.apiKey)) {
            var finalq = (q.code).toUpperCase();
            //ingresar firebase
            const pp = db.collection(dbCollection).doc(finalq);
            const doc = await pp.get();
            if (!doc.exists) {
            console.log('No such document!');
            } else {
            res.send({data: doc.data(), requestData: {APIKey: q.apiKey, code: finalq, APIOwner: revAPIOwner(q.apiKey), reqCode: 200}});
            }
        } else {
            res.send('Request denied. <br> <br> Error: <b>BadRequest-APIKey is invalid</b>')  
        }
    } else {
        res.send('Request denied. <br> <br> Error: <b>BadRequest-NoParams</b>');
    }
})

app.get("/colle", async (req, res) => {
    var q = url.parse(req.url, true).query
    //res.send({data: {code: q.code, api: q.api}})
    if (q.code || q.collection || q.apiKey) {
        if (revAPIValidate(q.apiKey)) {
            var ccode = q.code;
            if (ccode === undefined) {
                ccode = 'a'
            }
            var finalq = ccode.toUpperCase();
            var colle = q.collection
            if (colle === undefined) {
                colle = 'nada'
            }
            var collectionList = [];
            //ingresar firebase
            const citiesRef = db.collection(colle);
            const snapshot = await citiesRef.get();
            if (snapshot.empty) {
            console.log('No matching documents.');
            res.send({result: '404', error: 'Collection not found', requestData: {collection: colle}})
            return;
            }  

            snapshot.forEach(doc => {
                var docid = doc.id;
                var docdata = doc.data()
                collectionList.push({docid: docdata})
            });
            res.send({result: '200', res: collectionList, requestData: {APIKey: q.apiKey, code: finalq, APIOwner: revAPIOwner(q.apiKey), reqCode: 200}})
        } else {
            res.send('Request denied. <br> <br> Error: <b>BadRequest-APIKey is invalid</b>')
        }
    } else {
        res.send('Request denied. <br> <br> Error: <b>BadRequest-NoParams</b>');
    }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


