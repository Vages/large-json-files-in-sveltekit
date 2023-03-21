import sykkeldata from '../05.json';

let turerPerStasjon = {};
for (const tur of sykkeldata) {
	const turtall = turerPerStasjon[tur.start_station_name];
	turerPerStasjon[tur.start_station_name] = (turtall || 0) + 1;
}

let turerPerUkedag = {};
for (const tur of sykkeldata) {
	const dag = new Date(tur.started_at).getDay();
	turerPerUkedag[dag] = (turerPerUkedag[dag] || 0) + 1;
}

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return { turerPerUkedag, turerPerStasjon };
}
