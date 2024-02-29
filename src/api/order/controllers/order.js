("use strict");
/**
 * order controller
 */
const Razorpay = require("Razorpay");

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    try {
      const razorpay = new Razorpay({
        key_id: "rzp_test_eqZehvX5KFrQ5k",
        key_secret: "mOZzXQERtqwgQOzwIGphtDr9",
      });
        const options = ctx.request.body;
        const order = await razorpay.orders.create(options);
        if (!order) {
          return ctx.send("Error");
        }
        ctx.send(order);
    } catch (error) {
      return ctx.send({ error });
    }
  },
}));
