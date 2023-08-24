// Set up
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');

// Configuration
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/contacts");

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Model
var Contact = mongoose.model('Contact', {
    name: String,
    lastName: String,
    email: String,
    phoneNumber: Number,
    description: String
});


// Get all contact items
app.get('/api/contacts', function (req, res) {

    console.log("Listing contacts items...");

    //use mongoose to get all contacts in the database
    Contact.find(function (err, contacts) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(contacts); // return all contacts in JSON format
    });
});

// Create a contact Item
app.post('/api/contacts', function (req, res) {

    console.log("Creating contact item...");

    Contact.create({
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        description: req.body.description,
        done: false
    }, function (err, contact) {
        if (err) {
            res.send(err);
        }

        // create and return all the contacts
        Contact.find(function (err, contacts) {
            if (err)
                res.send(err);
            res.json(contacts);
        });
    });

});

// Update a contact Item
app.put('/api/contacts/:id', function (req, res) {
    const contact = {
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        description: req.body.description
    };
    console.log("Updating item - ", req.params.id);
    Contact.update({_id: req.params.id}, contact, function (err, raw) {
        if (err) {
            res.send(err);
        }
        res.send(raw);
    });
});


// Delete a contact Item
app.delete('/api/contacts/:id', function (req, res) {
    Contact.remove({
        _id: req.params.id
    }, function (err, contact) {
        if (err) {
            console.error("Error deleting contact ", err);
        }
        else {
            Contact.find(function (err, contacts) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json(contacts);
                }
            });
        }
    });
});


// Start app and listen on port 8080  
app.listen(process.env.PORT || 8080);
console.log("Contact server listening on port  - ", (process.env.PORT || 8080));