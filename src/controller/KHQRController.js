/**
 * Generate KHQR Code using Bakong API
 * Creates a scannable QR code through official Bakong system
 */

const crypto = require('crypto');
const axios = require('axios');

// Helper function to generate MD5 hash for verification
function generateMD5(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

const generateKHQR = async (req, res) => {
  try {
    const { amount, currency = 'USD', billNumber } = req.body;

    // Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    const wingAccount = process.env.WING_ACCOUNT_NUMBER_USD || '100169854';
    const wingName = process.env.WING_ACCOUNT_NAME || 'YIN KHIN';
    const bakongToken = process.env.BAKONG_ACCESS_TOKEN;
    const bakongMerchantId = process.env.BAKONG_MERCHANT_ID;
    const bakongApiUrl = process.env.BAKONG_API_URL || 'https://api-bakong.nbc.gov.kh/v1';
    const finalBillNumber = billNumber || `INV-${Date.now()}`;

    console.log('🔐 Generating KHQR with:');
    console.log('   Amount:', amount, currency);
    console.log('   Bill Number:', finalBillNumber);
    console.log('   Wing Account:', wingAccount);
    console.log('   Account Name:', wingName);
    console.log('   Bakong Token:', bakongToken ? 'Present' : 'Missing');
    console.log('   Bakong Merchant ID:', bakongMerchantId || 'Missing');

    // Try using Bakong API if token is available
    if (bakongToken && bakongMerchantId) {
      try {
        console.log('📡 Calling Bakong API...');
        
        const bakongResponse = await axios.post(
          `${bakongApiUrl}/payment/qr/generate`,
          {
            merchantId: bakongMerchantId,
            accountId: wingAccount,
            merchantName: wingName,
            amount: parseFloat(amount),
            currency: currency === 'KHR' ? 'KHR' : 'USD',
            billNumber: finalBillNumber,
            terminalLabel: 'POS001',
            storeLabel: 'POS System'
          },
          {
            headers: {
              'Authorization': `Bearer ${bakongToken}`,
              'Content-Type': 'application/json'
            },
            timeout: 10000
          }
        );

        if (bakongResponse.data && bakongResponse.data.data) {
          const qrCode = bakongResponse.data.data.qr || bakongResponse.data.data.qrCode;
          const md5Hash = generateMD5(qrCode);
          
          console.log('✅ Bakong API success!');
          console.log('   QR Code length:', qrCode.length);
          console.log('   MD5 Hash:', md5Hash);
          
          return res.status(200).json({
            success: true,
            data: {
              qrCode: qrCode,
              qrImage: bakongResponse.data.data.qrImage || null,
              md5Hash: md5Hash,
              amount: amount,
              currency: currency,
              accountNumber: wingAccount,
              accountName: wingName,
              billNumber: finalBillNumber,
              expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
              method: 'bakong_api',
              note: 'Official Bakong KHQR - Scan with any bank app',
              verificationUrl: 'https://bakong.nbc.gov.kh/check-transaction',
              merchantId: bakongMerchantId
            }
          });
        }
      } catch (bakongError) {
        console.error('❌ Bakong API error:', bakongError.response?.data || bakongError.message);
        console.log('⚠️  Falling back to manual KHQR generation...');
        // Continue to fallback method below
      }
    } else {
      console.log('⚠️  Bakong credentials not configured, using manual generation');
    }

    // Fallback: Generate KHQR manually using EMVCo format
    console.log('📝 Generating KHQR manually...');
    
    // Helper function to create TLV format
    function createTLV(tag, value) {
      if (!value) return '';
      const length = value.length.toString().padStart(2, '0');
      return `${tag}${length}${value}`;
    }

    // Helper function to calculate CRC16
    function calculateCRC16(data) {
      let crc = 0xFFFF;
      for (let i = 0; i < data.length; i++) {
        crc ^= data.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
          if (crc & 0x8000) {
            crc = (crc << 1) ^ 0x1021;
          } else {
            crc = crc << 1;
          }
        }
      }
      return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    }

    let qrString = '';
    
    // Build EMVCo KHQR format
    qrString += createTLV('00', '01'); // Payload Format
    qrString += createTLV('01', '12'); // Dynamic QR
    
    // Merchant Account Information
    const merchantAccount = bakongMerchantId
      ? createTLV('00', 'kh.gov.nbc.bakong') + createTLV('01', bakongMerchantId) + createTLV('02', wingAccount)
      : createTLV('00', 'kh.com.wing') + createTLV('01', wingAccount) + createTLV('02', wingName);
    qrString += createTLV('29', merchantAccount);
    
    qrString += createTLV('52', '5999'); // Category Code
    qrString += createTLV('53', currency === 'KHR' ? '116' : '840'); // Currency
    qrString += createTLV('54', parseFloat(amount).toFixed(2)); // Amount
    qrString += createTLV('58', 'KH'); // Country
    qrString += createTLV('59', wingName); // Merchant Name
    qrString += createTLV('60', 'Phnom Penh'); // City
    
    // Additional Data
    const additionalData = createTLV('01', finalBillNumber) + createTLV('07', 'POS001');
    qrString += createTLV('62', additionalData);
    
    // CRC
    qrString += '6304';
    const crc = calculateCRC16(qrString);
    qrString += crc;
    
    const md5Hash = generateMD5(qrString);
    
    console.log('✅ Manual KHQR generated');
    console.log('   QR String length:', qrString.length);
    console.log('   Format:', bakongMerchantId ? 'Bakong Merchant' : 'Wing Direct');
    console.log('   MD5 Hash:', md5Hash);
    
    return res.status(200).json({
      success: true,
      data: {
        qrCode: qrString,
        qrImage: null,
        md5Hash: md5Hash,
        amount: amount,
        currency: currency,
        accountNumber: wingAccount,
        accountName: wingName,
        billNumber: finalBillNumber,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        method: bakongMerchantId ? 'khqr_bakong_manual' : 'khqr_wing_manual',
        note: bakongMerchantId 
          ? 'Bakong KHQR (Manual) - May need verification'
          : 'Wing KHQR (Manual) - Limited compatibility',
        verificationUrl: 'https://bakong.nbc.gov.kh/check-transaction',
        merchantId: bakongMerchantId || null
      }
    });

  } catch (error) {
    console.error('❌ Generate KHQR error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate KHQR code',
      error: error.message
    });
  }
};

/**
 * Verify KHQR Payment
 * Returns pending status - manual confirmation required
 */
const verifyPayment = async (req, res) => {
  try {
    const { md5, billNumber } = req.params;

    console.log('🔍 Payment verification requested for:', md5 || billNumber);
    
    return res.status(200).json({
      success: true,
      data: {
        status: 'pending',
        message: 'Please confirm payment manually after scanning QR code',
        paid: false,
        note: 'Manual confirmation required'
      }
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
};

module.exports = {
  generateKHQR,
  verifyPayment
};
