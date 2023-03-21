<script>
	import sykkeldata from '../05.json';
	import Visning from '../Visning.svelte';

	$: turerPerStasjon = regnUtTurerPerStasjon(sykkeldata);

	function regnUtTurerPerStasjon(data) {
		let teller = {};
		for (const tur of data) {
			const turtall = teller[tur.start_station_name];
			teller[tur.start_station_name] = (turtall || 0) + 1;
		}
		return teller;
	}

	$: turerPerUkedag = regnUtTurerPerUkedag(sykkeldata);

	function regnUtTurerPerUkedag(data) {
		let teller = {};
		for (const tur of data) {
			const dag = new Date(tur.started_at).getDay();
			teller[dag] = (teller[dag] || 0) + 1;
		}
		return teller;
	}
</script>

<h1>Med utregning i nettleseren</h1>

<Visning {turerPerStasjon} {turerPerUkedag} />
