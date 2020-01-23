const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const filter = require("../middleware/filter");
const Offer = require("../models/Offer");

router.post("/offer/publish", isAuthenticated, async (req, res) => {
  try {
    const newOffer = new Offer({
      title: req.fields.title,
      description: req.fields.description,
      price: req.fields.price,
      creator: req.user
    });

    await newOffer.save();
    res.json({
      title: newOffer.title,
      description: newOffer.description,
      price: newOffer.price,
      created: newOffer.created,
      creator: {
        account: {
          username: offer.creator.username,
          phone: offer.creator.phone
        },
        _id: req.user._id
      }
    });
  } catch (error) {
    res.status(400).json({ message: "An error occured" });
  }
});

router.get("/offer/with-count", filter, async (req, res) => {
  let offers = "";

  try {
    if (req.filter) {
      offers = Offer.find(req.filter).populate({
        path: "creator",
        select: "account"
      });
    } else {
      offers = Offer.find().populate({ path: "creator", select: "account" });
    }
    offers.count = offers.length;

    if (req.query.sort === "price-asc") {
      offers.sort({ price: 1 });
    }
    if (req.query.sort === "price-desc") {
      offers.sort({ price: -1 });
    }
    if (req.query.sort === "date-asc") {
      offers.sort({ created: 1 });
    }
    if (req.query.sort === "date-desc") {
      offers.sort({ created: -1 });
    }

    if (req.query.page) {
      const page = req.query.page;
      const limit = 2;
      await offers.limit(limit).skip(limit * (page - 1));
    }
    const offer = await offers;
    res.json({
      count: offers.count,
      offer
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/offer/:id", async (req, res) => {
  console.log(req.params.id);
  const id = req.params.id;
  try {
    const userOffer = await Offer.find({ creator: id }).populate({
      path: "creator",

      select: "account"
    });

    res.json(userOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
