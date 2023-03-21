<script>
	/** @type {[string, number][]} */
	export let data = [];

	/** @type {[string, string]} */
	export let overskrifter = ["stolpenavn", "verdi"];

	const max = Math.max(...data.map(([, count]) => count));
</script>

<table>
	<thead>
		<tr>
			<th>{overskrifter[0]}</th>
			<th>{overskrifter[1]}</th>
		</tr>
		{#each data as [stolpenavn, verdi]}
			<tr>
				<td>{stolpenavn}</td>
				<td style="width: 300px">
					<div class="bar" style="width: {(verdi * 100) / max}%;">
						{verdi}
					</div>
				</td>
			</tr>
		{/each}
	</thead>
</table>

<style>
	.bar {
		background-color: #4caf50;
		color: white;
		padding: 5px;
	}
</style>
