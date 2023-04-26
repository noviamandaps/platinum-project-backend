const processFile = require("./Upload.js");
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");

const storage = new Storage({ keyFilename: "google-cloud-key.json" });
const bucket = storage.bucket("platinum-project-backend.appspot.com");

const uploadPictures = async (req, res) => {
  try {
    await processFile(req, res);

    if (!req.file) {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "Please upload a file!",
      });
    }

    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (err) => {
      return res.status(500).json({
        code: 500,
        status: false,
        message: err.message,
      });
    });

    blobStream.on("finish", async (data) => {
      let fileName = blob.name;
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${fileName.replace(
          / /g,
          "%20"
        )}`
      );

      try {
        await bucket.file(req.file.originalname).makePublic();
      } catch {
        return res.status(200).json({
          code: 200,
          status: true,
          message: "Uploaded the file successfully: " + req.file.originalname,
          data: publicUrl,
        });
      }

      return res.status(200).json({
        code: 200,
        status: true,
        msg: "Uploaded the file successfully: " + req.file.originalname,
        data: publicUrl,
      });
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).json({
        code: 500,
        status: false,
        msg: "File size cannot be larger than 2MB!",
      });
    }

    return res.status(500).send({
      code: 500,
      status: false,
      msg: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const getListFiles = async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file.name,
        url: file.metadata.mediaLink,
      });
    });

    return res.status(200).json(fileInfos);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      code: 500,
      msg: "Unable to read list of files!",
    });
  }
};

const download = async (req, res) => {
  try {
    const [metaData] = await bucket.file(req.params.name).getMetadata();
    res.redirect(metaData.mediaLink);
  } catch (err) {
    return res.status(500).send({
      code: 500,
      msg: "Could not download the file. " + err,
    });
  }
};
module.exports = {
  uploadPictures,
  getListFiles,
  download,
};
