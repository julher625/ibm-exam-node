const express = require('express');
const router = express.Router();
const encryptionService = require('../services/cryptography/cryptographyService');



// Routes

router.get('/llaves', (req, res) => {
    const publicKey = encryptionService.getPublicKey();
    const privateKey = encryptionService.getPrivateKey();
    const keys = {
        publicKey: publicKey,
        privateKey: privateKey
    };
    console.log(keys)
    res.send(JSON.stringify(keys));

});


router.post('/escenario',(req, res) =>{

    console.log(req.body.escenario)
    encryptionService.decryptData(req.body.escenario).then((data)=>{

        if(data){
            console.log("================================")

            console.log(data)
        }
        if(data == null){
            res.sendStatus(403);
        }else if(data.flujo == "inicio"){
            
            encryptionService.encryptData('{"flujo":"Formulario"}').then((flow)=>{
                res.json(flow);
            });
        }else if(data.flujo == "Formulario"){
            if(data.numDocumento && data.nombre){
                let json =  '{“exitoso”: true, “mensaje”: "¡DATOSRECIBIDOS!"}'
                // console.log(json)
                encryptionService.encryptData(json).then((succesMessage)=>{
                    // console.log(succesMessage)
                    res.json(succesMessage);
                });
            }
        }


    });
    

})
module.exports = router;
