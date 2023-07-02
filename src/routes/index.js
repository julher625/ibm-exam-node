const express = require('express');
const router = express.Router();
const encryptionService = require('../services/cryptography/cryptographyService');



// Routes

router.get('/llaves', (req, res) => {
    const publicKey = encryptionService.getPublicKey();
    const privateKey = encryptionService.getPrivateKey();
    const keys = {
        publicKey: publicKey.replaceAll("\r\n", ""),
        privateKey: privateKey.replaceAll("\r\n", "")
    };
    res.send(JSON.stringify(keys));

});


router.post('/escenario',(req, res) =>{

    // console.log(req.body.escenario)
    encryptionService.decryptData(req.body.escenario).then((data)=>{

        const jsonData = JSON.parse(data)

        if(data == null){
            res.sendStatus(403);
        }else if(jsonData.flujo == "inicio"){
            
            encryptionService.encryptData('{"flujo":"Formulario"}').then((flow)=>{
                res.json(flow);
            });
        }else if(jsonData.flujo == "Formulario"){
            if(jsonData.numDocumento && jsonData.nombre){

                if(jsonData.numDocumento != "null" && jsonData.numDocumento != "undefined" &&
                    jsonData.nombre != "null" && jsonData.nombre!= "undefined" ){
                        console.log(jsonData.nombre)
                        let json =  '{"exitoso": true, "mensaje": "¡DATOS RECIBIDOS!"}'
                        encryptionService.encryptData(json).then((succesMessage)=>{
                        res.json(succesMessage);
                        });
                    }else{
                        let json =  '{"exitoso": false, "mensaje": "¡DATOS INCORRECTOS!"}'
                        encryptionService.encryptData(json).then((succesMessage)=>{
                        res.json(succesMessage);
                        console.log('Request:%s\nResponse:%s',req,res)
                        });
                    }

            }else{
                let json =  '{"exitoso": false, "mensaje": "¡DATOS INCORRECTOS!"}'
                encryptionService.encryptData(json).then((succesMessage)=>{
                res.json(succesMessage);
                console.log('Request:%s\nResponse:%s',req,res)
                });
            }
        }


    });
    

})
module.exports = router;
