const jose = require('node-jose');

let encryptor;
let decryptor;
let publicKey;
let privateKey;
let keyPairGenerationPromise;
var keystore = jose.JWK.createKeyStore();
let key;
// Generate RSA key pair
function generateKeyPair() {
//   const keystore = jose.JWK.createKeyStore();
  keyPairGenerationPromise = keystore.generate('RSA', 2048, { alg: 'RSA-OAEP-256' })
    .then((result) => {

        publicKey = result.toPEM().replaceAll("\r\n", "");
        privateKey = result.toPEM(true).replaceAll("\r\n", "");
        key = result
        console.log("Keys generated")
    })
    .catch(error => {
      console.error('Key pair generation failed:', error);
      throw error;
    });
}


// Encrypt data using the encryptor
async function encryptData(data) {
  await keyPairGenerationPromise;

  try {
    const encrypted = await jose.JWE.createEncrypt({ format: 'compact', algorithm: 'A256CBCHS512' },key)
    .update(data, 'utf8').final()
    return encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
}

// Decrypt data using the decryptor
async function decryptData(encryptedData) {
  await keyPairGenerationPromise;
    

  try {
    
    const flow = await jose.JWK.asKey(privateKey,"pem").then((key) => {      
        const decryptor = jose.JWE.createDecrypt(key);
        const result = decryptor.decrypt(encryptedData)
        .then((result)=>{
          return result.plaintext.toString('utf8')
        });
        return result
        
      }).then((res)=>{
        return res;
      })
      return flow


  } catch (error) {
    console.error('Decryption failed:', error);
    throw error;
  }
}

// Get the generated public key
function getPublicKey() {
  return publicKey;
}
// Get the generated private key
function getPrivateKey() {
  return privateKey;
}

// Generate key pair on service startup
generateKeyPair();

module.exports = {
  encryptData,
  decryptData,
  getPublicKey,
  getPrivateKey,
};
