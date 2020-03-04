/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const main = require('./main.json');

function supportsAPL(handlerInput) {
    const supportedInterfaces = handlerInput.requestEnvelope.context.System.device.supportedInterfaces;
    const aplInterface = supportedInterfaces['Alexa.Presentation.APL'];
    return aplInterface != null && aplInterface != undefined;
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    
    handle(handlerInput) {
        const speakOutput = 'Hola bienvenido! Puedes pedirme que te diga algo lindo, o que te diga alguna virtud';
        if(supportsAPL(handlerInput))
        { 
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
                document: main,
                datasources: {
                  'aplData': {
                    'message': speakOutput,
                    'image': bienvenidoImg
                  }
                }
            })
            .getResponse();
        }
        else{
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
        }
    }
};

const nuevaVirtud = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'dimeVirtud' ;
    },
    handle(handlerInput) {
        const virtudesArr = data;
        const virtudesIndex = Math.floor(Math.random() * virtudesArr.length);
        const virtudRandom = virtudesArr[virtudesIndex];
        const speakOutput = MENSAJE + virtudRandom;

        if(supportsAPL(handlerInput))
        { 
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
                document: main,
                datasources: {
                  'aplData': {
                    'message': speakOutput,
                    'image': virtudesImg
                  }
                }
            })
            .getResponse();
        }
        else{
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .withSimpleCard(SKILL_NAME, virtudRandom)
            .getResponse();
        }
    }
};


const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    if(supportsAPL(handlerInput))
    { 
    return handlerInput.responseBuilder
        .speak(HELP_MESSAGE)
        .reprompt(HELP_REPROMPT)
        .addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: '1.0',
            document: main,
            datasources: {
              'aplData': {
                'message': HELP_MESSAGE,
                'image': helpImg
              }
            }
        })
        .getResponse();
    }
    else{
        return handlerInput.responseBuilder
        .speak(HELP_MESSAGE)
        .reprompt(HELP_REPROMPT)
        .getResponse();
    }
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },

  handle(handlerInput) {
    if(supportsAPL(handlerInput))
    { 
    return handlerInput.responseBuilder
        .speak(STOP_MESSAGE)
        .addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: '1.0',
            document: main,
            datasources: {
              'aplData': {
                'message': STOP_MESSAGE,
                'image': adiosImg
              }
            }
        })
        .withShouldEndSession(true)
        .getResponse();
    }
    else{
        return handlerInput.responseBuilder
        .speak(STOP_MESSAGE)
        .withShouldEndSession(true)
        .getResponse();
    }
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    const speakOutput = 'Lo siento, no entiendo lo que quieres decir, puedes repetir?';
    if(supportsAPL(handlerInput))
    { 
    return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: '1.0',
            document: main,
            datasources: {
              'aplData': {
                'message': speakOutput,
                'image': errorImg
              }
            }
        })
        .getResponse();
    }
    else{
        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    }
  },
};

const SKILL_NAME = 'Ánimo! escucha tus cualidades';
const MENSAJE = 'Eres una persona ';
const HELP_MESSAGE = 'Puedes decirme, Alexa dime una virtud, alégrame el día, o dime un halago';
const HELP_REPROMPT = '¿Cómo te puedo ayudar?';
const STOP_MESSAGE = 'Adiós!';


const data = [
    'que se adapta facilmente',
    'muy amable',
    'ambiciosa, ¡eso te llevará lejos!',
    'amistosa',
    'amorosa',
    'apasionada',
    'que aprende rápidamente',
    'que aprovecha situaciones y ve oportunidades',
    'que sabe pedir perdón',
    'atenta',
    'auto disciplinada, ¡felicidades!',
    'auto controlada',
    'asertiva, esa es una excelente cualidad',
    'bondadosa',
    'capaz de',
    'caritativa, ¡tu muy bien!',
    'creativa, ¡guau, no cualquiera!',
    'coherente',
    'colaboradora',
    'consciente',
    'que sabe confiar, felicidades!',
    'constante',
    'constructiva, que busca soluciones',
    'cooperativa',
    'comprensiva',
    'cuidadosa',
    'curiosa, eso te llevará lejos',
    'decidida, no cualquiera, felicidades',
    'disciplinada, ¡muy bien!',
    'eficiente, aprovecha esta cualidad',
    'entusiasta, ¡sigue así!',
    'empática, ¡felicidades!',
    'que siempre se esfuerza',
    'exigente, ¡eso es bueno! ya que no te conformas',
    'exitosa, ¡tu muy bien!',
    'extrovertida',
    'feliz, ¡eso es excelente!',
    'fiel',
    'firme',
    'fuerte',
    'generosa, qué bien!',
    'graciosa, saca provecho de esta cualidad',
    'de buen humor',
    'humilde',
    'honesta, ¡estoy orgullosa de ti!',
    'honrada',
    'inteligente',
    'intuitiva',
    'increíble',
    'justa',
    'leal, eso es algo muy bueno',
    'líder',
    'que lucha por lo que quiere, y eso es fantástico',
    'modesta',
    'motivadora',
    'obediente',
    'con objetivos determinados',
    'optimista, ¡eso me gusta!',
    'ordenada, ¡tú muy bien!',
    'paciente',
    'que perdona a los demás, ¡eso es excelente!',
    'perfeccionista',
    'perseverante',
    'perspicaz',
    'que actúa con perspectiva',
    'precavida',
    'prudente',
    'puntual, ¡tu muy bien!',
    'reflexiva',
    'resiliente',
    'respetuosa',
    'muy responsable, ¡bravo!',
    'satisfecha',
    'segura de sí misma',
    'sencilla',
    'sensata',
    'sincera, ¡eso es increíble!',
    'solidaria',
    'tolerante',
    'que habla con la verdad'];


const virtudesImg = 'https://image.flaticon.com/icons/svg/1234/1234840.svg';
const errorImg = 'https://image.flaticon.com/icons/svg/1235/1235091.svg' ;
const adiosImg = 'https://image.flaticon.com/icons/svg/1234/1234845.svg';
const helpImg = 'https://image.flaticon.com/icons/svg/1235/1235095.svg';
const bienvenidoImg = 'https://image.flaticon.com/icons/svg/1234/1234839.svg';

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    nuevaVirtud,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
