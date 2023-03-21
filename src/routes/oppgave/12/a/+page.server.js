export const prerender = true;

import sykkeldata from './05.json';

let toppstasjoner = {};

for (const stasjon of sykkeldata) {
	toppstasjoner[stasjon.start_station_name] = (toppstasjoner[stasjon.start_station_name] || 0) + 1;
}

let toppstasjonerSortert = Object.entries(toppstasjoner).sort((a, b) => b[1] - a[1]);

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return { toppstasjonerSortert };
}
