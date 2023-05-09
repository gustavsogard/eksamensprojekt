const bcrypt = require('bcryptjs');
// validateLogin funktionen biver skabt for at tjekke om det er de rigtige oplysninger der bliver givet
// der bliver modtaget 2 parametrer: reqUser: Det information brugeren giver når de logger på og dbUser: Brugere i databasen
exports.validateLogIn = async (reqUser, dbUser) => {
    // der bliver tjekket om email og password er blevet fyldt, hvis ikke bliver der returneret 'Alle felter er påkrævet'
    if (reqUser.email === '' || reqUser.password === '') {
    return 'Alle feltet er påkrævet';
    }
    // Hvis der ikke eksister en bruger i databasen med den email bliver 'Email findes ikke' returneret
    if (dbUser === undefined) {
        return 'Email findes ikke';
    }
    // bcrypt tjekker om det hashede passwordet stemmer overens med det hashede password der er i databasen
    // hvis det ikke stemmer overens bliver der returneret 'Forkert kodeord'
    if (!(await bcrypt.compare(reqUser.password, dbUser.password))) {
        return 'Forkert kodeord';
    }
    // hvis alt stemmer overens bliver der returneret true
    return true;
}
// validateCreate funktionen bliver defineret for at skabe en ny profil
// der bliver modtaget 2 parametrer: reqUser: Det information brugeren giver når de logger på og dbUser: Brugere i databasen
exports.validateCreate = (reqUser, dbUser) => {
    // der bliver tjekket om alle fire felter er blevet fyldt, hvis ikke bliver der returneret 'Alle felter er påkrævet'
    if (reqUser.name === '' || reqUser.email === '' || reqUser.password === '' || reqUser.confirm === '') {
        return 'Alle felter er påkrævet';
    }
    // hvis man har tastet 2 forskellige passwords bliver der returneret 'Kodeordene er ikke ens'
    if (reqUser.password !== reqUser.confirm) {
        return 'Kodeordene er ikke ens';
    }
    // hvis dbUser ikke er undefined betyder der allerede eksister en profil med den email, 'Email findes allerede' bliver returneret
    if (dbUser !== undefined) {
        return 'Email findes allerede';
    }
    // hvis password er mindre end 6 karakter bliver 'Kodeordet skal være mindst 6 tegn' returneret
    if (reqUser.password.length < 6) {
        return 'Kodeordet skal være mindst 6 tegn';
    }
    // hvis alt stemmer overens bliver der returneret true    
    return true;
}
// validateUpdate funktionen bliver skabt fora t updatere profilen. 
// de samme felter bliver tjekket som tidligere
exports.validateUpdate = (reqUser, dbUser, email) => {
    if (reqUser.name === '' || reqUser.email === '' || reqUser.password === '' || reqUser.confirm === '') {
        return 'Alle felter er påkrævet';
    }

    if (reqUser.password !== reqUser.confirm) {
        return 'Kodeordene er ikke ens';
    }

    if (dbUser !== undefined && reqUser.email !== email) {
        return 'Email findes allerede';
    }

    if (reqUser.password.length < 6) {
        return 'Kodeordet skal være mindst 6 tegn';
    }

    return true;
}