//Henter User modellen, validator-funktioner og bcrytp-modulet
const Users = require('../models/User.js');
const { validateLogIn, validateCreate, validateUpdate } = require('../helpers/validators/users.validator');
const bcrypt = require('bcryptjs');

//Definerer renderLogin-funktion
exports.renderLogIn = (req, res) => {
    //Ser om brugeren er logget ind, hvis der er tilfældes sendes brugeren bare til forsiden
    if (req.session.loggedin) {
        res.redirect('/');
        return;
    }
    //Hvis ikke renderes login-siden
    res.render('../views/pages/login.ejs', {error: ''});
}

//Definerer login-funktion
exports.logIn = async (req, res) => {
    //Får de oplysninger brugeren har oplyst i requestens body
    const reqUser = req.body;
    //Henter brugeren fra databasen baseret på den email brugeren har oplyst i login
    const dbUser = await Users('get', {email: reqUser.email});
    //Ser om oplysningerne er korrekte ved hjælp af helper-funktion
    const validate = await validateLogIn(reqUser, dbUser);

    //Hvis valideringen ikke går igennem får brugeren en fejl
    if (validate !== true) {
        res.render('../views/pages/login.ejs', {error: validate});
        return;
    } else {
        //Ellers sættes express-session til at være logget ind samt gemmer oplysninger op den brugere der er logget ind
        req.session.loggedin = true;
        req.session.user = dbUser;
        //Brugeren viderestilles til forsiden
        res.redirect('/');
    }
}

//Definerner renderregister-funktionen
exports.renderRegister = (req, res) => {
    //Tjekker om brugeren er logget ind, hvis det er tilfældes sendes brugeren til forsiden
    if (req.session.loggedin) {
        res.redirect('/');
        return;
    }
    //Hvis ikke sendes brugeren til opret-siden
    res.render('../views/pages/register.ejs', {error: ''});
}

//Definerer createUser-funktionen
exports.createUser = async (req, res) => {
    //Laver en variabel med de oplysninger brugeren har sendt med i requesten
    const reqUser = req.body;
    //Henter brugere fra databasen ved hjælp af Model ud fra den email brugeren har skrevet
    const dbUser = await Users('get', {email: reqUser.email});
    //Tjekker om brugeren kan oprettes baseret på parametre sat i helper-funktionen
    const validate = validateCreate(reqUser, dbUser);

    //Hvis valideringen ikke går igennem får brugeren en fejlmeddelelse
    if (validate !== true) {
        res.render('../views/pages/register.ejs', {error: validate});
    } else {
        //Hvis valideringen er godkendt oprettes et salt og brugerens password hashes
        const salt = await bcrypt.genSalt(10);
        reqUser.password = await bcrypt.hash(reqUser.password, salt);
        //Brugeren bliver oprettet i databasen ved hjælp af Users modellen
        Users('create', {name: reqUser.name, email: reqUser.email, password: reqUser.password});
        //Brugeren sendes til login-siden og kan logge ind
        res.redirect('/login');
    }
}

//Definerer renderAccount-funkttionen
exports.renderAccount = (req, res) => {
    //Tjekker om brugeren er logget ind, hvis det ikke er tilfældes sendes brugeren til login-siden
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }
    //Ellers vises brugerens profil-side
    res.render('../views/pages/account.ejs', { error: '' });
}

//Definerer updateUser-funktion
exports.updateUser = async (req, res) => {
    //Definerer en variabel med de oplysninger brugeren har angivet
    const reqUser = req.body;
    //Henter brugere fra databasen ved hjælp af Users modellen baseret ud fra den email brugeren har angivet
    const dbUser = await Users('get', {email: reqUser.email});
    //Validerer om brugeren kan oprettes baseret på parametre i helper-funktionen
    const validate = validateUpdate(reqUser, dbUser, req.session.user.email);

    //Hvis valideringen ikke er godkendt får brugeren en fejlmeddelelse
    if (validate !== true) {
        res.render('../views/pages/account.ejs', {error: validate});
        return;
    } else {
        //Ellers defineres en salt og adgangskoden hashes ved hjælp af bcrypt
        const salt = await bcrypt.genSalt(10);
        reqUser.password = await bcrypt.hash(reqUser.password, salt);
        //Brugeren bliver opdateret i databasen med de nye oplysninger (og brugerens tidligere email) og den hashede adgangskode
        await Users('update', {name: reqUser.name, email: reqUser.email, prevEmail: req.session.user.email, password: reqUser.password});
        //Brugeren gemmes i express-session
        req.session.user = await Users('get', {email: reqUser.email});
        //Siden genindlæses
        res.redirect('/account');
    }
}

//deleteUser-finktionen defineres
exports.deleteUser = async (req, res) => {
    //Tjekker om brugeren er logget ind, hvis det ikke er tilfældes sendes brugeren til login-siden
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    //Ellers fjernes brugeren ud fra det id der er gemt i express session og ved hjælp af Users modellen
    await Users('delete', {id: req.session.user.id});
    //Sessionen i express sessionen fjernes
    req.session.destroy();
    //Brugeren viderestilles til opret-siden
    res.redirect('/register');
}

//Logout-funktionen defineres
exports.logOut = (req, res) => {
    //Sessionen i express session fjernes og brugeren viderestilles til indeks-siden
    req.session.destroy();
    res.redirect('/');
}
