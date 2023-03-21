<script>
	import EnkeltStolpediagram from './EnkeltStolpediagram.svelte';

	/** @type {[string, number][]} */
	export let turerPerStasjon;

	/** @type {Record<string, number>} */
	export let turerPerUkedag;

	const nummerTilUkedag = new Map([
		[1, 'Mandag'],
		[2, 'Tirsdag'],
		[3, 'Onsdag'],
		[4, 'Torsdag'],
		[5, 'Fredag'],
		[6, 'Lørdag'],
		[0, 'Søndag']
	]);

	$: ukedagtabell = [...nummerTilUkedag.entries()].map(([nummer, navn]) => {
		return [navn, turerPerUkedag[nummer]];
	});

	$: stasjonerSortertSynkendeEtterAntallTurer = Object.entries(turerPerStasjon).sort(
		(a, b) => b[1] - a[1]
	);
</script>

<h2>Oppgave 12</h2>

<h3>a)</h3>
<p>
	Lag et program som presenterer de tre mest brukte startlokasjonene og de tre minst brukte
	startlokasjonene. Presentasjonen skal også vise antall turer fra disse startlokasjonene.
</p>

<figure>
	<figcaption>De <em>mest</em> brukte stasjonene</figcaption>
	<table>
		<thead>
			<tr>
				<th>Plass</th>
				<th>Stasjon</th>
				<th>Turer</th>
			</tr>
		</thead>
		{#each stasjonerSortertSynkendeEtterAntallTurer.slice(0, 3) as [stasjon, turer], index}
			<tr>
				<td>{index + 1}</td>
				<td>{stasjon}</td>
				<td>{turer}</td>
			</tr>
		{/each}
	</table>
</figure>

<figure>
	<figcaption>De <em>minst</em> brukte stasjonene</figcaption>
	<table>
		<thead>
			<tr>
				<th>Plass</th>
				<th>Stasjon</th>
				<th>Turer</th>
			</tr>
		</thead>
		{#each stasjonerSortertSynkendeEtterAntallTurer.slice(-3).reverse() as [stasjon, turer], index}
			<tr>
				<td>{index + 1}</td>
				<td>{stasjon}</td>
				<td>{turer}</td>
			</tr>
		{/each}
	</table>
</figure>

<h3>b)</h3>
<p>
	Utvid programmet slik at det også presenter et passende diagram som viser totalt antall turer fra
	alle startlokasjoner til sammen, per ukedag.
</p>

<figure>
	<figcaption>Antall turer per ukedag som stolpediagram</figcaption>
	<EnkeltStolpediagram overskrifter={['Ukedag', 'Turer']} data={ukedagtabell} />
</figure>

<style>
	p {
		font-style: italic;
	}
</style>
