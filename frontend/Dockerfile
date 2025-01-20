# Sử dụng phiên bản cụ thể của Node.js
FROM node:20.11.1

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép tệp package.json và package-lock.json từ thư mục frontend vào thư mục làm việc
COPY frontend/package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép toàn bộ nội dung thư mục frontend vào thư mục làm việc
COPY frontend .

# Mở cổng 5174
EXPOSE 5174

# Chạy ứng dụng
CMD ["npm", "run", "dev"]
