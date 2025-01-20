require('dotenv').config();
const express = require('express');
const https = require('https');
const path = require('path');
const cors = require('cors');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');


const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const directMessageRoutes = require('./routes/directMessageRoutes');
const conversationMemberRoutes = require('./routes/conversationMemberRoutes');
const messageRoutes = require('./routes/messageRoutes');
const messageReadRoutes = require('./routes/messageReadRoutes');
const shippingFeeControllerRoutes = require('./routes/shippingFeeControllerRoutes');
const manufacturerRoutes = require('./routes/manufacturerRoutes');
const discountRoutes = require('./routes/discountRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const translationRoutes = require('./routes/translationRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const productRoutes = require('./routes/productRoutes');
const batchRoutes = require('./routes/batchRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const cartRoutes = require('./routes/cartRoutes');
const addressRoutes = require('./routes/addressRoutes');

const timeUtils = require('./utils/time');

const refreshRoutes = require('./routes/refreshRoutes');
const initializeSocket = require('./config/socket');
const fs = require('fs');

const upload = require('./config/multerConfig');

const options = {
  key: fs.readFileSync('D:/EnvTest/SSL key/key.pem'),
  cert: fs.readFileSync('D:/EnvTest/SSL key/certificate.pem'),
};

const app = express();
const server = https.createServer(options, app);
const io = initializeSocket(server);

app.use(express.json());
app.use(cookieParser());

// CORS configuration
// const corsOptions = {
//   origin: (origin, callback) => {
//     // Kiểm tra nếu origin là một trong hai nguồn cho phép
//     if (origin === 'http://localhost:5174' || origin === 'http://192.168.0.102:5174') {
//       callback(null, true);  // Cho phép kết nối
//     } else {
//       callback(new Error('CORS không được phép từ origin này'), false);  // Không cho phép kết nối từ origin khác
//     }
//   },
//   credentials: true,  // Đảm bảo gửi cookies qua CORS
//   methods: ["GET", "POST", "PUT", "DELETE"],  // Các phương thức HTTP được phép
//   allowedHeaders: ["Content-Type", "Authorization"],  // Các header được phép
// };

const corsOptions = {
  origin: 'https://192.168.0.102:5174', // Chỉ định một nguồn cụ thể
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Routes warehouseRoutes const uploadRoutes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/directMessage', directMessageRoutes);
app.use('/api/conversation', conversationRoutes);
app.use('/api/conversationMember', conversationMemberRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/messageRead', messageReadRoutes);
app.use('/api/shippingFree', shippingFeeControllerRoutes);
app.use('/api/manufacturers', manufacturerRoutes);
app.use('/api/discountRoutes', discountRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api', uploadRoutes);
app.use('/api/translations', translationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api', productRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/addresses', addressRoutes);

app.use('/api', refreshRoutes);

// Serve React frontend
const buildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(buildPath));

// Serve Swagger API documentation
const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'swagger.yaml'));
const swaggerOptions = {
  swaggerOptions: {
    docExpansion: 'none', // Tùy chỉnh cách mở rộng API docs
    defaultModelExpandDepth: 2, // Tùy chỉnh độ sâu mở rộng model
    displayOperationId: false, // Ẩn Operation ID (không hiển thị mã số của mỗi API)
  }
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
app.get('/api/geo/getList', (req, res) => {
  const filePath = path.join(__dirname, 'assets', 'Geographic Information JSON', 'geoList.json');
  
  // Đọc file JSON và trả về nội dung của nó
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Lỗi khi đọc file' });
      return;
    }
    
    try {
      const jsonData = JSON.parse(data); // Parse dữ liệu JSON từ file
      res.json({ success: true, data: jsonData }); // Trả về dữ liệu JSON
    } catch (parseErr) {
      res.status(500).json({ success: false, message: 'Lỗi khi parse dữ liệu JSON' });
    }
  });
});


// Set the path to the directory containing the files
const mediaPath = path.join(__dirname, 'media');
const uploadPath = path.join(__dirname, 'uploads');

// Create a static route for the entire 'media' directory
app.use('/api/media', express.static(mediaPath));
app.use('/uploads', express.static(uploadPath));

// Catch-all handler for React
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
const IP_ADDRESS = '192.168.0.102';
server.listen(PORT, IP_ADDRESS, async () => {
  console.log(`Server is running on https://${IP_ADDRESS}:${PORT}`);

  console.log('Thời gian hiện tại (UTC):', new Date().toISOString());
  console.log('Thời gian hiện tại (Local):', new Date().toLocaleString());
  console.log('Thời gian hiện tại (test):', timeUtils.toVNTime(new Date()));

  await sequelize.sync();
});

// const IP_ADDRESS = "localhost"; // Đổi sang localhost
// server.listen(PORT, IP_ADDRESS, async () => {
//   console.log(`Server is running on http://${IP_ADDRESS}:${PORT}`);

//   console.log("Thời gian hiện tại (UTC):", new Date().toISOString());
//   console.log("Thời gian hiện tại (Local):", new Date().toLocaleString());

//   await sequelize.sync();
// });
