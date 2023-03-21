<script>
	import sykkeldata from '../05.json';
	import Oppgave12 from '../Oppgave12.svelte';

	$: turerPerStasjon = sykkeldata.reduce((acc, stasjon) => {
		const turtall = (acc[stasjon.start_station_name] || 0) + 1;
		return { ...acc, [stasjon.start_station_name]: turtall };
	}, {});

	$: turerPerUkedag = sykkeldata
		.map((trip) => {
			return new Date(trip.started_at).getDay();
		})
		.reduce((acc, day) => {
			return { ...acc, [day]: (acc[day] || 0) + 1 };
		}, {});
</script>

<Oppgave12 {turerPerStasjon} {turerPerUkedag} />
