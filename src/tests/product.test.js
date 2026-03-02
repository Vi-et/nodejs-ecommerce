const redisPubSubService = require("../services/redisPubsub.service");

class ProductServiceTest {

    purchaseProduct(productId, quantity){
        const order = {
            productId,
            quantity,
        }

        redisPubSubService.publish("purchaseEvents", JSON.stringify(order));
    }
}

module.exports = new ProductServiceTest();