const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("WELCOMEEEE!!");
});

app.listen(port, () => {
    console.log("Server Port", port);
});

const fileStorage = multer.diskStorage({
    destination: "images",
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});

const uploadImage = multer({
    storage: fileStorage,
    limits: {
        fileSize: 1000000000,
    },
    fileFilter(req, file, cb) {
        // if (!file.originalname.match(/\.(png\jpg)$/)) {
        //     return cb(new Error("Please uplaod an Image file!"));
        // }
        cb(undefined, true);
    },
});

app.post(
    "/addPost",
    uploadImage.fields([
        { name: "image", maxCount: 1 },
        {
            name: "video",
            maxCount: 3,
        },
        {
            name: "multipleImage",
            maxCount: 3,
        },
    ]),
    (req, res) => {
        res.send(req.file);
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);

app.post(
    "/uploadImage",
    uploadImage.single("image"),
    // uploadImage.array("images", 4),
    (req, res) => {
        res.send(req.file);
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);

app.post(
    "/uploadMultipleImage",
    uploadImage.array("images", 4),
    (req, res) => {
        res.send(req.files);
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);
