const request = require("request");
const config = require("config");
const sharp = require("sharp");
const imgurClientId = process.env.imgurClientId || config.get("imgurClientId");

const updateImage = async (imageFile, deleteHash, cropWidth, cropHeight) => {
  const deletePromise = deleteImage(deleteHash);
  const uploadPromise = uploadImage(imageFile, cropWidth, cropHeight);
  const [deleteResponse, uploadResponse] = await Promise.all([
    deletePromise,
    uploadPromise
  ]);

  return { deleteResponse, uploadResponse };
};

const deleteImage = async deleteHash => {
  return new Promise(resolve => {
    const deleteResponse = {};
    const options = {
      url: `https://api.imgur.com/3/image/${deleteHash}`,
      method: "DELETE",
      headers: { Authorization: `Client-ID ${imgurClientId}` }
    };

    request(options, (error, response) => {
      if (error) {
        deleteResponse.error = error;
      } else if (response.statusCode !== 200) {
        deleteResponse.error = "Imgur Image deletion unsuccessful";
      } else {
        deleteResponse.msg = "Imgur image successfully deleted";
      }
      return resolve(deleteResponse);
    });
  });
};

const uploadImage = async (imageFile, cropWidth, cropHeight) => {
  return new Promise(async resolve => {
    const imageBuffer =
      !cropHeight && !cropWidth
        ? imageFile.buffer
        : await sharp(imageFile.buffer)
            .resize(cropWidth, cropHeight)
            .toBuffer();

    const uploadResponse = {};
    const options = {
      url: "https://api.imgur.com/3/upload",
      method: "POST",
      headers: { Authorization: `Client-ID ${imgurClientId}` },
      formData: {
        image: imageBuffer
      },
      json: true
    };

    request(options, (error, response, body) => {
      if (error) {
        uploadResponse.error = error;
      } else if (response.statusCode !== 200) {
        uploadResponse.error = "Imgur Image upload unsuccessful";
      } else {
        console.log(body);
        uploadResponse.link = body.data.link;
        uploadResponse.deleteHash = body.data.deletehash;
      }
      return resolve(uploadResponse);
    });
  });
};

module.exports = { updateImage, uploadImage, deleteImage };
