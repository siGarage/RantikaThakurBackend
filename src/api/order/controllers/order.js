("use strict");
// @ts-ignore
const stripe = require('stripe')(`${process.env.STRIPE_KEY}`);

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  
  async create(ctx) {
    // @ts-ignore
    const { products } = ctx.request.body;
    // @ts-ignore
    const {email}=ctx.request.body;
    try {
      const lineItems = await Promise.all(
        products.map(async (product) => {
          return {
            price_data: {
              currency: "inr",
              product_data: {
                name: product.attributes.title,
              },
              unit_amount: Math.round(Number(product.attributes.price)*100)/Number(product.attributes.quantity),
            },
            quantity: product.attributes.quantity
          };
        })
      );

      const session = await stripe.checkout.sessions.create({
        shipping_address_collection: { allowed_countries: ["IN"] },
        payment_method_types: ["card"],
        mode: "payment",
        success_url: process.env.CLIENT_URL + "/success",
        cancel_url: process.env.CLIENT_URL + "/fail",
        line_items: lineItems,
      });
      await strapi.service("api::order.order").create({ data: {email, products, stripeId: session.id } });


      return { stripeSession: session };
    }
    
    catch (error) {
      ctx.response.status = 500;
      return { error };
    }
  },
}));