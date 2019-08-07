const request = require("request");

const updateImage = async imageFormData => {};

const uploadImage = async imageFormData => {
  return new Promise(resolve => {
    const imageResponse = {};
    const options = {
      uri: "https://api.imgur.com/3/upload",
      method: "POST",
      headers: { Authorization: `Client-ID dddc665117c1988` },
      formData: imageFormData
    };

    request(options, (error, response, body) => {
      if (error) {
        imageResponse.error = error;
      } else if (response.statusCode !== 200) {
        imageResponse.error = "Imgur Image upload unsuccessful";
      } else {
        console.log(body);
      }
      return resolve(imageResponse);
    });
  });
};

module.exports = { updateImage, uploadImage };
