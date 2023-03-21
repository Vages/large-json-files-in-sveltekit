<h1>Løsningsforslag til oppgave 12</h1>

<nav>
	<ul>
		<li>
			<a href="/utregning-i-nettleseren">Med utregning i nettleseren.</a> Denne løsningen bruker
			<em>kun</em> de delene av SvelteKit som Kode 2 lærer bort. Ulempen er at nettleseren er nødt
			til å laste ned de 80 MB med data som ligger i <code>05.json</code> <em>hver gang</em> man
			gjør endringer i visningen.
			<strong
				>Dette gjør at man må vente i mer enn 10 sekunder hver gang man går inn på eller endrer
				siden.</strong
			>
		</li>
		<li>
			<a href="/utregning-paa-tjeneren">Med utregning på tjeneren.</a> Bruker teknikker fra
			SvelteKit utenfor det som ble lært bort i Kode 2. Sparer data ved å regne ut resultatene på
			tjeneren sende over ferdigutregnede tall til nettleseren. Lar være å gjøre de tunge
			utregningene på nytt så lenge du ikke endrer på <code>+page.server.js</code>.
			<strong>Dermed skal du få se endringene dine på skjermen på under ett sekund.</strong>
		</li>
	</ul>
</nav>
