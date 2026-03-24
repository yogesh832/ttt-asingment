require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const url = cloudinary.url("jobboard_resumes/1774323082600_n91rikfur.pdf", {
  resource_type: "raw",
  type: "upload",
  sign_url: true
});
console.log(url);
