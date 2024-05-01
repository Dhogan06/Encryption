class DauigiEncryption {
    constructor() {
    }

    // Helper function to scramble letters in the text based on a key
    scramble(text, key, passphrase) {
        key = this.decryptKey(key, passphrase);
        key = this.prepareKey(key);
        let scrambledText = "";
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            if (char.match(/[A-Za-z]/)) {
                let index = char.toUpperCase().charCodeAt(0) - 65;
                if (char === char.toLowerCase()) {
                    scrambledText += String.fromCharCode(key[index] + 97);
                } else {
                    scrambledText += String.fromCharCode(key[index] + 65);
                }
            } else {
                scrambledText += char;
            }
        }
        return scrambledText;
    }

    // Helper function to unscramble letters in the text based on a key
    unscramble(text, key, passphrase) {
        key = this.decryptKey(key, passphrase);
        key = this.prepareKey(key);
        let unscrambledText = "";
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            if (char.match(/[A-Za-z]/)) {
                let index = char.toUpperCase().charCodeAt(0) - 65;
                if (char === char.toLowerCase()) {
                    unscrambledText += String.fromCharCode(key.indexOf(index) + 97);
                } else {
                    unscrambledText += String.fromCharCode(key.indexOf(index) + 65);
                }
            } else {
                unscrambledText += char;
            }
        }
        return unscrambledText;
    }

    prepareKey(key) {
        let keyArray = key.split('');
        for (let index = 0; index < keyArray.length; index++) {
            keyArray[index] = keyArray[index].charCodeAt(0) - 65;
        }
        return keyArray;
    }

    decryptKey(key, passphrase) {
        key = this.base64Decode(key);
        key = this.decrypt(key, 7);
        key = this.reverse(key);

        return key.replace(passphrase + '|', '');
    }

    // Function to generate a random key
    generateKey(passphrase) {
        const key = [...Array(26).keys()];
        let output = String.fromCharCode(...this.shuffle(key).map(num => num + 65));

        output = passphrase + '|' + output;

        output = this.reverse(output);
        output = this.encrypt(output, 7);
        output = this.base64Encode(output);

        return output;
    }

    // Helper function to shuffle an array using Fisher-Yates algorithm
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Function to reverse the text
    reverse(text) {
        return text.split('').reverse().join('');
    }

    // Function to encode text to base64
    base64Encode(text) {
        return btoa(text);
    }

    // Function to decode base64 text
    base64Decode(text) {
        return atob(text);
    }

    encrypt(text, shift) {
        shift = parseInt(shift);
        // Apply Caesar Cipher on the scrambled text
        let encryptedText = "";
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            let code = text.charCodeAt(i);

            // Encrypt uppercase letters
            if (char.match(/[A-Z]/)) {
                code = (code - 65 + shift) % 26 + 65;
            }
            // Encrypt lowercase letters
            else if (char.match(/[a-z]/)) {
                code = (code - 97 + shift) % 26 + 97;
            }
            encryptedText += String.fromCharCode(code);
        }

        return encryptedText;
    }

    decrypt(text, shift) {
        shift = parseInt(shift);
        // Decrypt Caesar Cipher
        let decryptedResult = "";
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            let code = text.charCodeAt(i);

            // Decrypt uppercase letters
            if (char.match(/[A-Z]/)) {
                code = (code - 65 - shift + 26) % 26 + 65;
            }
            // Decrypt lowercase letters
            else if (char.match(/[a-z]/)) {
                code = (code - 97 - shift + 26) % 26 + 97;
            }
            decryptedResult += String.fromCharCode(code);
        }

        return decryptedResult;
    }
}

let encrypter = new DauigiEncryption();
let keyTest = encrypter.generateKey('HelloHelloHelloHelloHelloHello');
console.log(keyTest);
console.log(encrypter.decryptKey(keyTest));

function encrypt(text, key, shift, passphrase) {
    text = encrypter.reverse(text);
    for (let i = 0; i < 2; i++) {
        text = encrypter.scramble(text, key, passphrase);
        for (let j = 0; j < 3; j++) {
            text = encrypter.encrypt(text, shift);
        }
        for (let j = 0; j < 4; j++) {
            text = encrypter.reverse(text);
            text = encrypter.base64Encode(text);
        }
    }
    return text;
}

function decrypt(text, key, shift, passphrase) {
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 4; j++) {
            text = encrypter.base64Decode(text);
            text = encrypter.reverse(text);
        }
        for (let j = 0; j < 3; j++) {
            text = encrypter.decrypt(text, shift);
        }
        text = encrypter.unscramble(text, key, passphrase);
    }
    text = encrypter.reverse(text);
    return text;
}



// Example usage
// let cipher = new DauigiEncryption();

// let plaintext = "abcdefghijklmnopqrstuvwxyz";
// let key = encrypter.generateKey();

// let encryptedText = encrypt(plaintext, key, 6);
// let decryptedText = decrypt(encryptedText, key, 6);

// console.log(encryptedText);
// console.log(decryptedText);


// let preparedKey = cipher.prepareKey(key);
// let scrambledText = cipher.scramble(plaintext, key);
// let unscrambledText = cipher.unscramble(scrambledText, key);
// let encryptedText = cipher.encrypt(plaintext, 5);
// let decryptedText = cipher.decrypt(encryptedText, 5);
// let reversedText = cipher.reverse(plaintext);
// let unreversedText = cipher.reverse(reversedText);

// console.log("Plain Text:", plaintext);
// console.log("Key:", key);
// console.log("Prepared Key:", preparedKey);
// console.log("Scrambled:", scrambledText);
// console.log("Unscrambled:", unscrambledText);
// console.log("Encrypted:", encryptedText);
// console.log("Decrypted:", decryptedText);
// console.log("Reversed:", reversedText);
// console.log("Unreversed:", unreversedText);