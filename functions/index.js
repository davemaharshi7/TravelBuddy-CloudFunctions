const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});
const APP_NAME = 'TravelBuddy';
// [START onCreateTrigger]
exports.sendEmailToUser = functions.https.onCall((data,context)=>{
    // const original = request.query.text;
    const email = data.emailUser; // The email of the user.
    const name = data.username;
    const persons = data.persons;
    const contact = data.contact;
    console.log("EMAIL :"+email);
    //const displayName = ''; // The display name of the user.
    // [END eventAttributes]
  
    return sendEmail(email,name,persons,contact);
});
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
    // [END onCreateTrigger]
      // [START eventAttributes]
      const email = user.email; // The email of the user.
      const displayName = user.displayName; // The display name of the user.
      // [END eventAttributes]
    
      return sendWelcomeEmail(email, displayName);
    });
    // [END sendWelcomeEmail]
// [START sendByeEmail]
/**
 * Send an account deleted email confirmation to users who delete their accounts.
 */
// [START onDeleteTrigger]
exports.sendByeEmail = functions.auth.user().onDelete((user) => {
    // [END onDeleteTrigger]
      const email = user.email;
      const displayName = user.displayName;
    
      return sendGoodbyeEmail(email, displayName);
    });
    // [END sendByeEmail]

// Sends a welcome email to the given user.
function sendWelcomeEmail(email, displayName) {
    const mailOptions = {
      from: `${APP_NAME} <noreply@travelbuddy.com>`,
      to: email,
    };
  
    // The user subscribed to the newsletter.
    mailOptions.subject = `Welcome to ${APP_NAME}!`;
    mailOptions.text = `Hey ${displayName || ''}! Welcome to ${APP_NAME}. I hope you will enjoy our service.`;
    return mailTransport.sendMail(mailOptions).then(() => {
      return console.log('New welcome email sent to:', email);
    });
  }




// Sends a  email to the given user.
function sendEmail(email,name,persons,contact) {
    const mailOptions = {
      from: `${APP_NAME} <noreply@travelbuddy.com>`,
      to: email,
    };
  
    // The user subscribed to the newsletter.
    mailOptions.subject = `Your Trip is Confirmed!, ${APP_NAME}!`;
    mailOptions.text = `Hey ${name}!
     Welcome to ${APP_NAME}. I hope you will enjoy our service.
     Your trip is confirmed and some of your details are as below-
     Number of persons Travelling are ${persons}
     Your Contact Number is ${contact}`;
    return mailTransport.sendMail(mailOptions).then(() => {
      return console.log('New Email email sent to:', email);
    });
  }  





  // Sends a goodbye email to the given user.
  function sendGoodbyeEmail(email, displayName) {
    const mailOptions = {
      from: `${APP_NAME} <noreply@firebase.com>`,
      to: email,
    };
  
    // The user unsubscribed to the newsletter.
    mailOptions.subject = `Bye!`;
    mailOptions.text = `Hey ${displayName || ''}!, We confirm that we have deleted your ${APP_NAME} account.`;
    return mailTransport.sendMail(mailOptions).then(() => {
      return console.log('Account deletion confirmation email sent to:', email);
    });
  }
