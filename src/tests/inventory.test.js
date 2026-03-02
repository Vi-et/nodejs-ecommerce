const redisPubSubService = require("../services/redisPubsub.service");

class InventoryServiceTest {
    constructor() {
        redisPubSubService.subscribe("purchaseEvents", (message) => {
            InventoryServiceTest.updateInventory(message)
        });
    }

    static updateInventory(productId, quantity) {
        console.log(`Updating inventory for product ${productId} with quantity ${quantity}`);   
    }
}

module.exports = new InventoryServiceTest();