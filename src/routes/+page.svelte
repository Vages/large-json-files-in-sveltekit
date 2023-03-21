<h1>Løsningsforslag til oppgave 12</h1>

<nav>
	<ul>
		<li>
			<a href="/utregning-i-nettleseren">Løsning med utregning i nettleseren.</a> Denne løsningen
			bruker <em>kun</em> de delene av SvelteKit som Kode 2 lærer bort. Ulempen er at nettleseren er
			nødt til å laste ned de 80 MB med data som ligger i <code>05.json</code> <em>hver gang</em> man
			gjør endringer i visningen.
		</li>
		<li>
			<a href="/utregning-paa-tjeneren">Løsning med utregning på tjeneren.</a> Denne løsningen gjør
			mesteparten av utregningene på tjeneren. Fordelen er at du slipper å vente like lenge når du
			gjør endringer i <code>+page.svelte</code> (endringer i <code>+page.server.js</code> vil fortsatt
			ta lang tid).
		</li>
	</ul>
</nav>
