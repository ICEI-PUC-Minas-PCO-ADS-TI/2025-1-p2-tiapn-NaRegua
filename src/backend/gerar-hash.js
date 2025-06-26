// gerar-hash.js
const bcrypt = require('bcryptjs');
const password = 'admin123'; // A senha que queremos criptografar
const saltRounds = 10;

console.log(`Gerando hash para a senha: "${password}"`);

bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
        console.error("Erro ao gerar o hash:", err);
        return;
    }
    console.log("\n✅ NOVO HASH GERADO (copie a linha abaixo, sem aspas):");
    console.log(hash);
    console.log("\nUse este hash no comando UPDATE do MySQL.");
});