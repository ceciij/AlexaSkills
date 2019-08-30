const main = require('./main.json');
const Alexa = require('ask-sdk-core');
const skillBuilder = Alexa.SkillBuilders.custom();
 
// use 'ask-sdk' if standard SDK module is installed////////////////////////////////
// Code for the handlers here //
////////////////////////////////
 
function supportsAPL(handlerInput) {
    const supportedInterfaces = handlerInput.requestEnvelope.context.System.device.supportedInterfaces;
    const aplInterface = supportedInterfaces['Alexa.Presentation.APL'];
    return aplInterface != null && aplInterface != undefined;
}
 
// DECALRE GLOABAL GROUPS (The purpose is to use them in different functions)
const rendimientoCombustible = ['millas por galón', 'kilómetros por litro'];
const distancia = ['kilómetros', 'metros', 'centímetros', 'milímetros', 'millas', 'yardas', 'pie', 'pulgadas', 'millas náuticas'];
const peso = ['toneladas métricas', 'kilogramos', 'gramos', 'miligramos', 'microgramos', 'toneladas imperiales', 'toneladas estadounidenses', 'onzas', 'libra'];
const velocidad = ['millas por hora', 'pies por segundo', 'metros por segundo', 'kilómetros por hora', 'knots'];
const temperatura = ['celsius', 'kelvin', 'fahrenheit'];
const volumen = ['metros cúbicos', 'litros', 'mililitros', 'pies cúbicos', 'pulgadas cúbicas', 'centímetro cúbico'];
 
const rendimientoCombustibleFactor = [1, 0.425144];
const distanciaFactor = [1, 1000, 100000, 1000000, .621504, 1093.613, 3280.84, 39370.079, 0.539957];
const pesoFactor = [1, 1000, 1000000, 1000000000, 1000000000000, 0.984207, 1.10231, 35274, 2204.62];
const velocidadFactor = [1, 1.46667, 0.44704, 1.60934, 0.868976];
const temperaturaFactor = [1, 1, 0.555555555555];
const temperaturaIncremento =[0, -273.15, -32];
const volumenFactor = [1, 1000, 1000000, 35.3147, 61023.7, 1000000];
const unidadesMedidaImg = 'https://image.flaticon.com/sprites/new_packs/1085186-measuring.png';
 
//Function to Open Skill
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Hola! Bienvenido al convertor de unidades, puedes preguntarme ¿qué unidades puedes convertir?  o convierte 6 kilos a libras.';
        if(supportsAPL(handlerInput))
        { 
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
                document: main,
                datasources: {
                  'aplData': {
                    'message': speechText,
                    'image': unidadesMedidaImg
                  }
                }
            })
            .getResponse();
        }
            else{
                return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .withSimpleCard('Convertidor Unidades', speechText)
                .getResponse();
          }
    }
};
 
const UnitConversionIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'unidadesDeConversion';
    },
    handle(handlerInput) {
        const speechText = 'Puedo convertir unidades de rendimiento de combustible, distancia, peso, velocidad, temperatura y volumen';
        if(supportsAPL(handlerInput))
        { 
        return handlerInput.responseBuilder
            .speak(speechText)
            .addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
                document: main,
                datasources: {
                  'aplData': {
                    'message': speechText,
                    'image': unidadesMedidaImg
                  }
                }
            })
            .getResponse();
        }
        else{
            return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Convertidor Unidades', speechText)
            .getResponse();
      }
    }
};
 
function sistemaConversion(unidadX){
    let unidadMedida;
    let unidadMedidaFactor;
    let requestedUnitImage;
 
    switch (true) {
        case rendimientoCombustible.includes(unidadX):
          unidadMedida = rendimientoCombustible;
          unidadMedidaFactor = rendimientoCombustibleFactor;
          requestedUnitImage = 'https://image.flaticon.com/icons/svg/76/76784.svg';
          break;
        case distancia.includes(unidadX):
            unidadMedida = distancia;
            unidadMedidaFactor = distanciaFactor;
            requestedUnitImage = 'https://image.flaticon.com/icons/svg/76/76643.svg';
          break;
        case peso.includes(unidadX):
           unidadMedida = peso;
           unidadMedidaFactor = pesoFactor;
           requestedUnitImage = 'https://image.flaticon.com/icons/svg/76/76728.svg';
          break;
        case velocidad.includes(unidadX):
          unidadMedida = velocidad;
          unidadMedidaFactor = velocidadFactor;
          requestedUnitImage = 'https://image.flaticon.com/icons/svg/76/76904.svg';
          break;
        case temperatura.includes(unidadX):
          unidadMedida = temperatura;
          unidadMedidaFactor = temperaturaFactor;
          requestedUnitImage = 'https://image.flaticon.com/icons/svg/76/76660.svg';
          break;
        case volumen.includes(unidadX):
          unidadMedida = volumen;
          unidadMedidaFactor = volumenFactor;
          requestedUnitImage = 'https://image.flaticon.com/icons/svg/76/76729.svg';
          break;
    }
 
    return [unidadMedida, unidadMedidaFactor, requestedUnitImage];
 
}
 
const ConvertXYIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest'
        || (request.type === 'IntentRequest'
          && request.intent.name === 'convertirXY');
    },
    handle(handlerInput) {
 
        /*HERE STARTS MY CODE*/
        //Request values
        const request = handlerInput.requestEnvelope.request;
        var cant;
        var bandera = false;
        if(isNaN(parseFloat(request.intent.slots.cantidad.value))){
            cant = 1;
            bandera = true;
        }
        else{
            cant = parseFloat(request.intent.slots.cantidad.value);
        }
        const unidadX = request.intent.slots.unidadX.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        const unidadY = request.intent.slots.unidadY.resolutions.resolutionsPerAuthority[0].values[0].value.name;
 
        let respuesta;
 
        //Logic
  
        let sisConversion = sistemaConversion(unidadX);
        let unidadMedida= sisConversion[0];
        let unidadMedidaFactor= sisConversion[1];
        let requestedUnitImage = sisConversion[2];
       
        if(rendimientoCombustible.includes(unidadX) && rendimientoCombustible.includes(unidadY) ||
            distancia.includes(unidadX) && distancia.includes(unidadY) ||
            peso.includes(unidadX) && peso.includes(unidadY) ||
            velocidad.includes(unidadX) && velocidad.includes(unidadY) ||
            temperatura.includes(unidadX) && temperatura.includes(unidadY) ||
            volumen.includes(unidadX) && volumen.includes(unidadY)){
               
                if(temperatura.includes(unidadX)){
                    let factorFuente = parseFloat(unidadMedidaFactor[(unidadMedida.indexOf(unidadX))]);
                    let factorTarget = parseFloat(unidadMedidaFactor[(unidadMedida.indexOf(unidadY))]);
                    let incrementoFuente = parseFloat(temperaturaIncremento[(unidadMedida.indexOf(unidadX))]);
                    let incrementoTarget = parseFloat(temperaturaIncremento[(unidadMedida.indexOf(unidadY))]);
                   
                    respuesta = roundToThree((((cant+incrementoFuente)*factorFuente)/factorTarget)-incrementoTarget);
 
                    let speechText;
                    if(bandera === false){
                        speechText = `La respuesta es ${respuesta} ${unidadY}`;
                    }
                    else{
                        speechText = `1 ${unidadX} equivale a ${respuesta} ${unidadY}`;
                    }
                    
                    if(supportsAPL(handlerInput)){
                    return handlerInput.responseBuilder
                        .speak(speechText)
                        .addDirective({
                            type: 'Alexa.Presentation.APL.RenderDocument',
                            version: '1.0',
                            document: main,
                            datasources: {
                              'aplData': {
                                'message': speechText,
                                'image': requestedUnitImage
                              }
                            }
                        })
                        .getResponse();
                    }
                    else{
                        return handlerInput.responseBuilder
                        .speak(speechText)
                        .reprompt(speechText)
                        .withSimpleCard('Convertidor Unidades', speechText)
                        .getResponse();
                  }
 
                }
                else{
                    let valor1 = unidadMedidaFactor[(unidadMedida.indexOf(unidadX))];
                    let valor2 = unidadMedidaFactor[(unidadMedida.indexOf(unidadY))];
 
                    respuesta = roundToThree((cant / valor1) * valor2);
 
                    let speechText;
 
                    if(bandera === false){
                        speechText = `La respuesta es ${respuesta} ${unidadY}`;
                    }
                    else{
                        speechText = `1 ${unidadX} equivale a ${respuesta} ${unidadY}`;
                    }
                    if(supportsAPL(handlerInput)){
                    return handlerInput.responseBuilder
                        .speak(speechText)
                        .addDirective({
                            type: 'Alexa.Presentation.APL.RenderDocument',
                            version: '1.0',
                            document: main,
                            datasources: {
                              'aplData': {
                                'message': speechText,
                                'image': requestedUnitImage
                              }
                            }
                        })
                        .getResponse();
                    }
                    else{
                        return handlerInput.responseBuilder
                        .speak(speechText)
                        .reprompt(speechText)
                        .withSimpleCard('Convertidor Unidades', speechText)
                        .getResponse();
                  }
                }
            }
            else{
                let arraySplice = unidadMedida;
                arraySplice.splice(unidadMedida.indexOf(unidadX),1);
                let speechText = `Solo puedo convertir de ${unidadX} a ${arraySplice}`;
                if(supportsAPL(handlerInput)){
                return handlerInput.responseBuilder
                .speak(speechText)
                .addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    version: '1.0',
                    document: main,
                    datasources: {
                      'aplData': {
                        'message': speechText,
                        'image': requestedUnitImage
                      }
                    }
                })
                .reprompt(speechText)
                .getResponse();
            }
            else{
                return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .withSimpleCard('Convertidor Unidades', speechText)
                .getResponse();
          }
            }
           
    }
};
 
function roundToThree(num) {   
    return +(Math.round(num + "e+3")  + "e-3");
}
 
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        let speechText = 'Puedo convertir unidades de rendimiento de combustible, distancia, peso, velocidad, temperatura y volumen!, puedes intentar con: Alexa, convierte 5 yardas a metros';
        let speechTextReprompt = 'Intenta con el siguiente ejemplo: Alexa, convierte 5 metros a yardas';
        if(supportsAPL(handlerInput)){
 
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechTextReprompt)
            .addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
                document: main,
                datasources: {
                  'aplData': {
                    'message': speechText,
                    'image': unidadesMedidaImg
                  }
                }
            })
            .getResponse();
        }
        else{
            return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Convertidor Unidades', speechText)
            .getResponse();
      }
    }
};
 
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = '¡Gracias por utilizar esta skill, adiós!';
        if(supportsAPL(handlerInput)){
        return handlerInput.responseBuilder
            .speak(speechText)
            .addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
                document: main,
                datasources: {
                  'aplData': {
                    'message': speechText,
                    'image': 'https://cdn0.iconfinder.com/data/icons/emotions-line/2048/1656_-_Bye-512.png'
                  }
                }
            })
            .withShouldEndSession(true)
            .getResponse();
        }
        else{
            return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Convertidor Unidades', speechText)
            .getResponse();
      }
    }
};
 
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        //any cleanup logic goes here
        return handlerInput.responseBuilder.getResponse();
    }
};
 
const ErrorHandler = {
    canHandle() {
      return true;
    },
   
    handle(handlerInput, error) {
        const request = handlerInput.requestEnvelope.request;
 
        console.log(`Error handled: ${error.message}`);
 
if(!request.intent.slots.unidadX){
        let UnidadXCode = request.intent.slots.unidadX.resolutions.resolutionsPerAuthority[0].status.code;
        let UnidadYCode = request.intent.slots.unidadY.resolutions.resolutionsPerAuthority[0].status.code;
        let UnidadXValue = request.intent.slots.unidadX.value;
        let UnidadYValue = request.intent.slots.unidadY.value;
        let unidadMedida;
        let sisConversion;
        let errorImg = "https://image.flaticon.com/icons/svg/177/177841.svg";
 
        if((UnidadXCode == 'ER_SUCCESS_NO_MATCH' && UnidadYCode == 'ER_SUCCESS_MATCH')||
            (UnidadXCode == 'ER_SUCCESS_MATCH' && UnidadYCode == 'ER_SUCCESS_NO_MATCH')) {
            if(UnidadXCode == 'ER_SUCCESS_NO_MATCH'){
                sisConversion = sistemaConversion(UnidadYValue);
                unidadMedida= sisConversion[0];
               
                let arraySplice = unidadMedida;
                arraySplice.splice(unidadMedida.indexOf(UnidadYValue),1);
                let speechText =`No es válida la unidad ${UnidadXValue}, solo puedo convertir de ${UnidadYValue} a ${arraySplice} `;
 
                if(supportsAPL(handlerInput)){
 
                return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    version: '1.0',
                    document: main,
                    datasources: {
                      'aplData': {
                        'message': speechText,
                        'image': errorImg
                      }
                    }
                })
                .getResponse();
            }
            else{
                return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .withSimpleCard('Convertidor Unidades', speechText)
                .getResponse();
          }           
            }
            else {
                sisConversion = sistemaConversion(UnidadXValue);
                unidadMedida= sisConversion[0];
                let arraySplice = unidadMedida;
                arraySplice.splice(unidadMedida.indexOf(UnidadXValue),1);
                let speechText = `No es válida la unidad ${UnidadYValue}, solo puedo convertir de ${UnidadXValue} a ${arraySplice} `;
 
                if(supportsAPL(handlerInput)){
 
                return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    version: '1.0',
                    document: main,
                    datasources: {
                      'aplData': {
                        'message': speechText,
                        'image': errorImg
                      }
                    }
                })
                .getResponse();
            }
            else{
                return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .withSimpleCard('Convertidor Unidades', speechText)
                .getResponse();
          }           
            }
        }
        else{
            let speechText = 'Lo siento, no entiendo lo que quisiste decir. ¿Lo puedes repetir?'
            if(supportsAPL(handlerInput)){
            return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Puedo convertir unidades de rendimiento de combustible, distancia, peso, velocidad, temperatura y volumen!, puedes intentar con: Convierte 6 litros a mililitros')
            .addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
                document: main,
                datasources: {
                  'aplData': {
                    'message': speechText,
                    'image': errorImg
                  }
                }
            })
            .getResponse();
        }
        else{
            return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Convertidor Unidades', speechText)
            .getResponse();
      }           
        }
    }
    else{
       let  speechText = "Lo siento no entendi, porfavor vuelve a intentar."
            return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Convertidor Unidades', speechText)
            .getResponse();
      }           
    }
};
 
exports.handler = skillBuilder
.addRequestHandlers(
LaunchRequestHandler,
UnitConversionIntentHandler,
ConvertXYIntentHandler,
HelpIntentHandler,
CancelAndStopIntentHandler,
SessionEndedRequestHandler
)
.addErrorHandlers(ErrorHandler)
.lambda();