<script>
	export let data;
</script>

<h3>a)</h3>
<p>
	Lag et program som presenterer de tre mest brukte startlokasjonene og de tre minst brukte
	startlokasjonene. Presentasjonen skal også vise antall turer fra disse startlokasjonene.
</p>

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
