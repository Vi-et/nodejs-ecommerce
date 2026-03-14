# --- GIAI ĐOẠN 1: Xưởng mộc & Máy xay ---
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Đã sửa: Gọi đúng tên hãng (@vercel/ncc) và thêm giấy ủy quyền (-y)
RUN npx -y @vercel/ncc build server.js -o dist


# --- GIAI ĐOẠN 2: Nhà mới ---
FROM node:20-alpine
WORKDIR /usr/src/app

# Cấp quyền sở hữu thư mục cho người dùng node ngay từ đầu
RUN chown node:node /usr/src/app

# Khi copy file sang, cũng phải dán nhãn là của người dùng node luôn
COPY --from=builder --chown=node:node /usr/src/app/dist/index.js ./

# Bây giờ mới chuyển sang dùng người dùng node
USER node

EXPOSE 3000

CMD ["node", "index.js"]