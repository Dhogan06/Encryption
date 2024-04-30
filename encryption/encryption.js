class CaesarCipher {
    constructor(shift) {
        this.shift = shift;
    }

    // Helper function to scramble letters in the text based on a key
    scramble(text, key) {
        let scrambledText = "";
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            let charCode = char.charCodeAt(0);
            let scrambledCharCode = charCode;

            if (char.match(/[A-Za-z]/)) {
                let index = char.toUpperCase().charCodeAt(0) - 65;
                if (char === char.toLowerCase()) {
                    scrambledCharCode = key.charCodeAt(index) + 97;
                } else {
                    scrambledCharCode = key.charCodeAt(index) + 65;
                }
            } else if (char.match(/[0-9]/)) {
                let index = char.charCodeAt(0) - 48 + 26 + 26;
                scrambledCharCode = key.charCodeAt(index);
            } else {
                let index = key.indexOf(char);
                if (index !== -1) {
                    scrambledCharCode = index < 52 ? key.charCodeAt(index) + 65 : key.charCodeAt(index);
                }
            }

            scrambledText += String.fromCharCode(scrambledCharCode);
        }
        return scrambledText;
    }

    // Helper function to unscramble letters in the text based on a key
    unscramble(text, key) {
        let unscrambledText = "";
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            let charCode = char.charCodeAt(0);
            let unscrambledCharCode = charCode;

            if (char.match(/[A-Za-z]/)) {
                let index = char.toUpperCase().charCodeAt(0) - 65;
                if (char === char.toLowerCase()) {
                    unscrambledCharCode = key.indexOf(String.fromCharCode(charCode - 32)) + 97;
                } else {
                    unscrambledCharCode = key.indexOf(String.fromCharCode(charCode)) + 65;
                }
            } else if (char.match(/[0-9]/)) {
                let index = char.charCodeAt(0) - 48 + 26 + 26;
                unscrambledCharCode = key.indexOf(String.fromCharCode(charCode));
            } else {
                let index = key.indexOf(char);
                if (index !== -1) {
                    unscrambledCharCode = index < 52 ? key.indexOf(String.fromCharCode(charCode - 65)) + 65 : key.indexOf(String.fromCharCode(charCode));
                }
            }

            unscrambledText += String.fromCharCode(unscrambledCharCode);
        }
        return unscrambledText;
    }

    // Function to generate a random key
    generateKey() {
        let key = "";
        for (let i = 0; i < 26; i++) {
            key += String.fromCharCode(65 + i);
        }
        for (let i = 0; i < 10; i++) {
            key += String.fromCharCode(48 + i);
        }
        const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
        for (let i = 0; i < specialChars.length; i++) {
            key += specialChars[i];
        }
        return this.shuffle(key);
    }

    // Helper function to shuffle a string key using Fisher-Yates algorithm
    shuffle(key) {
        let shuffledKey = key.split('');
        for (let i = shuffledKey.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledKey[i], shuffledKey[j]] = [shuffledKey[j], shuffledKey[i]];
        }
        return shuffledKey.join('');
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
let plaintext = "Hello, World! @#$%^&*()123";
let key = cipher.generateKey();
let encryptedText = cipher.encrypt(plaintext, key);
let decryptedText = cipher.decrypt(encryptedText, key);

console.log("Plaintext:", plaintext);
console.log("Encrypted (Base64):", encryptedText);
console.log("Decrypted:", decryptedText);
