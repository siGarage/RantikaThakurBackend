'use strict';

/**
 * order-confirmation service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::order-confirmation.order-confirmation');
