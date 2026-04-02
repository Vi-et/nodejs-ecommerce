# Node.js E-commerce Backend (ShopDev)

Chào mừng bạn đến với dự án **Node.js Ecommerce Backend**, một hệ thống backend thương mại điện tử mạnh mẽ, có khả năng mở rộng cao, được xây dựng với các công nghệ hiện đại nhất.

## 🚀 Tính năng chính

- **Xác thực & Phân quyền**: Đăng ký/đăng nhập với mã hóa mật khẩu, hỗ trợ OTP, phân quyền dựa trên logic Role-Resource (RBAC/AccessControl).
- **Quản lý sản phẩm (SPU/SKU)**: Kiến trúc sản phẩm linh hoạt cho phép quản lý hàng biến thể, thuộc tính đa dạng.
- **Hệ thống Giỏ hàng & Giảm giá**: Quản lý giỏ hàng realtime, hệ thống mã giảm giá (Discount) với nhiều điều kiện áp dụng.
- **Hệ thống Kiểm kê (Inventory)**: Tự động cập nhật số lượng tồn kho khi có giao dịch.
- **Hệ thống Thông báo**: Tích hợp thông báo qua nhiều kênh (email, hệ thống).
- **Tải lên tệp tin**: Hỗ trợ tải lên AWS S3 và Cloudinary với tính năng ký URL (presigned URLs).
- **Hệ thống Logging tập trung**: Sử dụng Winston và Daily Rotate File để theo dõi hoạt động hệ thống.
- **Hệ thống Messaging**: Tích hợp RabbitMQ và Kafka để xử lý các tác vụ bất đồng bộ và streaming dữ liệu.
- **Công cụ tìm kiếm**: Tích hợp Elasticsearch cho các tính năng tìm kiếm sản phẩm nâng cao.

## 🛠 Công nghệ sử dụng

- **Core**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Caching & Pub/Sub**: Redis (ioredis)
- **Message Broker**: RabbitMQ, Apache Kafka
- **Search Engine**: Elasticsearch, Kibana
- **Storage**: AWS S3, Cloudinary
- **Logging**: Winston
- **Security**: Helmet, Bcrypt, JWT, AccessControl
- **Infrastructure**: Docker, Docker Compose

## 📁 Cấu trúc thư mục

```text
src/
├── auth/           # Logic xác thực & Token (JWT, KeyToken)
├── configs/        # Cấu hình môi trường (DB, Redis, AWS...)
├── controllers/    # Xử lý các HTTP request
├── core/           # Xử lý phản hồi (Success/Error handlers)
├── dbs/            # Khởi tạo kết nối Databases (Mongo, Redis...)
├── helpers/        # Các hàm tiện ích dùng chung
├── loggers/        # Cấu hình Winston log
├── middlewares/    # Các middleware lọc request (Auth, RBAC...)
├── models/         # Định nghĩa schema dữ liệu (Mongoose)
├── repositories/   # Tương tác trực tiếp với Database
├── routes/         # Định nghĩa các endpoint API
├── services/       # Chứa logic nghiệp vụ (Business Logic)
├── utils/          # Các hàm phụ trợ kỹ thuật
└── validation/     # Kiểm tra tính hợp lệ dữ liệu đầu vào
```

## ⚙️ Cài đặt & Chạy ứng dụng

### 📋 Yêu cầu hệ thống
- **Node.js**: v18.x hoặc cao hơn
- **Docker**: (Khuyên dùng để cài đặt hạ tầng nhanh chóng)

### 1. Clone dự án
```bash
git clone https://github.com/Vi-et/nodejs-ecommerce.git
cd nodejs-ecommerce
```

### 2. Cấu hình môi trường
Tạo tệp `.env` dựa trên các thông số cần thiết (DB_HOST, REDIS_URL, KAFKA_HOST, AWS_ACCESS_KEY,...).

### 3. Chạy với Docker (Khuyên dùng)
Dự án đã được cấu hình sẵn Docker Compose bao gồm tất cả các micro-services cần thiết (Redis, Kafka, Mongo, Elasticsearch, RabbitMQ).

```bash
docker-compose up -d
```

Ứng dụng sẽ khả dụng tại: `http://localhost:3000`

### 4. Chạy trực tiếp (Localdevelopment)
Nếu bạn muốn chạy trực tiếp bằng node:
```bash
npm install
npm run dev
```

## 📝 Scripts
- `npm start`: Chạy ứng dụng production.
- `npm run dev`: Chạy ứng dụng ở chế độ development với Nodemon.

---
💡 *Dự án này là một ví dụ điển hình về việc xây dựng hệ thống phân tán và xử lý tải cao trong Node.js.*