class CaesarCipher {
    constructor(shift) {
        this.shift = shift;
    }

    // Helper function to scramble letters in the text based on a key
    scramble(text, key) {
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
    unscramble(text, key) {
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
            keyArray[index] = keyArray[index].charCodeAt(0);
        }
        return keyArray;
    }

    // Function to generate a random key
    generateKey() {
        const key = [...Array(26).keys()];
        return String.fromCharCode(this.shuffle(key));
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

    encrypt(text) {
        // Apply Caesar Cipher on the scrambled text
        let encryptedText = "";
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            let code = text.charCodeAt(i);

            // Encrypt uppercase letters
            if (char.match(/[A-Z]/)) {
                code = (code - 65 + this.shift) % 26 + 65;
            }
            // Encrypt lowercase letters
            else if (char.match(/[a-z]/)) {
                code = (code - 97 + this.shift) % 26 + 97;
            }
            encryptedText += String.fromCharCode(code);
        }

        return encryptedText;
    }

    decrypt(text) {
        // Decrypt Caesar Cipher
        let decryptedResult = "";
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            let code = text.charCodeAt(i);

            // Decrypt uppercase letters
            if (char.match(/[A-Z]/)) {
                code = (code - 65 - this.shift + 26) % 26 + 65;
            }
            // Decrypt lowercase letters
            else if (char.match(/[a-z]/)) {
                code = (code - 97 - this.shift + 26) % 26 + 97;
            }
            decryptedResult += String.fromCharCode(code);
        }

        return decryptedResult;
    }
}

// Example usage
let cipher = new CaesarCipher(3);
let plaintext = "Hello, World!";
let key = cipher.generateKey();
let preparedKey = cipher.prepareKey(key);
let scrambledText = cipher.scramble(plaintext, key);
let unscrambledText = cipher.unscramble(scrambledText, key);
let encryptedText = cipher.encrypt(plaintext);
let decryptedText = cipher.decrypt(encryptedText);

console.log("Plain Text:", plaintext);
console.log("Key:", key);
console.log("Prepared Key:", preparedKey);
console.log("Scrambled:", scrambledText);
console.log("Unscrambled:", unscrambledText);
console.log("Encrypted:", encryptedText);
console.log("Decrypted:", decryptedText);
