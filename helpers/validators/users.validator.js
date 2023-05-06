const bcrypt = require('bcryptjs');

exports.validateLogIn = async (reqUser, dbUser) => {
    if (reqUser.email === '' || reqUser.password === '') {
        return 'Alle feltet er påkrævet';
    }

    if (dbUser === undefined) {
        return 'Email findes ikke';
    }

    if (!(await bcrypt.compare(reqUser.password, dbUser.password))) {
        return 'Forkert kodeord';
    }

    return true;
}

exports.validateCreate = (reqUser, dbUser) => {
    if (reqUser.name === '' || reqUser.email === '' || reqUser.password === '' || reqUser.confirm === '') {
        return 'Alle felter er påkrævet';
    }

    if (reqUser.password !== reqUser.confirm) {
        return 'Kodeordene er ikke ens';
    }

    if (dbUser !== undefined) {
        return 'Email findes allerede';
    }

    if (reqUser.password.length < 6) {
        return 'Kodeordet skal være mindst 6 tegn';
    }

    return true;
}

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