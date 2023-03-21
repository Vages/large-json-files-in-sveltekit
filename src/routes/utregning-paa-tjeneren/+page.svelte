<script>
	import Oppgave12 from '../Oppgave12.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>Med utregning på tjeneren</h1>

<Oppgave12 turerPerStasjon={data.turerPerStasjon} turerPerUkedag={data.turerPerUkedag} />
