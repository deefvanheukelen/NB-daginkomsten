# NB-daginkomsten

Losse PWA die inlogt op hetzelfde Supabase Auth-project als NailBooker en afspraken uitleest.

## Belangrijk: koppel aan de bestaande database

De originele NailBooker-broncode/databasekolommen zijn niet meegeleverd. Daarom is `config.js` een **aanpasbare mapping**, geen geverifieerde NailBooker-integratie. De standaardkolommen zijn voorbeelden. De app zal pas correct werken wanneer de tabel- en veldnamen exact overeenkomen met de bestaande database. Indien klant, behandeling of betaalwijze in afzonderlijke tabellen staan, moet de query in `app.js` aangepast worden naar de juiste relaties. Indien prijzen uit een dienstenlijst komen, moet de bestaande afspraakprijs/prijslogica overgenomen worden. Controleer ook of privéafspraken, annuleringen, no-shows en soft-deletes op de juiste manier worden uitgesloten.

1. Vul in `config.js` de bestaande Supabase URL en publieke anon/publishable key in (of gebruik het configuratiescherm bij eerste start).
2. Pas `SCHEMA` aan volgens de bestaande NailBooker-tabellen. Controleer expliciet of `user_id` de juiste eigenaarskolom is.
3. Verifieer dat Supabase RLS ingeschakeld is en enkel de eigen afspraken laat lezen. **De clientfilter is geen toegangsbeveiliging.** Voeg geen service_role key toe en maak geen brede publieke SELECT-policy.
4. Controleer de output met bestaande dag- en maandtotalen in NailBooker. Let op: een afspraak is niet noodzakelijk een betaling; dit prototype telt de opgeslagen bedragen van de getoonde afspraken op.

## GitHub Pages

1. Maak een nieuwe repository `nb-daginkomsten` aan.
2. Upload de bestanden uit deze ZIP in de root van de repository (niet de bovenliggende map).
3. Ga naar Settings → Pages → Build and deployment → Deploy from a branch. Kies `main` en `/(root)` en sla op.
4. De site verschijnt op `https://GEBRUIKERSNAAM.github.io/nb-daginkomsten/`.
5. In Supabase → Authentication → URL Configuration voeg je de gepubliceerde URL toe aan de **Redirect URLs** als je loginflows met redirects gebruikt. E-mail/wachtwoord werkt via dezelfde Auth-users.
6. Gebruik een privé-repository indien de code niet openbaar mag zijn; houd er rekening mee dat GitHub Pages afhankelijk van account/plan toch publiek toegankelijk kan zijn. De publieke anon-key is geen geheim, maar beveilig databasegegevens altijd met RLS.

## Installeren

Open de Pages-URL op de telefoon of tablet en kies 'Toevoegen aan beginscherm' (iOS Safari) of 'App installeren' (Android Chrome, waar ondersteund). Voor betrouwbare PWA-installatie op alle browsers zijn aanvullend PNG-iconen van 192 en 512 pixels aanbevolen.
