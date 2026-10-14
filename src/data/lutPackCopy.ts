/**
 * All translatable copy for the Cinematic LUT Pack sales page and its post-purchase page.
 * Rendered by src/components/LutPackPage.astro and LutPackThankYou.astro. Movie names and
 * preset names stay in their original English form in every language.
 */
export type LutLocale = 'en' | 'de' | 'nb' | 'pt-br';

export interface LutPackCopy {
	title: string;
	description: string;
	keywords: string;
	productName: string;
	breadcrumbHome: string;
	breadcrumbCurrent: string;
	eyebrow: string;
	h1: string;
	intro: string;
	buy: string;
	comingSoonButton: string;
	meta: string;
	moreSoonLine: string;
	insideEyebrow: string;
	insideHeading: string;
	/** `{name}` is replaced with the preset name. */
	imageAlt: string;
	blurbs: Record<'dark-knight' | 'blade-runner' | 'dune' | 'matrix', string>;
	previewNote: string;
	previewLinkText: string;
	soonEyebrow: string;
	soonHeading: string;
	soonBody: string;
	howEyebrow: string;
	howHeading: string;
	software: [string, string][];
	closingHeading: string;
	closingBody: string;
	faqHeading: string;
	faqs: { q: string; a: string }[];
}

export interface LutPackThankYouCopy {
	title: string;
	description: string;
	eyebrow: string;
	heading: string;
	/** Split around the email so it can be highlighted and replaced client-side. */
	emailBefore: string;
	emailFallback: string;
	emailAfter: string;
	missingEyebrow: string;
	missingItems: string[];
	filesEyebrow: string;
	filesItems: string[];
	problemEyebrow: string;
	problemHeading: string;
	problemBody: string;
	backToPack: string;
	contact: string;
	tryEditor: string;
}

export const lutPackCopy: Record<LutLocale, LutPackCopy> = {
	en: {
		title: 'Cinematic LUT Pack (.cube) for Premiere, Resolve & CapCut | Movie Color Grades',
		description:
			'Four cinematic .cube LUTs inspired by The Dark Knight, Blade Runner 2049, Dune and The Matrix. Works in DaVinci Resolve, Premiere Pro, Final Cut Pro, CapCut and Photoshop. Instant download.',
		keywords:
			'cinematic luts, movie luts, cube lut pack, cinematic lut pack, dark knight lut, blade runner lut, dune lut, matrix lut, free cinematic luts, premiere pro luts, davinci resolve luts, capcut luts',
		productName: 'Cinematic LUT Pack (.cube)',
		breadcrumbHome: 'Home',
		breadcrumbCurrent: 'Cinematic LUT Pack',
		eyebrow: 'DIGITAL DOWNLOAD',
		h1: 'Cinematic LUT pack',
		intro:
			'Four movie-inspired .cube LUTs for video and photos. Drop one on a clip and get the look in one click, in DaVinci Resolve, Premiere Pro, Final Cut Pro, CapCut or Photoshop.',
		buy: 'Get the LUT pack',
		comingSoonButton: 'Coming soon',
		meta: 'Instant download · 4 LUTs · .cube · commercial use',
		moreSoonLine: 'More looks are coming soon',
		insideEyebrow: "WHAT'S INSIDE",
		insideHeading: 'Four looks, ready to apply',
		imageAlt: 'Photo graded with the {name} inspired look',
		blurbs: {
			'dark-knight': 'Cold steel, crushed blacks',
			'blade-runner': 'Amber neon, teal haze',
			dune: 'Desert gold, blown highlights',
			matrix: 'High-gain digital green',
		},
		previewNote:
			'Previews show the matching look from the free editor. You can try each one on your own photo before buying, in the',
		previewLinkText: 'preset library',
		soonEyebrow: 'COMING SOON',
		soonHeading: 'More cinematic LUTs are on the way',
		soonBody: 'This is the first pack. More movie-inspired looks are being built for future releases.',
		howEyebrow: 'HOW TO USE',
		howHeading: 'Works in the editors you already use',
		software: [
			['DaVinci Resolve', 'Project Settings > Color Management > Open LUT Folder, drop the files in, then right-click a clip > LUT.'],
			['Premiere Pro', 'Lumetri Color > Creative > Look dropdown > Browse, then pick a .cube file.'],
			['Final Cut Pro', 'Add the Custom LUT effect to a clip and choose the .cube file.'],
			['CapCut', 'Adjust > LUT > Import, then choose the .cube file.'],
			['Photoshop', 'Layer > New Adjustment Layer > Color Lookup > 3DLUT File > Load 3D LUT.'],
		],
		closingHeading: 'Get all four LUTs',
		closingBody: 'One zip with the LUTs and a short setup guide. Sold through Dodo Payments.',
		faqHeading: 'Common questions about the LUT pack',
		faqs: [
			{
				q: 'What format are the LUTs?',
				a: 'Standard 33-point .cube 3D LUTs, the format read by DaVinci Resolve, Premiere Pro, Final Cut Pro, CapCut, Photoshop, OBS and most other editors.',
			},
			{
				q: 'Will they work on my footage?',
				a: 'They are built for normal display-referred footage and photos (sRGB / Rec.709). If you shoot in a Log profile, convert to Rec.709 first, then apply the LUT. Lowering the LUT intensity to 60 to 80 percent often looks most natural.',
			},
			{
				q: 'Do the LUTs include grain, vignette or glow?',
				a: 'No. A LUT only changes color. Grain, vignette and glow are separate effects, which you can add in your editor or with the free Cinematic Photo editor.',
			},
			{
				q: 'Does it work for photos, not just video?',
				a: 'Yes. Any app that loads a .cube LUT can apply it to a photo, including Photoshop and many mobile editors. Lightroom does not load .cube files natively.',
			},
			{
				q: 'How do I get the files after paying?',
				a: 'Checkout is handled by Dodo Payments. Right after payment you get a download link for the zip, and a copy is emailed to you.',
			},
			{
				q: 'Will more LUTs be added?',
				a: 'Yes, more looks are planned for future releases. New looks will be sold as separate packs, so this purchase covers the four LUTs listed on this page. Check back here for new packs.',
			},
			{
				q: 'Are these official film LUTs?',
				a: 'No. They are independent color grades inspired by the look of these films. They are not affiliated with or endorsed by any studio or filmmaker.',
			},
			{
				q: 'Can I use them commercially?',
				a: 'Yes, in your own client and personal photo and video projects. You may not resell, redistribute or share the LUT files themselves.',
			},
		],
	},

	de: {
		title: 'Cinematic LUT-Paket (.cube) für Premiere, Resolve & CapCut | Film-Color-Grades',
		description:
			'Vier cineastische .cube-LUTs, inspiriert von The Dark Knight, Blade Runner 2049, Dune und The Matrix. Funktionieren in DaVinci Resolve, Premiere Pro, Final Cut Pro, CapCut und Photoshop. Sofortiger Download.',
		keywords:
			'cinematic luts, film luts, cube lut paket, cinematic lut paket, dark knight lut, blade runner lut, dune lut, matrix lut, premiere pro luts, davinci resolve luts, capcut luts',
		productName: 'Cinematic LUT-Paket (.cube)',
		breadcrumbHome: 'Startseite',
		breadcrumbCurrent: 'Cinematic LUT-Paket',
		eyebrow: 'DIGITALER DOWNLOAD',
		h1: 'Cinematic LUT-Paket',
		intro:
			'Vier von Filmen inspirierte .cube-LUTs für Video und Fotos. Leg eines auf einen Clip und hol dir den Look mit einem Klick, in DaVinci Resolve, Premiere Pro, Final Cut Pro, CapCut oder Photoshop.',
		buy: 'LUT-Paket holen',
		comingSoonButton: 'Demnächst verfügbar',
		meta: 'Sofort-Download · 4 LUTs · .cube · kommerzielle Nutzung',
		moreSoonLine: 'Weitere Looks folgen bald',
		insideEyebrow: 'DAS IST DRIN',
		insideHeading: 'Vier Looks, sofort einsatzbereit',
		imageAlt: 'Foto mit dem von {name} inspirierten Look bearbeitet',
		blurbs: {
			'dark-knight': 'Kalter Stahl, abgesoffene Schwarztöne',
			'blade-runner': 'Bernstein-Neon, türkiser Dunst',
			dune: 'Wüstengold, ausgebrannte Lichter',
			matrix: 'Digitales Grün mit hohem Kontrast',
		},
		previewNote:
			'Die Vorschauen zeigen den passenden Look aus dem kostenlosen Editor. Du kannst jeden Look vor dem Kauf an deinem eigenen Foto testen, in der',
		previewLinkText: 'Preset-Bibliothek',
		soonEyebrow: 'DEMNÄCHST',
		soonHeading: 'Weitere cineastische LUTs sind unterwegs',
		soonBody: 'Das ist das erste Paket. Weitere von Filmen inspirierte Looks sind für künftige Veröffentlichungen in Arbeit.',
		howEyebrow: 'SO GEHT\'S',
		howHeading: 'Funktioniert in den Editoren, die du schon nutzt',
		software: [
			['DaVinci Resolve', 'Projekteinstellungen > Farbmanagement > LUT-Ordner öffnen, die Dateien hineinlegen, dann Rechtsklick auf einen Clip > LUT.'],
			['Premiere Pro', 'Lumetri-Farbe > Kreativ > Dropdown "Look" > Durchsuchen, dann eine .cube-Datei wählen.'],
			['Final Cut Pro', 'Den Effekt "Custom LUT" auf einen Clip anwenden und die .cube-Datei wählen.'],
			['CapCut', 'Anpassen > LUT > Importieren, dann die .cube-Datei wählen.'],
			['Photoshop', 'Ebene > Neue Einstellungsebene > Color Lookup > 3DLUT-Datei > 3D-LUT laden.'],
		],
		closingHeading: 'Alle vier LUTs holen',
		closingBody: 'Eine ZIP-Datei mit den LUTs und einer kurzen Einrichtungsanleitung. Verkauf über Dodo Payments.',
		faqHeading: 'Häufige Fragen zum LUT-Paket',
		faqs: [
			{
				q: 'In welchem Format sind die LUTs?',
				a: 'Standard-.cube-3D-LUTs mit 33 Punkten, ein Format, das DaVinci Resolve, Premiere Pro, Final Cut Pro, CapCut, Photoshop, OBS und die meisten anderen Editoren lesen können.',
			},
			{
				q: 'Funktionieren sie mit meinem Material?',
				a: 'Sie sind für normales, display-referenziertes Material und Fotos (sRGB / Rec.709) gebaut. Wenn du in einem Log-Profil filmst, wandle zuerst nach Rec.709 um und wende dann das LUT an. Die LUT-Intensität auf 60 bis 80 Prozent zu senken, wirkt oft am natürlichsten.',
			},
			{
				q: 'Enthalten die LUTs Körnung, Vignette oder Glow?',
				a: 'Nein. Ein LUT verändert nur die Farbe. Körnung, Vignette und Glow sind separate Effekte, die du in deinem Editor oder mit dem kostenlosen Cinematic Photo Editor hinzufügen kannst.',
			},
			{
				q: 'Funktioniert es auch für Fotos, nicht nur für Video?',
				a: 'Ja. Jede App, die ein .cube-LUT laden kann, kann es auf ein Foto anwenden, darunter Photoshop und viele mobile Editoren. Lightroom lädt .cube-Dateien nicht nativ.',
			},
			{
				q: 'Wie bekomme ich die Dateien nach der Zahlung?',
				a: 'Der Checkout läuft über Dodo Payments. Direkt nach der Zahlung bekommst du einen Download-Link für die ZIP-Datei, außerdem wird dir eine Kopie per E-Mail geschickt.',
			},
			{
				q: 'Kommen weitere LUTs dazu?',
				a: 'Ja, für künftige Veröffentlichungen sind weitere Looks geplant. Neue Looks werden als separate Pakete verkauft, dieser Kauf umfasst also die vier auf dieser Seite aufgeführten LUTs. Schau hier wieder vorbei, wenn neue Pakete erscheinen.',
			},
			{
				q: 'Sind das offizielle Film-LUTs?',
				a: 'Nein. Es sind eigenständige Color Grades, die vom Look dieser Filme inspiriert sind. Sie stehen in keiner Verbindung zu einem Studio oder Filmemacher und werden von keinem unterstützt.',
			},
			{
				q: 'Darf ich sie kommerziell nutzen?',
				a: 'Ja, in deinen eigenen Kunden- und privaten Foto- und Videoprojekten. Die LUT-Dateien selbst darfst du nicht weiterverkaufen, weitergeben oder teilen.',
			},
		],
	},

	nb: {
		title: 'Cinematic LUT-pakke (.cube) for Premiere, Resolve og CapCut | Film-fargegrader',
		description:
			'Fire filmiske .cube-LUT-er inspirert av The Dark Knight, Blade Runner 2049, Dune og The Matrix. Fungerer i DaVinci Resolve, Premiere Pro, Final Cut Pro, CapCut og Photoshop. Umiddelbar nedlasting.',
		keywords:
			'cinematic luts, film luts, cube lut pakke, cinematic lut pakke, dark knight lut, blade runner lut, dune lut, matrix lut, premiere pro luts, davinci resolve luts, capcut luts',
		productName: 'Cinematic LUT-pakke (.cube)',
		breadcrumbHome: 'Hjem',
		breadcrumbCurrent: 'Cinematic LUT-pakke',
		eyebrow: 'DIGITAL NEDLASTING',
		h1: 'Cinematic LUT-pakke',
		intro:
			'Fire filminspirerte .cube-LUT-er for video og bilder. Legg en på en klipp og få looken med ett klikk, i DaVinci Resolve, Premiere Pro, Final Cut Pro, CapCut eller Photoshop.',
		buy: 'Kjøp LUT-pakken',
		comingSoonButton: 'Kommer snart',
		meta: 'Umiddelbar nedlasting · 4 LUT-er · .cube · kommersiell bruk',
		moreSoonLine: 'Flere looks kommer snart',
		insideEyebrow: 'DETTE FÅR DU',
		insideHeading: 'Fire looks, klare til bruk',
		imageAlt: 'Bilde bearbeidet med looken inspirert av {name}',
		blurbs: {
			'dark-knight': 'Kald stål, knuste svartnivåer',
			'blade-runner': 'Rav-neon, turkis dis',
			dune: 'Ørkengull, utbrente høylys',
			matrix: 'Digital grønn med høy kontrast',
		},
		previewNote:
			'Forhåndsvisningene viser den tilsvarende looken fra den gratis editoren. Du kan prøve hver av dem på ditt eget bilde før du kjøper, i',
		previewLinkText: 'preset-biblioteket',
		soonEyebrow: 'KOMMER SNART',
		soonHeading: 'Flere filmiske LUT-er er på vei',
		soonBody: 'Dette er den første pakken. Flere filminspirerte looks er under arbeid for kommende utgivelser.',
		howEyebrow: 'SLIK BRUKER DU DEN',
		howHeading: 'Fungerer i editorene du allerede bruker',
		software: [
			['DaVinci Resolve', 'Project Settings > Color Management > Open LUT Folder, legg filene inn, høyreklikk deretter en klipp > LUT.'],
			['Premiere Pro', 'Lumetri Color > Creative > Look-menyen > Browse, velg deretter en .cube-fil.'],
			['Final Cut Pro', 'Legg til effekten Custom LUT på en klipp og velg .cube-filen.'],
			['CapCut', 'Adjust > LUT > Import, velg deretter .cube-filen.'],
			['Photoshop', 'Layer > New Adjustment Layer > Color Lookup > 3DLUT File > Load 3D LUT.'],
		],
		closingHeading: 'Få alle fire LUT-ene',
		closingBody: 'Én zip-fil med LUT-ene og en kort oppsettguide. Selges via Dodo Payments.',
		faqHeading: 'Vanlige spørsmål om LUT-pakken',
		faqs: [
			{
				q: 'Hvilket format har LUT-ene?',
				a: 'Standard 33-punkts .cube 3D-LUT-er, et format som leses av DaVinci Resolve, Premiere Pro, Final Cut Pro, CapCut, Photoshop, OBS og de fleste andre editorer.',
			},
			{
				q: 'Fungerer de på materialet mitt?',
				a: 'De er laget for vanlig display-referert materiale og bilder (sRGB / Rec.709). Hvis du filmer i en Log-profil, konverter til Rec.709 først og bruk deretter LUT-en. Å senke LUT-intensiteten til 60 til 80 prosent ser ofte mest naturlig ut.',
			},
			{
				q: 'Inneholder LUT-ene korn, vignett eller glød?',
				a: 'Nei. En LUT endrer bare farge. Korn, vignett og glød er separate effekter du kan legge til i editoren din eller med den gratis Cinematic Photo-editoren.',
			},
			{
				q: 'Fungerer det på bilder, ikke bare video?',
				a: 'Ja. Alle apper som kan laste inn en .cube-LUT kan bruke den på et bilde, blant annet Photoshop og mange mobile editorer. Lightroom laster ikke .cube-filer direkte.',
			},
			{
				q: 'Hvordan får jeg filene etter betaling?',
				a: 'Betalingen håndteres av Dodo Payments. Rett etter betaling får du en nedlastingslenke til zip-filen, og en kopi sendes på e-post.',
			},
			{
				q: 'Kommer det flere LUT-er?',
				a: 'Ja, flere looks er planlagt for kommende utgivelser. Nye looks selges som separate pakker, så dette kjøpet dekker de fire LUT-ene som står på denne siden. Sjekk tilbake her for nye pakker.',
			},
			{
				q: 'Er dette offisielle film-LUT-er?',
				a: 'Nei. Dette er uavhengige fargegraderinger inspirert av looken i disse filmene. De er ikke tilknyttet eller godkjent av noe studio eller noen filmskaper.',
			},
			{
				q: 'Kan jeg bruke dem kommersielt?',
				a: 'Ja, i dine egne kunde- og personlige foto- og videoprosjekter. Du kan ikke videreselge, distribuere eller dele selve LUT-filene.',
			},
		],
	},

	'pt-br': {
		title: 'Pacote de LUTs Cinematic (.cube) para Premiere, Resolve e CapCut | Color Grades de Filmes',
		description:
			'Quatro LUTs .cube cinematográficas inspiradas em The Dark Knight, Blade Runner 2049, Dune e The Matrix. Funcionam no DaVinci Resolve, Premiere Pro, Final Cut Pro, CapCut e Photoshop. Download imediato.',
		keywords:
			'luts cinematograficas, luts de filmes, pacote de luts cube, pacote de luts cinematic, lut dark knight, lut blade runner, lut dune, lut matrix, luts premiere pro, luts davinci resolve, luts capcut',
		productName: 'Pacote de LUTs Cinematic (.cube)',
		breadcrumbHome: 'Início',
		breadcrumbCurrent: 'Pacote de LUTs Cinematic',
		eyebrow: 'DOWNLOAD DIGITAL',
		h1: 'Pacote de LUTs Cinematic',
		intro:
			'Quatro LUTs .cube inspiradas em filmes, para vídeo e fotos. Aplique uma em um clipe e tenha o look com um clique, no DaVinci Resolve, Premiere Pro, Final Cut Pro, CapCut ou Photoshop.',
		buy: 'Comprar o pacote de LUTs',
		comingSoonButton: 'Em breve',
		meta: 'Download imediato · 4 LUTs · .cube · uso comercial',
		moreSoonLine: 'Mais looks em breve',
		insideEyebrow: 'O QUE ESTÁ INCLUÍDO',
		insideHeading: 'Quatro looks, prontos para aplicar',
		imageAlt: 'Foto com o look inspirado em {name}',
		blurbs: {
			'dark-knight': 'Aço frio, pretos esmagados',
			'blade-runner': 'Neon âmbar, névoa azul-petróleo',
			dune: 'Ouro do deserto, realces estourados',
			matrix: 'Verde digital de alto ganho',
		},
		previewNote:
			'As prévias mostram o look correspondente do editor gratuito. Você pode testar cada um na sua própria foto antes de comprar, na',
		previewLinkText: 'biblioteca de presets',
		soonEyebrow: 'EM BREVE',
		soonHeading: 'Mais LUTs cinematográficas estão a caminho',
		soonBody: 'Este é o primeiro pacote. Mais looks inspirados em filmes estão sendo criados para os próximos lançamentos.',
		howEyebrow: 'COMO USAR',
		howHeading: 'Funciona nos editores que você já usa',
		software: [
			['DaVinci Resolve', 'Project Settings > Color Management > Open LUT Folder, coloque os arquivos lá e clique com o botão direito em um clipe > LUT.'],
			['Premiere Pro', 'Lumetri Color > Creative > menu Look > Browse e escolha um arquivo .cube.'],
			['Final Cut Pro', 'Adicione o efeito Custom LUT a um clipe e escolha o arquivo .cube.'],
			['CapCut', 'Ajustar > LUT > Importar e escolha o arquivo .cube.'],
			['Photoshop', 'Layer > New Adjustment Layer > Color Lookup > 3DLUT File > Load 3D LUT.'],
		],
		closingHeading: 'Leve as quatro LUTs',
		closingBody: 'Um zip com as LUTs e um guia rápido de configuração. Vendido pela Dodo Payments.',
		faqHeading: 'Perguntas frequentes sobre o pacote de LUTs',
		faqs: [
			{
				q: 'Em que formato são as LUTs?',
				a: 'LUTs 3D .cube padrão de 33 pontos, o formato lido pelo DaVinci Resolve, Premiere Pro, Final Cut Pro, CapCut, Photoshop, OBS e a maioria dos outros editores.',
			},
			{
				q: 'Vão funcionar no meu material?',
				a: 'Elas foram feitas para material e fotos em padrão de exibição (sRGB / Rec.709). Se você grava em um perfil Log, converta para Rec.709 primeiro e depois aplique a LUT. Reduzir a intensidade da LUT para 60 a 80 por cento costuma ficar mais natural.',
			},
			{
				q: 'As LUTs incluem grão, vinheta ou glow?',
				a: 'Não. Uma LUT só altera a cor. Grão, vinheta e glow são efeitos separados, que você pode adicionar no seu editor ou no editor gratuito do Cinematic Photo.',
			},
			{
				q: 'Funciona para fotos, não só para vídeo?',
				a: 'Sim. Qualquer app que carregue uma LUT .cube pode aplicá-la a uma foto, incluindo o Photoshop e muitos editores de celular. O Lightroom não carrega arquivos .cube nativamente.',
			},
			{
				q: 'Como recebo os arquivos depois de pagar?',
				a: 'O pagamento é processado pela Dodo Payments. Logo após pagar, você recebe um link de download do zip, e uma cópia é enviada por e-mail.',
			},
			{
				q: 'Mais LUTs serão adicionadas?',
				a: 'Sim, mais looks estão planejados para os próximos lançamentos. Os novos looks serão vendidos como pacotes separados, então esta compra cobre as quatro LUTs listadas nesta página. Volte aqui para ver os novos pacotes.',
			},
			{
				q: 'São LUTs oficiais dos filmes?',
				a: 'Não. São color grades independentes inspirados no visual desses filmes. Não têm afiliação nem aprovação de nenhum estúdio ou cineasta.',
			},
			{
				q: 'Posso usar comercialmente?',
				a: 'Sim, nos seus projetos pessoais e de clientes de foto e vídeo. Você não pode revender, redistribuir nem compartilhar os arquivos de LUT em si.',
			},
		],
	},
};

export const lutPackThankYouCopy: Record<LutLocale, LutPackThankYouCopy> = {
	en: {
		title: 'Thank You | Cinematic LUT Pack',
		description: 'Your Cinematic LUT Pack purchase: where to find your download link.',
		eyebrow: 'PAYMENT RECEIVED',
		heading: 'Thanks for your purchase',
		emailBefore: 'Your download link is on its way to ',
		emailFallback: 'the email you used at checkout',
		emailAfter: '. It usually arrives within a minute or two.',
		missingEyebrow: "IF YOU DON'T SEE IT",
		missingItems: [
			'Check your spam, junk and promotions folders. The email comes from Dodo Payments, our payment provider.',
			'Download links expire after a short time for security. Open the link in the email again, or use the customer portal button in the email, to get a fresh one.',
			"Make sure you used the right address. If it still doesn't arrive, contact us and we'll sort it out.",
		],
		filesEyebrow: 'WHEN YOU HAVE THE FILES',
		filesItems: [
			'Unzip the download. Inside is a LUTs folder with four .cube files and a "READ ME.txt".',
			'Import a .cube file in DaVinci Resolve, Premiere Pro, Final Cut Pro, CapCut or Photoshop. The READ ME has the steps for each.',
			'Lower the LUT intensity to 60 to 80 percent if the look feels too strong.',
		],
		problemEyebrow: 'PAYMENT NOT COMPLETED',
		problemHeading: "Your payment didn't go through",
		problemBody: "You haven't been charged for this order. You can try again with the same or a different payment method.",
		backToPack: 'Back to the LUT pack',
		contact: 'Contact us',
		tryEditor: 'Try the free preset editor',
	},
	de: {
		title: 'Danke | Cinematic LUT-Paket',
		description: 'Dein Kauf des Cinematic LUT-Pakets: wo du deinen Download-Link findest.',
		eyebrow: 'ZAHLUNG ERHALTEN',
		heading: 'Danke für deinen Kauf',
		emailBefore: 'Dein Download-Link ist unterwegs an ',
		emailFallback: 'die E-Mail-Adresse, die du beim Checkout angegeben hast',
		emailAfter: '. Er kommt normalerweise innerhalb ein bis zwei Minuten an.',
		missingEyebrow: 'FALLS DU SIE NICHT SIEHST',
		missingItems: [
			'Schau in deinem Spam-, Junk- und Werbung-Ordner nach. Die E-Mail kommt von Dodo Payments, unserem Zahlungsanbieter.',
			'Download-Links laufen aus Sicherheitsgründen nach kurzer Zeit ab. Öffne den Link in der E-Mail erneut oder nutze den Kundenportal-Button in der E-Mail, um einen frischen zu bekommen.',
			'Prüfe, ob du die richtige Adresse verwendet hast. Wenn die E-Mail trotzdem nicht ankommt, schreib uns und wir kümmern uns darum.',
		],
		filesEyebrow: 'WENN DU DIE DATEIEN HAST',
		filesItems: [
			'Entpacke den Download. Darin liegt ein Ordner LUTs mit vier .cube-Dateien und eine "READ ME.txt".',
			'Importiere eine .cube-Datei in DaVinci Resolve, Premiere Pro, Final Cut Pro, CapCut oder Photoshop. Die READ ME enthält die Schritte für jedes Programm.',
			'Senke die LUT-Intensität auf 60 bis 80 Prozent, wenn dir der Look zu stark vorkommt.',
		],
		problemEyebrow: 'ZAHLUNG NICHT ABGESCHLOSSEN',
		problemHeading: 'Deine Zahlung ist nicht durchgegangen',
		problemBody: 'Für diese Bestellung wurde dir nichts berechnet. Du kannst es mit derselben oder einer anderen Zahlungsmethode erneut versuchen.',
		backToPack: 'Zurück zum LUT-Paket',
		contact: 'Kontakt',
		tryEditor: 'Den kostenlosen Preset-Editor testen',
	},
	nb: {
		title: 'Takk | Cinematic LUT-pakke',
		description: 'Kjøpet ditt av Cinematic LUT-pakken: slik finner du nedlastingslenken.',
		eyebrow: 'BETALING MOTTATT',
		heading: 'Takk for kjøpet',
		emailBefore: 'Nedlastingslenken din er på vei til ',
		emailFallback: 'e-postadressen du brukte i kassen',
		emailAfter: '. Den kommer vanligvis fram i løpet av et minutt eller to.',
		missingEyebrow: 'HVIS DU IKKE FINNER DEN',
		missingItems: [
			'Sjekk søppelpost-, junk- og kampanjemappene. E-posten kommer fra Dodo Payments, betalingsleverandøren vår.',
			'Nedlastingslenker utløper etter kort tid av sikkerhetshensyn. Åpne lenken i e-posten på nytt, eller bruk kundeportal-knappen i e-posten, for å få en ny.',
			'Sjekk at du brukte riktig adresse. Hvis den fortsatt ikke kommer, ta kontakt med oss, så ordner vi det.',
		],
		filesEyebrow: 'NÅR DU HAR FILENE',
		filesItems: [
			'Pakk ut nedlastingen. Inni ligger en LUTs-mappe med fire .cube-filer og en "READ ME.txt".',
			'Importer en .cube-fil i DaVinci Resolve, Premiere Pro, Final Cut Pro, CapCut eller Photoshop. READ ME-filen har trinnene for hver av dem.',
			'Senk LUT-intensiteten til 60 til 80 prosent hvis looken føles for sterk.',
		],
		problemEyebrow: 'BETALINGEN ER IKKE FULLFØRT',
		problemHeading: 'Betalingen gikk ikke gjennom',
		problemBody: 'Du er ikke belastet for denne bestillingen. Du kan prøve igjen med samme eller en annen betalingsmetode.',
		backToPack: 'Tilbake til LUT-pakken',
		contact: 'Kontakt oss',
		tryEditor: 'Prøv den gratis preset-editoren',
	},
	'pt-br': {
		title: 'Obrigado | Pacote de LUTs Cinematic',
		description: 'Sua compra do Pacote de LUTs Cinematic: onde encontrar o link de download.',
		eyebrow: 'PAGAMENTO RECEBIDO',
		heading: 'Obrigado pela sua compra',
		emailBefore: 'Seu link de download está a caminho de ',
		emailFallback: 'o e-mail que você usou no pagamento',
		emailAfter: '. Costuma chegar em um ou dois minutos.',
		missingEyebrow: 'SE VOCÊ NÃO ENCONTRAR',
		missingItems: [
			'Verifique as pastas de spam, lixo eletrônico e promoções. O e-mail vem da Dodo Payments, nosso provedor de pagamentos.',
			'Por segurança, os links de download expiram depois de pouco tempo. Abra o link do e-mail novamente, ou use o botão do portal do cliente no e-mail, para obter um novo.',
			'Confira se você usou o endereço certo. Se ainda assim não chegar, entre em contato e resolvemos para você.',
		],
		filesEyebrow: 'QUANDO VOCÊ TIVER OS ARQUIVOS',
		filesItems: [
			'Descompacte o download. Dentro há uma pasta LUTs com quatro arquivos .cube e um "READ ME.txt".',
			'Importe um arquivo .cube no DaVinci Resolve, Premiere Pro, Final Cut Pro, CapCut ou Photoshop. O READ ME traz os passos de cada um.',
			'Reduza a intensidade da LUT para 60 a 80 por cento se o look parecer forte demais.',
		],
		problemEyebrow: 'PAGAMENTO NÃO CONCLUÍDO',
		problemHeading: 'Seu pagamento não foi concluído',
		problemBody: 'Você não foi cobrado por este pedido. Você pode tentar novamente com o mesmo método de pagamento ou com outro.',
		backToPack: 'Voltar ao pacote de LUTs',
		contact: 'Fale conosco',
		tryEditor: 'Experimente o editor de presets gratuito',
	},
};
