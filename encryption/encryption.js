class CaesarCipher {
    constructor(shift) {
        this.shift = shift;
    }

    // Helper function to scramble letters in the text based on a key
    scramble(text, key) {
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

    // Function to generate a random key
    generateKey() {
        const key = [...Array(26).keys()];
        return this.shuffle(key);
    }

    // Helper function to shuffle an array using Fisher-Yates algorithm
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    encrypt(text, key) {
        // If no key is provided, generate a random key
        if (!key) {
            key = this.generateKey();
        }

        // Scramble the text
        const scrambledText = this.scramble(text, key);

        // Apply Caesar Cipher on the scrambled text
        let encryptedText = "";
        for (let i = 0; i < scrambledText.length; i++) {
            let char = scrambledText[i];
            let code = scrambledText.charCodeAt(i);

            // Encrypt uppercase letters
            if (char.match(/[A-Z]/)) {
                code = (code - 65 + this.shift) % 26 + 65;
            }
            // Encrypt lowercase letters
            else if (char.match(/[a-z]/)) {
                code = (code - 97 + this.shift) % 26 + 97;
            }
            // Encrypt digits
            else if (char.match(/[0-9]/)) {
                code = (code - 48 + this.shift) % 10 + 48;
            }
            // Encrypt special characters
            else {
                code = (code + this.shift);
            }
            encryptedText += String.fromCharCode(code);
        }

        return btoa(encryptedText);
    }

    decrypt(text, key) {
        let decryptedText = atob(text);

        // Decrypt Caesar Cipher
        let decryptedResult = "";
        for (let i = 0; i < decryptedText.length; i++) {
            let char = decryptedText[i];
            let code = decryptedText.charCodeAt(i);

            // Decrypt uppercase letters
            if (char.match(/[A-Z]/)) {
                code = (code - 65 - this.shift + 26) % 26 + 65;
            }
            // Decrypt lowercase letters
            else if (char.match(/[a-z]/)) {
                code = (code - 97 - this.shift + 26) % 26 + 97;
            }
            // Decrypt digits
            else if (char.match(/[0-9]/)) {
                code = (code - 48 - this.shift + 10) % 10 + 48;
            }
            // Decrypt special characters
            else {
                code = (code - this.shift);
            }
            decryptedResult += String.fromCharCode(code);
        }

        // Unscramble the text using the provided key
        const unscrambledText = this.unscramble(decryptedResult, key);

        return unscrambledText;
    }
}

// Example usage
let cipher = new CaesarCipher(3);
let plaintext = "Hello, World! @#$%^&*()";
let key = cipher.generateKey();
let key2 = cipher.generateKey();
let encryptedText = cipher.encrypt(plaintext, key);
let decryptedText = cipher.decrypt(encryptedText, key2);

console.log("Plaintext: ", plaintext);
console.log("Key: ", key);
console.log("Encrypted (Base64): ", encryptedText);
console.log("Decrypted: ", decryptedText);
