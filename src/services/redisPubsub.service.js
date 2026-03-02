const Redis = require("redis");

class RedisPubSubService {
    constructor() {
        this.subscriber = Redis.createClient({
            url: 'redis://127.0.0.1:6379'
        });
        this.publisher = Redis.createClient({
            url: 'redis://127.0.0.1:6379'
        });
        
        // Redis v4 yêu cầu phải connect trước khi sử dụng
        this.subscriber.connect().catch(console.error);
        this.publisher.connect().catch(console.error);
    }

    async publish(channel, message) {
        // Redis v4 hỗ trợ Promise, không cần wrap
        return await this.publisher.publish(channel, message);
    }

    async subscribe(channel, callback) {
        // Redis v4: subscribe(channel, listener)
        await this.subscriber.subscribe(channel, (message) => {
            callback(message);
        });
    }
}

module.exports = new RedisPubSubService();
