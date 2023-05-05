const helper = require('../helpers/validators/users.validator.js');
let chai = require('chai');
let expect = chai.expect;

describe('Users', () => {
    describe('Create a user', () => {
        it('All fields should be required (1)', () => {
            // SETUP: Her defineres et user objekt uden navn som vi bruger i funktionen
            let user = {
                name: "",
                email: "fds@fds.dk",
                password: "123456",
                confirm: "123456"
            };

            // EXERCISE: Nu indsætter vi user objektet i funktionen
            let result = helper.validateCreate(user, undefined);

            // VERIFY: Med chai kan vi nu teste om resultatet er det forventede
            expect(result).to.equal('All fields are required');
        });

        it('All fields should be required (2)', () => {
            // SETUP: Her defineres et user objekt uden navn som vi bruger i funktionen
            let user = {
                name: "",
                email: "",
                password: "123456",
                confirm: "123456"
            };

            // EXERCISE: Nu indsætter vi user objektet i funktionen
            let result = helper.validateCreate(user, undefined);

            // VERIFY: Med chai kan vi nu teste om resultatet er det forventede
            expect(result).to.equal('All fields are required');
        });

        it('Password and confirm password should be equal', () => {
            // SETUP: Her defineres et user objekt med forskellige passwords som vi bruger i funktionen
            let user = {
                name: "Thøger",
                email: "fds@fds.dk",
                password: "123456",
                confirm: "1234567"
            };

            // EXERCISE: Nu indsætter vi user objektet i funktionen
            let result = helper.validateCreate(user, undefined);

            // VERIFY: Med chai kan vi nu teste om resultatet er det forventede
            expect(result).to.equal('Passwords do not match');
        });

        it('Email should not already exist', () => {
            // SETUP: Her defineres to user objekter, der har samme email, som vi bruger i funktionen
            let user = {};
            let dbUser = {};

            // EXERCISE: Nu indsætter vi begge objekter i funktionen
            let result = helper.validateCreate(user, dbUser);

            // VERIFY: Med chai kan vi nu teste om resultatet er det forventede
            expect(result).to.equal('Email already exists');
        });

        it('Password should be at least 6 characters', () => {
            // SETUP: Her defineres et user objekt, der har en kode på 4 tegn, som vi bruger i funktionen
            let user = {
                name: "Thøger",
                email: "fds@fds.dk",
                password: "1234",
                confirm: "1234"
            };

            // EXERCISE: Nu indsætter vi objektet i funktionen
            let result = helper.validateCreate(user, undefined);

            // VERIFY: Med chai kan vi nu teste om resultatet er det forventede
            expect(result).to.equal('Password must be at least 6 characters');
        });

        it('If all requirements are filled, the user should be verified', () => {
            // SETUP: Her defineres et user objekt, der opfylder alle krav, som vi bruger i funktionen
            let user = {
                name: "Thøger",
                email: "fds@fds.dk",
                password: "123456",
                confirm: "123456"
            };

            // EXERCISE: Nu indsætter vi objektet i funktionen
            let result = helper.validateCreate(user, undefined);

            // VERIFY: Med chai kan vi nu teste om resultatet er det forventede
            expect(result).to.equal(true);
        });
    });
});
