<script>
	export let data;
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
		{#each data.toppstasjonerSortert.slice(0, 3) as [stasjon, turer], index}
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
		{#each data.toppstasjonerSortert.slice(0, 3) as [stasjon, turer], index}
			<tr>
				<td>{index + 1}</td>
				<td>{stasjon}</td>
				<td>{turer}</td>
			</tr>
		{/each}
	</table>
</figure>
