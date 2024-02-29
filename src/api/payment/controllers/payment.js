"use strict";
const crypto = require("crypto");

/**
 * payment controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::payment.payment", ({ strapi }) => ({
  async create(ctx) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = ctx.request.body;
      const sha = crypto.createHmac("sha256", "mOZzXQERtqwgQOzwIGphtDr9");
      //order_id + "|" + razorpay_payment_id
      sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const digest = sha.digest("hex");
      if (digest !== razorpay_signature) {
        return ctx.send({ msg: "Transaction is not legit!" });
      }
      ctx.send({
        msg: "success",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
    } catch (error) {
      return ctx.send({ error });
    }
  },
}));
