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
        );
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

        let passphrase = document.createElement('input');
        let key = document.createElement('input');
        let shift = document.createElement('input');
        let algorithm = document.createElement('input');
        let text = document.createElement('textarea');
        let encryptBtn = document.createElement('button');
        let decryptBtn = document.createElement('button');
        let genKeyBtn = document.createElement('button');

        passphrase.placeholder = "Passphrase";
        key.placeholder = "Key";
        shift.placeholder = "Shift";
        algorithm.placeholder = "Algorithm";
        text.placeholder = "Text to be Encrypted or Decrypted";
        encryptBtn.innerHTML = "Encrypt";
        decryptBtn.innerHTML = "Decrypt";
        genKeyBtn.innerHTML = "Generate Key";

        text.cols = "45";
        text.rows = "15";

        shift.type = "number";
        algorithm.type = "number";

        shift.min = "0";
        shift.max = "26";
        algorithm.min = "1";
        algorithm.max = this.#algorithms.length;

        encryptBtn.onclick = () => {
            if (key != '' && shift != '' && algorithm != '') {
                text.value = this.#algorithms[parseInt(algorithm.value) - 1].encrypt(text.value, key.value, shift.value, passphrase.value);
            }
        };
        decryptBtn.onclick = () => {
            if (key != '' && shift != '' && algorithm != '') {
                text.value = this.#algorithms[parseInt(algorithm.value) - 1].decrypt(text.value, key.value, shift.value, passphrase.value);
            }
        };
        genKeyBtn.onclick = () => {
            key.value = this.generateKey(passphrase.value);
        };

        document.body.appendChild(passphrase);
        document.body.appendChild(key);
        document.body.appendChild(shift);
        document.body.appendChild(algorithm);
        document.body.appendChild(text);
        document.body.appendChild(encryptBtn);
        document.body.appendChild(decryptBtn);
        document.body.appendChild(genKeyBtn);
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
}

let encrypter = new DauigiEncryption();