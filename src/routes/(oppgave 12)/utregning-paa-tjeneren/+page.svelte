<script>
	import Visning from '../Visning.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>Med utregning på tjeneren</h1>

<Visning turerPerStasjon={data.turerPerStasjon} turerPerUkedag={data.turerPerUkedag} />
