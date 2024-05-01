class DauigiEncryption {

    constructor() {
        this.createAlgorithm(
            (text, key, shift, passphrase) => {
                text = this.reverse(text);
                text = this.encrypt(text, shift);
                text = this.scramble(text, key, passphrase);
                text = this.base64Encode(text);
                return text;
            },
            (text, key, shift, passphrase) => {
                text = this.base64Decode(text);
                text = this.unscramble(text, key, passphrase);
                text = this.decrypt(text, shift);
                text = this.reverse(text);
                return text;
            }
        )
        this.createAlgorithm(
            (text, key, shift, passphrase) => {
                text = this.reverse(text);
                for (let i = 0; i < 2; i++) {
                    text = this.scramble(text, key, passphrase);
                    for (let j = 0; j < 3; j++) {
                        text = this.encrypt(text, shift);
                    }
                    for (let j = 0; j < 4; j++) {
                        text = this.reverse(text);
                        text = this.base64Encode(text);
                    }
                }
                return text;
            },
            (text, key, shift, passphrase) => {
                for (let i = 0; i < 2; i++) {
                    for (let j = 0; j < 4; j++) {
                        text = this.base64Decode(text);
                        text = this.reverse(text);
                    }
                    for (let j = 0; j < 3; j++) {
                        text = this.decrypt(text, shift);
                    }
                    text = this.unscramble(text, key, passphrase);
                }
                text = this.reverse(text);
                return text;
            }
        );
        this.#form = new this.#Form();
    }

    #algorithms = []

    createAlgorithm(encrypt, decrypt) {
        let algorithm = new this.#Algorithm();
        algorithm.encrypt = encrypt;
        algorithm.decrypt = decrypt;
        this.#algorithms.push(algorithm);
    }

    scramble(text, key, passphrase) {
        key = this.#decryptKey(key, passphrase);
        key = this.#prepareKey(key);
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

    unscramble(text, key, passphrase) {
        key = this.#decryptKey(key, passphrase);
        key = this.#prepareKey(key);
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

    #prepareKey(key) {
        let keyArray = key.split('');
        for (let index = 0; index < keyArray.length; index++) {
            keyArray[index] = keyArray[index].charCodeAt(0) - 65;
        }
        return keyArray;
    }

    #decryptKey(key, passphrase) {
        key = this.base64Decode(key);
        key = this.decrypt(key, 7);
        key = this.reverse(key);

        return key.replace(passphrase + '|', '');
    }

    generateKey(passphrase) {
        const key = [...Array(26).keys()];
        let output = String.fromCharCode(...this.#shuffle(key).map(num => num + 65));

        output = passphrase + '|' + output;

        output = this.reverse(output);
        output = this.encrypt(output, 7);
        output = this.base64Encode(output);

        return output;
    }

    #shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    reverse(text) {
        return text.split('').reverse().join('');
    }

    base64Encode(text) {
        return btoa(text);
    }

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

    #Algorithm = class {
        constructor() {

        }

        encrypt = (text, key, shift, passphrase) => { }
        decrypt = (text, key, shift, passphrase) => { }
    }

    #Form = class {

        constructor(encryption) {
            this.passphrase = document.createElement('input');
            this.key = document.createElement('input');
            this.shift = document.createElement('input');
            this.algorithm = document.createElement('input');
            this.text = document.createElement('textarea');
            this.encryptBtn = document.createElement('button');
            this.decryptBtn = document.createElement('button');
            this.genKeyBtn = document.createElement('button');

            this.passphrase.placeholder = "Passphrase";
            this.key.placeholder = "Key";
            this.shift.placeholder = "Shift";
            this.algorithm.placeholder = "Algorithm";
            this.text.placeholder = "Text to be Encrypted or Decrypted";
            this.encryptBtn.innerHTML = "Encrypt";
            this.decryptBtn.innerHTML = "Decrypt";
            this.genKeyBtn.innerHTML = "Generate Key";

            this.shift.type = "number";
            this.algorithm.type = "number";

            this.shift.min = "0";
            this.shift.max = "26";
            this.algorithm.min = "1";
            this.algorithm.max = encryption.#algorithms.length;

            this.encryptBtn.onclick = this.#onEncrypt;
            this.decryptBtn.onclick = this.#onDecrypt;
            this.genKeyBtn.onclick = this.#onGenKey;

            document.body.appendChild(this.passphrase);
            document.body.appendChild(this.key);
            document.body.appendChild(this.shift);
            document.body.appendChild(this.algorithm);
            document.body.appendChild(this.text);
            document.body.appendChild(this.encryptBtn);
            document.body.appendChild(this.decryptBtn);
            document.body.appendChild(this.genKeyBtn);

            this.#encryption = encryption;
        }

        #onEncrypt() {
            this.text.value = this.#encryption.#algorithms[parseInt(algorithm.value) - 1].encrypt(text.value, key.value, shift.value, passphrase.value);
        }

        #onDecrypt() {
            this.text.value = this.#encryption.#algorithms[parseInt(algorithm.value) - 1].decrypt(text.value, key.value, shift.value, passphrase.value);
        }

        #onGenKey() {
            this.key.value = this.#encryption.generateKey(passphrase.value);
        }
    }
}

let encrypter = new DauigiEncryption();

