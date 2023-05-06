# NowNews: En aggregeret nyhedsplatform med funktioner som favoritartikler og kommentarer
Denne kodebase har al koden til at køre en fuldt funktionel nyhedsplatform, der henter data direkte fra vores egen database og viser det til klienten.

Arkitekturen, MVC, er benyttet:
- Model: Forbindelse til vores Azure SQL database med Tedious
- View: Rendering af ejs-filer
- Controller: Håndtering af requests, hentning af data med model og visning med view

For at køre applikationen skal du:
1. Lave en .env fil og populere den med de værdier der findes i .env.example.
2. Sørge for at du har installeret alle moduler med 'npm install' i terminalen
3. Køre serveren med 'node app.js' i terminalen

Udarbejdet af @Aman3612, @TroelsPR, @thel22ab, @gustavsogard.
Maj 2023.
Copenhagen Business School, HA(it.).