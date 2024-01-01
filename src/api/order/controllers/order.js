"use strict";
// @ts-ignore
const stripe = require('stripe')(`${process.env.STRIPE_KEY}`);
const { createCoreController } = require("@strapi/strapi").factories;

const createLineItem = (product) => ({
  price_data: {
    currency: "inr",
    product_data: {
      name: `${product.attributes.title} ,Size:${product.attributes.size}`,
      description: `Size: ${product.attributes.size}`
    },
    
    unit_amount: Math.round(Number(product.attributes.price) * 100) / Number(product.attributes.quantity),
  },
  quantity: product.attributes.quantity,

});

const createPromotionCode = async () => {
  return await stripe.promotionCodes.create({ coupon: 'jUHWds4Q' });
};

const createCheckoutSession = async (lineItems) => {
  return await stripe.checkout.sessions.create({
    shipping_address_collection: { allowed_countries: ["IN"] },
    payment_method_types: ["card"],
    mode: "payment",
    allow_promotion_codes: true,
    success_url: `${process.env.CLIENT_URL}/success?&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: process.env.CLIENT_URL + "/fail",
    line_items: lineItems,
  });
};

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    try {
      // @ts-ignore
      const { products } = ctx.request.body;
      
      const lineItems = await Promise.all(products.map(createLineItem));
      console.log(lineItems)
      const promotionCode = await createPromotionCode();
      const session = await createCheckoutSession(lineItems);

      return { stripeSession: session};
    } catch (error) {
      ctx.response.status = 500;
      return { error };
    }
  },
}));


