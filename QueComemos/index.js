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
        const speakOutput = 'Hola bienvenido! ¿no sabes qué cocinar hoy? No te preocupes, te ayudo. Solo dime, Alexa, ¿qué puedo preparar hoy? ';
        if (supportsAPL(handlerInput)) {
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
        else {
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
    }
};

const selectFoodHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'quePreparo';
    },
    handle(handlerInput) {
        const tipoSelecc = handlerInput.requestEnvelope.request.intent.slots.respuesta.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let tipoComidaArr;
        let fotoComida; 
        switch(tipoSelecc){
            case 'italiana':
                tipoComidaArr = tItaliana;
                fotoComida = imagenesComidaArr[0];
                break;
            case 'mexicana':
                tipoComidaArr = tMexicana;
                fotoComida = imagenesComidaArr[1];
                break;
            case 'japonesa':
                tipoComidaArr = tJaponesa;
                fotoComida = imagenesComidaArr[2];
                break;
            case 'mariscos':
                tipoComidaArr = tMariscos;
                fotoComida = imagenesComidaArr[3];
                break;
            case 'saludable':
                tipoComidaArr = tSaludable;
                fotoComida = imagenesComidaArr[4];
                break;
            case 'vegetariana':
                tipoComidaArr = tVegetariana;
                fotoComida = imagenesComidaArr[5];
                break;
            case 'rapida':
                tipoComidaArr = tRapida;
                fotoComida = imagenesComidaArr[6];
        }

        const tipoComidaIndex = Math.floor(Math.random() * tipoComidaArr.length);
        const tipoComidaRandom = tipoComidaArr[tipoComidaIndex];
        
        const speakOutput = DEF_MESSAGE + tipoComidaRandom;

        if (supportsAPL(handlerInput)) {
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    version: '1.0',
                    document: main,
                    datasources: {
                        'aplData': {
                            'message': speakOutput,
                            'image': fotoComida
                        }
                    }
                })
                .getResponse();
        }
        else {
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .withSimpleCard(SKILL_NAME, tipoComidaRandom)
                .getResponse();
        }
    }
};


const foodTypesHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'queOpciones';
    },
    handle(handlerInput) {
        const tiposDeComida = tiposComidaArr;
        const speakOutput = 'Tengo los siguientes tipos de comida: ' + tiposDeComida;
        console.log(tiposDeComida);

        if (supportsAPL(handlerInput)) {
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    version: '1.0',
                    document: main,
                    datasources: {
                        'aplData': {
                            'message': speakOutput,
                            'image': comidasImg
                        }
                    }
                })
                .getResponse();
        }
        else {
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .withSimpleCard(SKILL_NAME)
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
        if (supportsAPL(handlerInput)) {
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
        else {
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
        if (supportsAPL(handlerInput)) {
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
                .getResponse();
        }
        else {
            return handlerInput.responseBuilder
                .speak(STOP_MESSAGE)
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
        if (supportsAPL(handlerInput)) {
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
        else {
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
    },
};

const SKILL_NAME = '¿Qué comemos hoy?';
const DEF_MESSAGE = 'Puedes cocinar ';
const HELP_MESSAGE = 'Puedes decirme, Alexa, dime qué puedo cocinar hoy o Alexa, ¿qué comemos?';
const HELP_REPROMPT = '¿Cómo te puedo ayudar?';
const STOP_MESSAGE = 'Espero que prepares algo delicioso!, Adiós';




const tItaliana = ['una pizzita', 'un espagueti a la boloñesa', 'lasaña vegetariana, ¡qué rico!', 'lasaña a la boloñesa', 'ensalada capresse', 'espagueti a la carbonara', 'un fettuccini Alfredo', 'unos ravioles', 'paninis o baguettes', 'pollo a la parmesana'];
const tMexicana = ['unos sopecitos de requesón, papa, rajas o frijoles', 'unas rajitas con elote, mmm ¡qué rico!', 'una carnita asada', 'unos vampiritos con cebollita y frijoles', 'un pozolito', 'unas flautas', 'unas enmoladas, esas son mis favoritas', 'unas enjitomatadas', 'una cochinita pibil, ¡delicioso!', 'unas hamburguesas', 'una sopita de tortilla, con panela y aguacate', 'unos chiles rellenos de queso y elotitos', 'unas enchiladas al gusto', 'menudito, si es que tienes tiempo', 'unas gorditas rellenas', 'carne con papa y salsa', 'un lomo en salsa al gusto, puede ser de ciruela o tamarindo', 'unas milanesas de pollo o de res', 'papas rellenas de queso y carne, ¡qué rico!', 'sopa de fideos, esa no puede faltar', 'sopa de lentejas, muy nutritiva', 'unas tostadas de atún en cubos','unas tostaditas de panela con jamón o frijoles y salsa', 'una ensaladita de atún', 'una ensaladita de pollo', 'lonches bañados, ¡mis favoritos!', 'unas pacholas con puré de papa', 'un picadillo', 'un pollo con mole', 'un salpicón', 'unos taquitos al pastor', 'unas fajitas de res'];
const tJaponesa = ['unos sushis', 'rosca de sushi', 'un yakimeshi', 'tempura', 'ramen', 'un arroz culichi'];
const tMariscos = ['unos camarones a la diabla', 'unos camarones al ajillo', 'un pescadito empanizado', 'pescado a la veracruzana', 'un cevichito de pescado', 'un cevichito de atún', 'un ceviche de camarones', 'aguachile, con picante al gusto', 'tacos estilo gobernador, ¡esos me encantan!', 'unas tostadas de marlin con aguacate', 'unas tostadas de atún', 'un atún sellado preparado al gusto', 'salmón preparado al gusto', 'coctel de camarones'];
const tSaludable = ['una ensaladita con pollo y manzana', 'un pollito a la plancha', 'un salmoncito a la plancha', 'una sopita de tus verduras favoritas', 'un ceviche con quinoa, eso es muy nutritivo', 'una ensalada de frutas', 'una sopita de zanahoria', 'una sopita de calabaza', 'un arrocito con verduras', 'una ensalada caprese', 'tus vegetales preferidos cocidos al gusto', 'una pasta al limon con atún', 'unas tostadas de ceviche', 'unas tostadas con salpicón', 'unas calabacitas con panela', 'unas calabacitas rellenas de vegetales y quinoa', 'un fetuchinni con champiñones'];
const tVegetariana = ['un espagueti de calabacitas con jitomate','unas tostaditas de flor de calabaza',  'unas albóndigas de soya con quinoa', 'una lasaña de berenjena', 'un fetuchinni con champiñones', 'unas hamburguesas con carne hecha de lentejas', 'unos portobellos rellenos de capresse'];
const tRapida = ['unos hot dogs', 'unos sandwiches', 'unos lonches de jamón', 'unas hamburguesas', 'unas alitas', 'unas empanadas de rajas, champiñones o carne', 'unas sincronizadas', 'una pizza, ¡se antoja para un domingo!', 'unos burritos', 'unos taquitos', 'unos baguettes', 'unas quesadillas con rajas o champiñones', 'unas enfrijoladas', 'un atún de lata con mayonesa'];

const comidasImg = 'https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX11185651.jpg';
const errorImg = 'https://image.flaticon.com/icons/svg/1917/1917694.svg';
const adiosImg = 'https://image.flaticon.com/icons/svg/1917/1917597.svg';
const helpImg = 'https://image.flaticon.com/icons/svg/1917/1917634.svg';
const bienvenidoImg = 'https://image.flaticon.com/icons/svg/1211/1211161.svg';


const tiposComidaArr = ['italiana', ' mexicana', ' japonesa', ' mariscos', ' saludable', ' vegetariana', ' y comida rápida'];
const imagenesComidaArr = 
['https://image.flaticon.com/icons/svg/1969/1969468.svg',
'https://image.flaticon.com/icons/svg/1691/1691340.svg',
'https://image.flaticon.com/icons/svg/1623/1623687.svg',
'https://image.flaticon.com/icons/svg/1355/1355885.svg',
'https://image.flaticon.com/icons/svg/1625/1625099.svg',
'https://image.flaticon.com/icons/svg/1728/1728720.svg',
'https://image.flaticon.com/icons/svg/1095/1095166.svg'
];

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        foodTypesHandler,
        selectFoodHandler,
        HelpHandler,
        ExitHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();

