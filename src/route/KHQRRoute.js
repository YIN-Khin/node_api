const { generateKHQR, verifyPayment } = require('../controller/KHQRController');

const KHQRRoutes = (app) => {
  // Generate KHQR code for payment
  app.post('/api/khqr/generate', generateKHQR);
  
  // Verify payment status
  app.get('/api/khqr/verify/:md5', verifyPayment);
  app.get('/api/khqr/verify/bill/:billNumber', verifyPayment);
};

module.exports = KHQRRoutes;
