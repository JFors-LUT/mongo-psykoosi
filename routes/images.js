const express = require('express');
const router = express.Router();
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.array('images'),(req, res) => {
    const uploadedImages = req.files;
    console.log(uploadedImages);
    res.json({"message":"Hi"});
});

module.exports = router;