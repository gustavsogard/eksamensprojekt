exports.validateLogIn = (reqUser, dbUser) => {
    if (reqUser.email === '' || reqUser.password === '') {
        return 'All fields are required';
    }

    if (dbUser === undefined) {
        return 'Email does not exist';
    }

    if (dbUser.password !== reqUser.password) {
        return 'Incorrect password';
    }

    return true;
}

exports.validateCreate = (reqUser, dbUser) => {
    if (reqUser.name === '' || reqUser.email === '' || reqUser.password === '' || reqUser.confirm === '') {
        return 'All fields are required';
    }

    if (reqUser.password !== reqUser.confirm) {
        return 'Passwords do not match';
    }

    if (dbUser !== undefined) {
        return 'Email already exists';
    }

    if (reqUser.password.length < 6) {
        return 'Password must be at least 6 characters';
    }

    return true;
}

exports.validateUpdate = (reqUser, dbUser, email) => {
    if (reqUser.name === '' || reqUser.email === '' || reqUser.password === '' || reqUser.confirm === '') {
        return 'All fields are required';
    }

    if (reqUser.password !== reqUser.confirm) {
        return 'Passwords do not match';
    }

    if (dbUser !== undefined && reqUser.email !== email) {
        return 'Email does not exist';
    }

    if (reqUser.password.length < 6) {
        return 'Password must be at least 6 characters';
    }

    return true;
}