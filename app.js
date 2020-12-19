const dotenv = require('dotenv');
dotenv.config();
const cron = require('node-cron');
const axios = require('axios');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASS
  }
});


let today = new Date().toISOString().slice(0, 10);
console.log(today);


  let url=`https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${process.env.CHANNEL_ID}&maxResults=25&publishedAfter=${today}T00%3A00%3A13Z&q=IELTS%20listening&key=${process.env.APIKEY}`
  axios.get(url)
  .then(function (video) {
      console.log("videoId", video.data['items'][0].id.videoId);
      let videoId= video.data['items'][0].id.videoId;
      let generateUrl=`https://www.youtube.com/watch?v=${videoId}&ab_channel=${process.env.CHANNEL_NAME}`
      console.log('url for the video', generateUrl);
      createMail(generateUrl);
    })
    .catch(function (error) {
      console.log("couldn't get the response", error);
    })


function createMail(url){
  console.info('in sending mail');
  var mailOptions = {
    from: process.env.MAIL_ID,
    to: process.env.TO_ID1,
    subject: "Today's listening task",
    text: url
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); 

  var mailOptions = {
    from: process.env.MAIL_ID,
    to:  process.env.TO_ID2,
    subject: "Today's listening task ![IMPORTANT]",
    text: url
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); 

}




