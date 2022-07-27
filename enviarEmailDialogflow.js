'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'matheusmatosrodrigues27@gmail.com' ,
        pass: 'cdslhtoaqszsyvgt'
    }
});

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function enviarEmailAgora(agent){
  	const { name } = agent.parameters;
  	
    const  mailOptions = {
        from: "matheusmatosrodrigues27@gmail.com" ,  // endereço do remetente
        to: "matbolado198@gmail.com" ,  // lista de receptores
        subject: "Novo usuário querendo entrar em contato no WhatsApp" ,  // Linha de assunto
        html: `<p> Olá, ${name} está querendo entrar em contato conosco no WhatsApp! </p>`
    };
    
	transporter.sendMail(mailOptions, function (err, info) {
        if(err)
        {
          console.log(err);
        }
    });
  }  
    
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('enviarEmail', enviarEmailAgora);
  agent.handleRequest(intentMap);
  
 });