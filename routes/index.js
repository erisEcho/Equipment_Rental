var express = require('express');
var router = express.Router();

const { connectToDB, ObjectId} = require('../utils/db');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { currentPage: 'home' });
});


router.get('/equipments', async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db.collection("equipments").find().toArray();
    res.render('equipments', { equipments: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  } finally {
    await db.client.close();
  }
})

/* Display a single Equipment */
router.get('/equipment/detail/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db.collection("equipments").findOne({ _id: new ObjectId(req.params.id) });
    if (result) {
      res.render('equipment_detail', { equipment: result });
    } else {
      res.status(404).json({ message: "equipment not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

/* GET add page. */
router.get('/equipment/add', function(req, res) {
  res.render('add', { title: 'add' });
});


// display the update form
router.get('/equipment/edit/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db.collection("equipments").findOne({ _id: new ObjectId(req.params.id) });
    if (result) {
      res.render('edit', { equipment: result });
    } else {
      res.status(404).json({ message: "equipment not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// post part -------

/* POST Add Equipment */
router.post('/equipment/add', async function(req, res) {
  const db = await connectToDB();
  try {
    // 构造要插入的设备对象
    req.body.name=req.body.name;
    req.body.description=req.body.description;
    req.body.imageURL=req.body.imageURL;
    req.body.contactPerson=req.body.contactPerson;
    req.body.color=req.body.color;
    req.body.highlighted=req.body.highlighted === 'on';
    req.body.created_at=new Date();
    req.body.modified_at=new Date();


    await db.collection("equipments").insertOne(req.body);

    res.redirect('/equipments');
  } catch (error) {
    res.status(400).json({ error: error.message });
  } finally {
    await db.client.close();
  }
});

/* DELETE a Rental Equipment */
router.post('/equipment/delete/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db.collection("equipments").deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "equipment deleted" });
    } else {
      res.status(404).json({ message: "equipment not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});


// Delete a single Booking
// deleteCOunt 检测删除情况
router.post('/equipment/delete/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db.collection("equipments").deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "equipment deleted" });
    } else {
      res.status(404).json({ message: "equipment not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// Update a single Equipment
router.post('/equipment/update/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    req.body.name=req.body.name;
    req.body.description=req.body.description;
    req.body.imageURL=req.body.imageURL;
    req.body.contactPerson=req.body.contactPerson;
    req.body.color=req.body.color;
    req.body.highlighted=req.body.highlighted === 'on';

    req.body.modified_at=new Date();

    let result = await db.collection("equipments").updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "equipment updated" });
    } else {
      res.status(404).json({ message: "equipment not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

module.exports = router;
