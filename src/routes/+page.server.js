// export const prerender = true;

import sykkeldata from './05.json';

const toppstasjoner = sykkeldata.reduce((acc, stasjon) => {
	const turtall = (acc[stasjon.start_station_name] || 0) + 1;
	return { ...acc, [stasjon.start_station_name]: turtall };
}, {});

const tripsByDayOfWeek = sykkeldata
	.map((trip) => {
		return new Date(trip.started_at).getDay();
	})
	.reduce((acc, day) => {
		return { ...acc, [day]: (acc[day] || 0) + 1 };
	}, {});

let toppstasjonerSortert = Object.entries(toppstasjoner).sort((a, b) => b[1] - a[1]);

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return { toppstasjonerSortert, tripsByDayOfWeek };
}
