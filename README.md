# Lese inn store JSON-filer i SvelteKit

Denne kodebasen viser hvordan man kan lese inn <em>veldig</em> store JSON-filer i en [SvelteKit](https://kit.svelte.dev/)-kodebase uten at byggeprosessen krasjer.

Vi har laget kodebasen for å hjelpe de som bruker [læreverket Kode](https://kode.cappelendamm.no) med å løse [eksamensoppgaveeksempelet for IT2 våren 2023 (passordbeskyttet)](https://kandidat.udir.no/epsmateriell/eksempeloppgave?navn=rea3049-div+informasjonsteknologi+2&fagkode=rea3049-div&malform=nb-no).
Løsningene vil sannsynligvis også være nyttige i andre sammenhenger.

Nederst i dokumentet finner du noen tips for at datamaskinen skal jobbe raskere mens du jobber med store datafiler.

<i>Filen `src/routes/05.json` er hentet fra [Oslo bysykkels åpne data](https://oslobysykkel.no/apne-data). Disse dataene er gjort tilgjengelig under [Norsk lisens for offentlige data (NLOD) 2.0](https://data.norge.no/nlod/no/2.0) av [UIP Oslo bysykkel AS](https://oslobysykkel.no/om).</i>

## Innholdsfortegnelse

<!-- prettier-ignore-start -->

<!-- toc -->

- [Hvordan bruke denne kodebasen](#hvordan-bruke-denne-kodebasen)
  * [Installere avhengigheter](#installere-avhengigheter)
  * [Starte utviklingstjeneren](#starte-utviklingstjeneren)
  * [Bygge appen](#bygge-appen)
- [Forklaring av problem og løsning](#forklaring-av-problem-og-losning)
  * [Problemet: Byggeprosessen går tom for minne](#problemet-byggeprosessen-gar-tom-for-minne)
  * [Løsningen: Gi prosessen mer minne](#losningen-gi-prosessen-mer-minne)
    + [Med `NODE_OPTIONS=--max_old_space_size=` gir man Node.js mer minne](#med-node_options--max_old_space_size-gir-man-nodejs-mer-minne)
    + [Legg inn minnekravene i `package.json` for å spare tid.](#legg-inn-minnekravene-i-packagejson-for-a-spare-tid)
      - [Før](#for)
      - [Etter](#etter)
    + [Du står fritt til å velge nesten så mye minne du vil](#du-star-fritt-til-a-velge-nesten-sa-mye-minne-du-vil)
- [Tips for å få ting til å gå raskere](#tips-for-a-fa-ting-til-a-ga-raskere)
  * [Kutt ned på dataen mens du utvikler](#kutt-ned-pa-dataen-mens-du-utvikler)
  * [Bytt ut `.map` og `.reduce` med `for … of`-løkker](#bytt-ut-map-og-reduce-med-for--of-lokker)

<!-- tocstop -->

<!-- prettier-ignore-stop -->

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

> <strong>Oppgave 12 – Oversikt over sykkelturer</strong>
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

Et ganske naturlig sted å starte er å lage en fil der man importerer datasettet, for eksempel:

```sveltehtml
<!-- src/routes/+page.svelte -->
<script>
	import sykkeldata from './05.json';
</script>

<h1>Hello World</h1>
<p>Her kommer det en løsning etter hvert</p>
```

Når man starter utviklingstjeneren med `npm run dev -- --open`, går ting galt. Først venter man <em>lenge</em> på at siden skal laste inn, men så mister nettleseren tilkoblingen til utviklingstjeneren.

Hvis man undersøker vinduet der man starter utviklingstjeneren, vil man se at utviklingstjeneren har krasjet. Feilmeldingen der skal starte med `<--- Last few GCs --->`.

Under overskriften `<--- JS stacktrace --->` står det hva feilen faktisk skyldes: `FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory`.
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
Gi prosessen mer minne.

#### Med `NODE_OPTIONS=--max_old_space_size=<minnestørrelse>` gir man Node.js mer minne

Når man bruker en kommando som til syvende og sist benytter seg av Node.js (slik SvelteKit gjør), kan man gi programmet mer minne ved å skrive følgende: `NODE_OPTIONS=--max_old_space_size=<minnestørrelsen oppgitt i megabyte>`.

I stedet for å skrive `npm run dev`, kan man for eksempel skrive `NODE_OPTIONS=--max_old_space_size=16384 npm run dev`, som er nok for programmet i denne kodebasen.
Hvis ikke 16384 MB (16 GB) er nok, kan du doble tallet én eller flere ganger.

#### Legg inn minnekravene i `package.json` for å spare tid.

For å slippe å huske å skrive denne kommandoen hver gang, kan du legge inn minnekravene på de kommandoene som går tom for minne i `package.json`:

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

Man trenger ikke tenke på hvor mye internminne (RAM) man har på datamaskinen sin når man setter verdien for Node.js.
Om man bruker mer plass enn det finnes i internminnet, vil operativsystemet automatisk bruke minnet på sekundærlageret (harddisken) i stedet.
For at datamaskinen din skal yte så bra som mulig, anbefaler vi likevel at du bruker et så lavt tall som mulig.

## Tips for å få ting til å gå raskere

### Kutt ned på dataen mens du utvikler

Hvis du har en stor JSON-fil med data, kan det være lurt å lage et mindre datasett som du bruker mens du utvikler.
Lag for eksempel en ny JSON-fil som inneholder bare de første 1000 elementene i den store fila.
<strong>Husk å bytte tilbake til det fullstendige datasettet før du eventuelt leverer.</strong>

### Bytt ut `.map` og `.reduce` med `for … of`-løkker

Selv om `.map` og `.reduce` er nyttige funksjoner, kan de være ganske mye tregere enn vanlige løkker (se [The reduce (`{...spread}`) anti-pattern](https://www.richsnapp.com/article/2019/06-09-reduce-spread-anti-pattern)).

Vi opplevde at koden i dette prosjektet ble <em>mye</em> raskere når vi byttet ut `.map` og `.reduce` med vanlige løkker.

For eksempel:

```js
// Dette er raskt:
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
