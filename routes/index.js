var express = require('express');
var router = express.Router();

const { connectToDB, ObjectId} = require('../utils/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//router.post('/booking', async function(req, res) {
//   var response = {
//     headers: req.headers,
//     body: req.body
//   };
//   res.json(response);
// });

router.post('/booking', async function(req, res){
  const db = await connectToDB();
  try{
    req.body.numTickets = parseInt(req.body.numTickets);
    req.body.terms = req.body.terms;
    req.body.created_at = new Date();
    req.body.modified_at = new Date();

    let result = await db.collection("bookings").insertOne(req.body);
    res.status(201).json({ id: result.insertedId
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  } finally {
    await db.client.close();
  }
});

// res.render: render a view template，
// 使用1. bookings.ejs模板，2.bookings接受 result 作为变量

router.get('/booking', async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db.collection("bookings").find().toArray();
    res.render('bookings', { bookings: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  } finally {
    await db.client.close();
  }
})

/* Display a single Booking */
router.get('/booking/read/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db.collection("bookings").findOne({ _id: new ObjectId(req.params.id) });
    if (result) {
      res.render('booking', { booking: result });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// Delete a single Booking
// deleteCOunt 检测删除情况
router.post('/booking/delete/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db.collection("bookings").deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Booking deleted" });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// display the update form
router.get('/booking/update/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db.collection("bookings").findOne({ _id: new ObjectId(req.params.id) });
    if (result) {
      res.render('update', { booking: result });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// Update a single Booking
router.post('/booking/update/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    req.body.numTickets = parseInt(req.body.numTickets);
    req.body.terms = req.body.terms? true : false;
    req.body.superhero = req.body.superhero || "";
    req.body.modified_at = new Date();

    let result = await db.collection("bookings").updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Booking updated" });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

module.exports = router;
