const mongoose = require('mongoose');
mongoose.connect(process.env.DBURL)
  .then(() => {
    console.log("Connection Successfull!!");
  })
  .catch((e) => {
    console.log(e);
  });

module.exports = mongoose;