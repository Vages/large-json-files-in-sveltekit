# Lese inn store JSON-filer i SvelteKit – uten krasj, og kanskje også raskt

Denne kodebasen viser hvordan man kan lese inn <em>veldig</em> store JSON-filer i en [SvelteKit](https://kit.svelte.dev/)-kodebase uten at byggeprosessen krasjer.
Den viser også noen triks for å gjøre utviklingstjeneren litt raskere.

Vi har laget den for å hjelpe de som bruker læreverket Kode til å løse [eksempeloppgaven REA3049-DIV Informasjonsteknologi 2 for faget IT2 våren 2023 (passordbeskyttet)](https://kandidat.udir.no/epsmateriell/eksempeloppgave?navn=rea3049-div+informasjonsteknologi+2&fagkode=rea3049-div&malform=nb-no).
Løsningene vil sannsynligvis også være nyttige i andre sammenhenger.

## Hvordan bruke denne kodebasen

### Installere avhengigheter

```bash
npm install
```

### Starte utviklingstjeneren

```bash
npm run dev
```

### Bygge appen

```bash
npm run build
```

Du kan forhåndsvise den bygde appen med `npm run preview`.

## Forklaring av problem og løsning

### Problemet: Byggeprosessen går tom for minne

I oppgave 12 fra oppgavesettet blir kandidaten bedt om å lese inn et datasett på 80 MB fra Oslo
bysykkel.

> #### Oppgave 12 – Oversikt over sykkelturer
>
> Du skal lage et program som leser inn informasjon fra datasettet og presenterer dette i to
> oversikter. Du skal bruke datasettet fra forberedelsen. Hvis du ikke har forberedt dette kan du
> også laste ned datasettet fra forberedelsesdelen nå.
>
> a) Lag et program som presenterer de tre mest brukte startlokasjonene og de tre minst brukte
> startlokasjonene. Presentasjonen skal også vise antall turer fra disse startlokasjonene.
>
> b) Utvid programmet slik at det også presenter et passende diagram som viser totalt antall turer
> fra alle startlokasjoner til sammen, per ukedag.

Mange vil da begynne løsningen ved å lage en fil der de importerer JSON-filen:

```sveltehtml
<!-- En fil i en eller annen undermappe av src/routes som heter +page.svelte -->
<script>
	import sykkeldata from './05.json';
	//  og så videre …
</script>
```

Når man først starter utviklingstjeneren med `npm run dev`, ser alt ut til å være bra.
Så snart man åpner siden i nettleseren, derimot, går ting galt. Først venter man <em>lenge</em> på at siden skal laste inn. Til slutt mislykkes det hele.

Hvis man undersøker vinduet der man starter utviklingstjeneren, vil man få se en lang feilmelding som starter med `<--- Last few GCs --->`.
Under den neste overskriften, `<--- JS stacktrace --->`, står en beskrivelse av årsaken: `FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory`.
<strong>Denne feilmeldingen betyr at SvelteKit har brukt opp minnet den fikk til å kjøre Svelte.</strong>

```
<--- Last few GCs --->

[25901:0x7f7a08040000] 39936 ms: Mark-sweep 4057.1 (4138.9) -> 4055.9 (4138.9) MB, 2334.3 / 0.0 ms
(average mu = 0.158, current mu = 0.035) allocation failure; scavenge might not succeed
[25901:0x7f7a08040000] 43614 ms: Mark-sweep 4071.6 (4138.9) -> 4070.5 (4169.4) MB, 3668.5 / 0.0 ms
(average mu = 0.074, current mu = 0.003) allocation failure; scavenge might not succeed

<--- JS stacktrace --->

FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory 1: 0x108bc0dc5
node::Abort() (.cold.1) [/Users/foo/.asdf/installs/nodejs/18.14.1/bin/node] 2: 0x1076441e9
node::Abort() [/Users/foo/.asdf/installs/nodejs/18.14.1/bin/node] 3: 0x1076443ce
node::OOMErrorHandler(char const*, bool) [/Users/foo/.asdf/installs/nodejs/18.14.1/bin/node] 4:
0x1077d0f63 v8::internal::V8::FatalProcessOutOfMemory(v8::internal::Isolate*, char const*, bool)

(… og så videre)
```

### Løsningen: Gi prosessen mer minne

Det finnes én måte å fikse en krasj fordi man går tom for minne:
Gi prosessen mer minne (logisk nok).

#### Node-prosesser får mer minne med `NODE_OPTIONS=--max_old_space_size=<minnestørrelse>`

Når man bruker en kommando som til syvende og sist benytter seg av Node.js (slik SvelteKit gjør), kan man gi programmet mer minne ved å skrive følgende: `NODE_OPTIONS=--max_old_space_size=<minnestørrelsen oppgitt i megabyte>`.

I stedet for å skrive `npm run dev`, kan man for eksempel skrive `NODE_OPTIONS=--max_old_space_size=16384 npm run dev`.
Hvis ikke 16384 MB (16 GB) er nok, kan du doble det én eller flere ganger.

#### Legg inn minnekravene i `package.json` for å spare tid.

For å få til dette, har vi endret litt på `package.json`-fila i dette prosjektet.
Dette betyr at SvelteKit kan bruke opptil 16 GB minne før den krasjer (i stedet for standardmengden på 4 GB).
Dersom man jobber med et prosjekt som krever enda mer plass, kan man bytte ut `16384` med et enda større tall.

##### Før

```json
"dev": "vite dev",
"build": "vite build",
```

##### Etter

Legg merke til kommandoene som slutter med `:regular-memory-amount`.
Disse versjonene får bare tildelt den vanlige mengden minne, slik at man kan undersøke hvordan appen oppfører seg uten noe ekstra minne.

```json
"dev": "NODE_OPTIONS=--max_old_space_size=16384 vite dev",
"dev:regular-memory-amount": "vite dev",
"build": "NODE_OPTIONS=--max_old_space_size=16384 vite build",
"build:regular-memory-amount": "vite build",
```

#### Du står fritt til å velge nesten så mye minne du vil

Man trenger ikke tenke på hvor mye internminne (RAM) datamaskinen har når man setter .
Om man overstiger grensen for internminne, vil operativsystemet automatisk bruke minnet på sekundærlageret (harddisken) i stedet.
For at datamaskinen din skal yte så bra som mulig, anbefaler vi at du bruker et så lavt tall som mulig

## Tips for å få ting til å gå raskere

### Kutt ned på dataen mens du utvikler

Hvis du har en stor JSON-fil med data, kan det være lurt å lage et mindre datasett som du bruker mens du utvikler.
Lag for eksempel en ny JSON-fil som inneholder bare de første 1000 elementene i den store fila som du bruker mens du utvikler. 
<strong>Husk å bytte tilbake til det fullstendige datasettet før du eventuelt leverer.</strong>

### Bytt ut `.map` og `.reduce` med `for … of`-løkker

Selv om `.map` og `.reduce` er nyttige funksjoner, kan de bruke mye minne være ganske mye tregere enn vanlige løkker.
Vi opplevde at koden i dette prosjektet ble mye raskere når vi byttet ut `.map` og `.reduce` med vanlige løkker.

For eksempel:

```js
// Kjører raskt
$: turerPerStasjon = regnUtTurerPerStasjon(sykkeldata);

function regnUtTurerPerStasjon(data) {
	let teller = {};
	for (const tur of data) {
		const turtall = teller[tur.start_station_name];
		teller[tur.start_station_name] = (turtall || 0) + 1;
	}
	return teller;
}

// Dette er tregt:
$: turerPerStasjon = sykkeldata.reduce((acc, stasjon) => {
	const turtall = (acc[stasjon.start_station_name] || 0) + 1;
	return { ...acc, [stasjon.start_station_name]: turtall };
}, {});
```

### Regn ut tallene på tjeneren heller enn i nettleseren

I `src/routes/(oppgave 12)/utregning-paa-tjeneren` ser du hvordan man kan bruke teknikker fra SvelteKit slik at man slipper å overføre alle 80 MB med sykkeldata til nettleseren og kun sender den ferdigutregnede statistikken.

For å forstå hva som skjer, anbefaler vi at du leser siden [«Loading data» fra SvelteKit-dokumentasjonen](https://kit.svelte.dev/docs/load).
