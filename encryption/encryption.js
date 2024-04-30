function encrypt(text, shift) {
    let encryptedText = "";

    for (let i = 0; i < text.length; i++) {
        let char = text[i];

        // Encrypt uppercase letters
        if (char.match(/[A-Z]/)) {
            let code = text.charCodeAt(i);
            code = (code - 65 + shift) % 26 + 65;
            encryptedText += String.fromCharCode(code);
        }
        // Encrypt lowercase letters
        else if (char.match(/[a-z]/)) {
            let code = text.charCodeAt(i);
            code = (code - 97 + shift) % 26 + 97;
            encryptedText += String.fromCharCode(code);
        }
        // Keep other characters unchanged
        else {
            encryptedText += char;
        }
    }

    return encryptedText;
}

function decrypt(text, shift) {
    return encrypt(text, (26 - shift) % 26);
}

// Example usage
let plaintext = "Hello, World!";
let shift = 5;
let encryptedText = encrypt(plaintext, shift);
let decryptedText = decrypt(encryptedText, shift);

console.log("Plaintext:", plaintext);
console.log("Encrypted:", encryptedText);
console.log("Decrypted:", decryptedText);