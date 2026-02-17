const cloudinary = require('cloudinary').v2;
const cloudinaryStorage = require('multer-storage-cloudinary');
const CloudinaryStorage = cloudinaryStorage.CloudinaryStorage;

// Configure Cloudinary with the provided credentials
cloudinary.config({
  cloud_name: 'dh2ypqi8l',
  api_key: '258381365619589',
  api_secret: 'HrtnNIQ41_7sTkYRmwuPVKKSJug'
});

// Create a Cloudinary storage engine for multer
const createCloudinaryStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
  });
};

module.exports = {
  cloudinary,
  createCloudinaryStorage
};
