const amqp = require('amqplib');
const messages = 'alo ajinomoto';

/**
 * Script này đóng vai trò là một Producer (người gửi tin nhắn) vào RabbitMQ.
 * Điểm đặc biệt của kịch bản này là nó mô phỏng việc thiết lập Dead Letter Exchange (DLX).
 * Khi tin nhắn gửi vào hàng đợi chính (NotificationQueueProcess) mà không có ai xử lý 
 * (consume) trong một khoảng thời gian quy định (ở đây là 10 giây - expiration: '10000'), 
 * tin nhắn đó sẽ bị "chết" (dead) và tự động bị đẩy sang một Exchange dự phòng (notificationExDLX)
 * cùng với một Routing Key (notificationRoutingKeyDLX) để đi vào hàng đợi lỗi (HotFix queue).
 */
const runProducer = async () => {
    try {
        // 1. Kết nối tới Message Broker (RabbitMQ) chạy ở localhost
        const connection = await amqp.connect('amqp://guest:guest@localhost')
        // Tạo một channel (kênh giao tiếp) trên connection này
        const channel = await connection.createChannel()

        // 2. Khai báo các tên Exchange và Queue cho luồng xử lý chính thức (Normal Routing)
        const notificationExchange = 'notificationEx' // Exchange chính
        const notiQueue = 'NotificationQueueProcess' // Hàng đợi chính sẽ nhận tin nhắn

        // 3. Khai báo các tên dùng cho luồng xử lý lỗi (Dead Letter/Fallback)
        const notificationExchangeDLX = 'notificationExDLX' // Exchange dành cho tin nhắn lỗi/hết hạn
        const notificationRoutingKey = 'notificationRoutingKeyDLX' // Routing key định tuyến cho tin nhắn lỗi

        // 4. Khởi tạo Exchange chính
        // Loại exchange là 'direct'. durable: true (Lưu thông tin exchange xuống đĩa phòng khi RabbitMQ restart)
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        })

        // 5. Khởi tạo hàng đợi chính và CẤU HÌNH DLX CHO HÀNG ĐỢI NÀY
        // Bất kỳ tin nhắn nào trong hàng đợi này (notiQueue) bị từ chối (reject, nack) hoặc hết hạn (TTL expire)
        // sẽ tự động được gửi tới `deadLetterExchange` kèm theo `deadLetterRoutingKey`
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false, // Cho phép các connection khác truy cập vào queue này (không khóa độc quyền)
            durable: true, // Lưu lại tin nhắn xuống đĩa
            deadLetterExchange: notificationExchangeDLX, // Nếu tin nhắn "chết", ném nó vào Exchange này
            deadLetterRoutingKey: notificationRoutingKey // Khi ném sang DLX, gắn theo Routing Key này
        })

        // 6. Liên kết hàng đợi chính với Exchange chính
        await channel.bindQueue(queueResult.queue, notificationExchange)

        // 7. Gửi một tin nhắn trực tiếp vào hàng đợi chính (notiQueue)
        // Thiết lập thời gian sống (TTL - Time-To-Live) của tin nhắn này là 10000ms (10 giây)
        // Tức là nếu qua 10s mà không có Consumer nào lấy tin nhắn này ra xử lý, nó sẽ tự chết và bị đẩy vào DLX
        channel.sendToQueue(notiQueue, Buffer.from(messages),{
            expiration: '10000'
        })

        console.log(`message sent::`, messages);

        // Đóng kết nối sau 0.5 giây để đảm bảo tin nhắn đã được đẩy lên server RabbitMQ
        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        // Bắt và in ra lỗi nếu có trục trặc trong quá trình kết nối/gửi
        console.error(`erro::`, error)
    }
}

// Chạy hàm runProducer
runProducer().then(rs => console.log(rs)).catch(console.error)