// const {
//   Get,
//   GetOne,
//   Create,
//   Update,
//   Delete,
//   login,
//   SendTelegramMessage,
//   SendEmail,
//   sendOTP,
//   resetPassword,
//   verifyOtp,
// } = require("../controller/UserController");
// var auth = require("../middleware/middleware");
// const Users = (app) => {
//   app.get("/api/user", auth.validate_token(), Get);
//   app.get("/api/user/:id", auth.validate_token(), GetOne);
//   app.post("/api/user", Create);
//   app.post("/api/login", login);
//   app.post("/api/user/bot_send", SendTelegramMessage);
//   app.post("/api/user/send_email", SendEmail);
//   app.post("/api/user/sent_opt", sendOTP);
//   app.post("/api/user/resetPassword", resetPassword);
//   app.post("/api/user/verify_opt",verifyOtp);

//   app.put("/api/user/:id", auth.validate_token(), Update);
//   app.delete("/api/user/:id", auth.validate_token(), Delete);
// };

// module.exports = Users;


const {
  Get,
  GetOne,
  Create,
  Update,
  Delete,
  login,
  // SendTelegramMessage,
  SendEmail,
  sendOTP,
  resetPassword,
  verifyOtp,
} = require("../controller/UserController");
var auth = require("../middleware/middleware");

const Users = (app) => {
  // --- PUBLIC ROUTES (No Token Required) ---
  app.post("/api/login", login);
  app.post("/api/user", Create); // Registration is usually public
  
  // Forgot Password Flow MUST be public
  app.post("/api/user/send_otp", sendOTP);      // Changed from sent_opt to send_otp for clarity
  app.post("/api/user/verify_otp", verifyOtp);  // Changed from verify_opt to verify_otp
  app.post("/api/user/reset_password", resetPassword); // Changed from resetPassword to reset_password

  // --- PROTECTED ROUTES (Token Required) ---
  app.get("/api/user", auth.validate_token(), Get);
  app.get("/api/user/:id", auth.validate_token(), GetOne);
  app.put("/api/user/:id", auth.validate_token(), Update);
  app.delete("/api/user/:id", auth.validate_token(), Delete);

  // Other internal services
  // app.post("/api/user/bot_send", auth.validate_token(), SendTelegramMessage);
  app.post("/api/user/send_email", auth.validate_token(), SendEmail);
};

module.exports = Users;
