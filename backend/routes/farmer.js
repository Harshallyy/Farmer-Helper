const router = require("express").Router();
const { validateParams } = require("../Common/Validate");
const Farmer = require("../models/farmer");
const Inventory = require("../models/inventory");
const Orders = require("../models/orders");
const Message = require("../models/message");
const Consumer = require("../models/consumer");
const jwt = require("jsonwebtoken");
const { verifyTokenFarmer } = require("../Common/VerifyToken");
const bcrypt = require("bcryptjs");

require("dotenv").config();

// get farmer profile details
router.route("/details").get(verifyTokenFarmer, async (req, res) => {
  try {
    const result = await Farmer.findById(req.user._id).select("-password");
    res
      .status(200)
      .json({ statusCode: 200, message: "fetched farmer's details", result });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
});

// change password
router.route("/changePassword").post(verifyTokenFarmer, async (req, res) => {
  try {
    if (!validateParams([req.body.oldPassword, req.body.newPassword])) {
      return res
        .status(400)
        .json({ statusCode: 400, message: "Params missing" });
    } else {
      const farmer = await Farmer.findById(req.user._id);
      if (bcrypt.compareSync(req.body.oldPassword, farmer.password)) {
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(req.body.newPassword, salt);
        farmer.password = hash;
        const result = await farmer.save();
        result.password = undefined;
        res
          .status(200)
          .json({ statusCode: 200, message: "changed password", result });
      } else {
        return res
          .status(403)
          .json({ statusCode: 403, message: "incorrect password" });
      }
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
});

// farmer register
router.route("/add").post(async (req, res) => {
  try {
    if (!validateParams([req.body.username, req.body.password])) {
      return res.status(400).json({
        statusCode: 400,
        message: "Params missing, username and password required",
      });
    } else {
      const salt = bcrypt.genSaltSync(12);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const newFarmer = new Farmer({
        username: req.body.username,
        password: hash,
      });

      const result = await newFarmer.save();
      result.password = undefined;
      res
        .status(200)
        .json({ statusCode: 200, message: "added farmer", result });
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
});

// farmer login
router.route("/login").post(async (req, res) => {
  try {
    if (!validateParams([req.body.username, req.body.password])) {
      return res.status(400).json({
        statusCode: 400,
        message: "Params missing, username and password required",
      });
    } else {
      const farmer = await Farmer.findOne({ username: req.body.username });
      if (farmer && bcrypt.compareSync(req.body.password, farmer.password)) {
        var token = jwt.sign(
          { _id: farmer._id, username: farmer.username },
          process.env.PRIVATE_KEY_FARMERS,
        );
        res
          .status(200)
          .json({ statusCode: 200, message: "authenticated", token });
      } else {
        return res
          .status(403)
          .json({ statusCode: 403, message: "incorrect username or password" });
      }
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
});

// get inventory details
router.route("/inventory").get(verifyTokenFarmer, async (req, res) => {
  try {
    const result = await Inventory.find({ farmerId: req.user._id });
    res.status(200).json({ statusCode: 200, message: "fetched items", result });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
});

// add item to inventory
router.route("/inventory/add").post(verifyTokenFarmer, async (req, res) => {
  try {
    if (
      !validateParams([
        req.body.crop,
        req.body.quantity,
        req.body.units,
        req.body.price,
      ])
    ) {
      return res
        .status(400)
        .json({ statusCode: 400, message: "Params missing" });
    } else {
      const newItem = new Inventory({ ...req.body, farmerId: req.user._id });
      const result = await newItem.save();
      res.status(200).json({ statusCode: 200, message: "added item", result });
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
});

// update item in inventory
router.route("/inventory/update").put(verifyTokenFarmer, async (req, res) => {
  try {
    if (
      !validateParams([
        req.body.crop,
        req.body.quantity,
        req.body.units,
        req.body.price,
      ])
    ) {
      return res
        .status(400)
        .json({ statusCode: 400, message: "Params missing" });
    } else {
      const newItem = await Inventory.findOne({
        _id: req.body._id,
        farmerId: req.user._id,
      });

      if (newItem) {
        newItem.crop = req.body.crop;
        newItem.quantity = req.body.quantity;
        newItem.units = req.body.units;
        newItem.price = req.body.price;

        const result = await newItem.save();
        res
          .status(200)
          .json({ statusCode: 200, message: "updated item", result });
      } else {
        return res
          .status(404)
          .json({ statusCode: 404, message: "cannot find item" });
      }
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
});

// remove item from inventory
router
  .route("/inventory/remove/:id")
  .delete(verifyTokenFarmer, async (req, res) => {
    try {
      const result = await Inventory.findOneAndDelete({
        _id: req.params.id,
        farmerId: req.user._id,
      });

      if (result) {
        res
          .status(200)
          .json({ statusCode: 200, message: "removed item", result });
      } else {
        return res
          .status(404)
          .json({ statusCode: 404, message: "cannot find item" });
      }
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  });

// get all order details
router.route("/order").get(verifyTokenFarmer, async (req, res) => {
  try {
    const result = await Orders.find({ farmer: req.user._id }).populate(
      "itemId",
    );
    res
      .status(200)
      .json({ statusCode: 200, message: "fetched orders", result });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
});

// add order
router.route("/order").post(verifyTokenFarmer, async (req, res) => {
  try {
    if (
      !validateParams([
        req.body.itemId,
        req.body.quantity,
        req.body.units,
        req.body.price,
        req.body.consumerName,
        req.body.consumerEmail,
        req.body.consumerPhone,
      ])
    ) {
      return res
        .status(400)
        .json({ statusCode: 400, message: "Params missing" });
    } else {
      const newOrder = Orders({ ...req.body, farmer: req.user._id });
      newOrder.status = 0;
      const result = await newOrder.save();

      res
        .status(200)
        .json({ statusCode: 200, message: "created order", result });
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
});

// update order
router.route("/order/:id").put(verifyTokenFarmer, async (req, res) => {
  try {
    if (
      !validateParams([
        req.body.itemId,
        req.body.quantity,
        req.body.units,
        req.body.price,
        req.body.status,
        req.body.consumerName,
        req.body.consumerEmail,
        req.body.consumerPhone,
      ])
    ) {
      return res.status(400).json({
        statusCode: 400,
        message: "Params missing",
      });
    }

    const order = await Orders.findOne({
      farmer: req.user._id,
      _id: req.params.id,
    });

    if (!order) {
      return res.status(404).json({
        statusCode: 404,
        message: "order not found",
      });
    }

    const oldStatus = Number(order.status);
    const newStatus = Number(req.body.status);

    // If order is already confirmed, restore old quantity
    // before changing item/quantity/status.
    if (oldStatus === 1) {
      const oldItem = await Inventory.findById(order.itemId);

      if (oldItem) {
        oldItem.quantity += order.quantity;
        await oldItem.save();
      }
    }

    order.itemId = req.body.itemId;
    order.quantity = req.body.quantity;
    order.units = req.body.units;
    order.price = req.body.price;
    order.status = newStatus;
    order.consumerName = req.body.consumerName;
    order.consumerEmail = req.body.consumerEmail;
    order.consumerPhone = req.body.consumerPhone;

    const item = await Inventory.findOne({
      _id: order.itemId,
      farmerId: req.user._id,
    });

    if (!item) {
      return res.status(404).json({
        statusCode: 404,
        message: "item not found",
      });
    }

    // If order is being confirmed, deduct quantity.
    if (newStatus === 1) {
      if (item.quantity < order.quantity) {
        return res.status(403).json({
          statusCode: 403,
          message: "insufficient quantity of given item",
        });
      }

      item.quantity -= order.quantity;
      await item.save();
    }

    const result = await order.save();

    res.status(200).json({
      statusCode: 200,
      message: "updated order",
      result,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: err.message,
    });
  }
});

// remove order
router.route("/order/:id").delete(verifyTokenFarmer, async (req, res) => {
  try {
    if (!validateParams([req.body.status])) {
      return res.status(400).json({
        statusCode: 400,
        message: "Params missing",
      });
    }

    const order = await Orders.findOne({
      farmer: req.user._id,
      _id: req.params.id,
    });

    if (!order) {
      return res.status(404).json({
        statusCode: 404,
        message: "order not found",
      });
    }

    const oldStatus = Number(order.status);
    const newStatus = Number(req.body.status);

    // Restore inventory when a confirmed order is cancelled/pending
    if (oldStatus === 1 && newStatus !== 1) {
      const item = await Inventory.findById(order.itemId);

      if (item) {
        item.quantity += order.quantity;
        await item.save();
      }
    }

    order.status = newStatus;

    const result = await order.save();

    res.status(200).json({
      statusCode: 200,
      message: "updated order status",
      result,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: err.message,
    });
  }
});

// get messages
router.route("/message").get(verifyTokenFarmer, async (req, res) => {
  try {
    const result = await Message.find({ farmer: req.user._id }).populate(
      "consumer",
    );
    res
      .status(200)
      .json({ statusCode: 200, message: "fetched messages", result });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
});

// send message
router.route("/message/send").post(verifyTokenFarmer, async (req, res) => {
  try {
    if (!validateParams([req.body.consumer, req.body.message])) {
      return res
        .status(400)
        .json({ statusCode: 400, message: "Params missing" });
    } else {
      const consumer = await Consumer.findById(req.body.consumer);
      if (consumer) {
        const message = new Message({ ...req.body, from: 0 });
        const result = await message.save();
        res
          .status(200)
          .json({ statusCode: 200, message: "sent messages", result });
      } else {
        return res
          .status(404)
          .json({ statusCode: 404, message: "consumer not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
});

module.exports = router;
