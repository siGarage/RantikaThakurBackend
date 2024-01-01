'use strict';

/**
 * confirm-order service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::confirm-order.confirm-order');
