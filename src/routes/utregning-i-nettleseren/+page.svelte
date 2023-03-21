<script>
	import sykkeldata from '../05.json';

	$: toppstasjoner = sykkeldata.reduce((acc, stasjon) => {
		const turtall = (acc[stasjon.start_station_name] || 0) + 1;
		return { ...acc, [stasjon.start_station_name]: turtall };
	}, {});

	$: turerFordeltPaaUkedag = sykkeldata
		.map((trip) => {
			return new Date(trip.started_at).getDay();
		})
		.reduce((acc, day) => {
			return { ...acc, [day]: (acc[day] || 0) + 1 };
		}, {});

	$: toppstasjonerSortert = Object.entries(toppstasjoner).sort((a, b) => b[1] - a[1]);

	$: flestTurerPaaEnDag = Math.max(...Object.values(turerFordeltPaaUkedag));

	const nummerTilUkedag = new Map([
		[1, 'Mandag'],
		[2, 'Tirsdag'],
		[3, 'Onsdag'],
		[4, 'Torsdag'],
		[5, 'Fredag'],
		[6, 'Lørdag'],
		[0, 'Søndag']
	]);
</script>

<h1>Oppgave 12</h1>

<h2>a)</h2>
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
		{#each toppstasjonerSortert.slice(0, 3) as [stasjon, turer], index}
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
		{#each toppstasjonerSortert.slice(-3).reverse() as [stasjon, turer], index}
			<tr>
				<td>{index + 1}</td>
				<td>{stasjon}</td>
				<td>{turer}</td>
			</tr>
		{/each}
	</table>
</figure>

<h2>b)</h2>
<p>
	Utvid programmet slik at det også presenter et passende diagram som viser totalt antall turer fra
	alle startlokasjoner til sammen, per ukedag.
</p>

<figure>
	<figcaption>Antall turer per ukedag som stolpediagram</figcaption>
	<table>
		<thead>
			<tr>
				<th>Ukedag</th>
				<th>Turer</th>
			</tr>
			{#each [...nummerTilUkedag.entries()] as [day, name]}
				<tr>
					<td>{name}</td>
					<td style="width: 300px">
						<div class="bar" style="width: {(turerFordeltPaaUkedag[day] * 100) / flestTurerPaaEnDag}%;">
							{turerFordeltPaaUkedag[day]}
						</div>
					</td>
				</tr>
			{/each}
		</thead>
	</table>
</figure>

<style>
	.bar {
		background-color: #4caf50;
		color: white;
		padding: 5px;
	}
</style>
