
var express = require('express');

var app = express();
app.use(bodyParser.json());

const JSEncrypt = require('node-jsencrypt');

const MoipCreditCard = require('moip-sdk-js').MoipCreditCard;
const MoipValidator  = require('moip-sdk-js').MoipValidator;


const pubKey =  `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvariSutAWZzCuMyZ+BlY
				 XyE32Rv1BfNzYQBjePBvRXZWVZRCr5A0vEo8mqdwyvcqHLhQleKzrSW+c/+l6cBY
				 TPfnx1VEg4yqvqQCq3zTLDrmxJtgrfMAJCoHBEZ+Xa2QXUrR7V2gWls3A9kWfUaS
				 22vMm4pCyWeNPvoxX3dxjfU3KC7ll9rW0DL2BbIymZ0myH8gFUkI68zPU0uGyVXE
				 2GQ2hg1Uu+Ke48xbcxpNG0WbjMt1pS3JjGt+avic4bt++BzmmbTIqlOWNAnjFdlm
				 uSwuzxqnK+HHOly0lnXq4LRDefJ6w8Ze6/nPgCFDzZ6/nioQiXqv30JgjBQjO2SR
				 cwIDAQAB`;	


app.get('/', function (req, res) {

	if(req.query.number){

		if(req.query.cvc){

			if(req.query.expirationMonth){

				if(req.query.expirationYear){

					// console.log(req.query.number);
					// console.log(req.query.cvc);
					// console.log(req.query.expirationMonth);
					// console.log(req.query.expirationYear);	

					if ( MoipValidator.isValidNumber(req.query.number) ) {

						if( MoipValidator.isExpiryDateValid(req.query.expirationMonth, req.query.expirationYear) ){


							var cardType = MoipValidator.cardType(req.query.number);
							var bandeira = cardType.brand;							

        					if (bandeira == 'MASTERCARD' || bandeira == 'VISA' || bandeira == 'AMEX' || bandeira == 'DINERS' || bandeira == 'HIPERCARD' || bandeira == 'HIPER' || bandeira == 'ELO') {


								MoipCreditCard.setEncrypter(JSEncrypt, 'node').setPubKey(pubKey).setCreditCard({
							        number: req.query.number,
							        cvc: req.query.cvc,
							        expirationMonth: req.query.expirationMonth,
							        expirationYear: req.query.expirationYear
							    }).hash().then(
							    	hashCard => res.send(JSON.stringify({ status: 'sucesso', hash: hashCard }))
							    );	
							    
        					}
        					else {
        						res.send(JSON.stringify({ status: 'erro', mensagem: 'Não trabalhamos com essa operadora de cartão de crédito' }))
        					}
						}
						else{
							res.send(JSON.stringify({ status: 'erro', mensagem: 'Data de validade inválida.' }))
						}	
					}
					else{
						res.send(JSON.stringify({ status: 'erro', mensagem: 'Número do cartão inválido.' }))
					}
				}
				else{
					res.send(JSON.stringify({ status: 'erro', mensagem: 'Informe a data e validade do cartão.' }))
				}
			}
			else{
				res.send(JSON.stringify({ status: 'erro', mensagem: 'Informe a data e validade do cartão.' }))
			}
		}
		else{
			res.send(JSON.stringify({ status: 'erro', mensagem: 'Informe o código de segurança do cartão.' }))
		}
	}
	else {
		res.send(JSON.stringify({ status: 'erro', mensagem: 'Informe o número do cartão.' }))
	}

});

const PORT = process.env.PORT;

app.listen(PORT, function () { 
  console.log('Example app listening on port 3000!');
});
