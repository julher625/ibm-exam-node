const express = require('express');
const router = express.Router();
const encryptionService = require('../services/cryptography/cryptographyService');



// Routes

router.get('/llaves', (req, res) => {
    const publicKey = encryptionService.getPublicKey();
    const privateKey = encryptionService.getPrivateKey();
    res.send(JSON.stringify(publicKey));
});


router.post('/escenario',(req, res) =>{

    
    encryptionService.decryptData(req.body.escenario).then((data)=>{

        
        if(data == null){
            res.sendStatus(403);
        }else if(data.flujo == "inicio"){
            
            encryptionService.encryptData('{"flujo":"Formulario"}').then((data2)=>{
                res.json(data2);
            });
        }


    });
    

})
module.exports = router;
