För att köra applikationen
---------------------------
npm run start


För att köra test
---------------------------
npm run test


För att installera dependencies
------------------------------
npm install apicache axios chai chai-http express express-rate-limiter mocha nodemon


API endpoint för att hämta sammanfattning av artist
---------------------------------------------------
http://localhost:3000/api/artist/:id
- id är ett musicbrainz id


Speciella designval och möjliga förbättringspunkter
---------------------------------------------------
Jag valde att använda mig av Node.js framförallt eftersom att jag hade tidigare erfarenhet av att utveckla api:er med den. Node.js är snabbt, effektivt och light-weigth, och det är bekvämt att kunna använda sig av vanlig Javascript. Jag valde även Node.js på grund av NPM och alla fördelar de biblioteken kommer med. Annars är mina val av ramverk och bibliotek mest baserad på deras popularitet inom backend-utveckling, då jag själv inte har mycket erfarenhet.

För strukturen valde jag att använda mig av routes, controllers och services. Jag anser att denna struktur av filer är enkel att förstå men framförallt så är "logiken"  separerad från api-delen av applikationen. Jag tror också att denna struktur gör det enklare att vidareutveckla api:et med till exempel nya routes.

Funktionen getWikiIdAndAlbums() valde jag skulle returnera två värden. En string för id och en lista med albums, där varje album har ett namn och ett id. Jag hade gärna delat upp dessa uppgifter i två olika funktioner (single responsibility principen), men det viktigaste för mig var att endast en request gjordes mot MusicBrainz och inte två. Det finns säkert ett sätt att dela upp funktionen och fortfarande bara göra en request men det är inget jag lyckades lösa just nu.

Angående mina test så använde jag mig av ett bibliotek som heter chai. Jag har knappt någon tidigare erfarenhet av att skriva test så detta är fortfarande nytt för mig. Jag förstår efter detta projekt att använda automatiserade tester är betydligt mer bekvämt än att ständigt göra get requests i t.ex. Postman och sedan försöka lista ut var felet ligger. Med lite mer tid och erfarenhet hade jag gärna lagt mer kraft på att skriva många och bra unit-tests.

Felhanteringen i programmet kan utvecklas. Jag valde att medvetet inte lägga så mycket tid på det då jag valde att prioritera funktionalitet. Men jag är medveten om att detta är ett område som definitivt behöver förbättras innan en applikation som den här kan distribueras till slutanvändare. Just nu ligger alla funktioner i en och samma try catch, vilket i och för i sig fungerar, men som inte är optimalt vid till exempel felsökning.

För att göra api:et effektivare och en aningen mer robust, valde jag att använda mig av cachade svar och en rate limiter. NPM paketen heter apicache och express-rate-limiter och är båda väldigt basic. Jag kan tänka mig att spara cachade svar i en separat databas kan vara bättre om appen börjar användas av väldigt många. För rate-limiten har jag nu satt en godtycklig gräns på 100 requests per dygn (lade inte så mycket tanke på den siffran). Biblioteket jag använder kollar på ip-adressen varifrån requesten görs och räknar antalet som gjorts. En vidareutveckling hade kanske varit låta användarna skapa konton med egna API-nycklar och m.h.a. dem räkna antalet förfrågningar.

Att bestämma hur och i vilken ordning alla anrop till api:erna skulle göras tog en lång tid för mig. Jag har väldigt lite erfarenhet av promises och async/await och därför behövde jag lägga en del tid på att sätta mig in i tekniken. Jag är hyfsat nöjd med min slutgiltiga design även om den säkert kan göras mer effektiv. Eftersom att de olika förfrågningarna ofta är beroende av tidigare förfrågningar så behöver koden vänta på svar från tidigare funktioner (därav wait). getCovers() kunde dock köras asynkroniserat med getArtistTitle() och getArtistDescription(). Så när alla funktioner returnerat ett värde och getCovers() resolvat, så kan svaren slås ihop till ett JSON-objekt och skickas till klienten.

Jag hade stora problem med att hämta cover images av alla albums och jag fick inte det att fungera. Jag visste att en for-loop var lösningen men jag kunde inte få programmet att vänta. Lösningen blev att spara varje request som ett promise i en array och sedan inte returnera förrän alla promises fått ett värde.

I uppgiftsbeskrivningen står det att musicbrainz ibland direkt refererar till wikipedia och inte till wikidata men jag hittade inget exempel när detta händer så jag kunde därför inte implementera något som hanterar detta. Detta är något som jag absolut skulle kunna fixa om jag haft mer tid och några exempel att kolla på.
