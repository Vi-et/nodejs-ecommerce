FROM node:20-alpine

# Thư mục làm việc bên trong container
WORKDIR /usr/src/app

# Chỉ copy package.json và package-lock.json trước để tận dụng cache của Docker
COPY package*.json ./

# Cài đặt các gói thư viện
RUN npm install

# Copy toàn bộ mã nguồn còn lại
COPY . .

# Expose cổng (bạn có thể thay đổi số này dự trên cổng app của bạn, mặc định Node hay dùng 3000)
EXPOSE 3000

# Lệnh mặc định khởi động app
CMD ["npm", "run", "dev"]
