import sykkeldata from '../05.json';

let turerPerStasjon = sykkeldata.reduce((acc, stasjon) => {
	const turtall = (acc[stasjon.start_station_name] || 0) + 1;
	return { ...acc, [stasjon.start_station_name]: turtall };
}, {});

let turerPerUkedag = sykkeldata
	.map((trip) => {
		return new Date(trip.started_at).getDay();
	})
	.reduce((acc, day) => {
		return { ...acc, [day]: (acc[day] || 0) + 1 };
	}, {});

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return { turerPerUkedag, turerPerStasjon };
}
