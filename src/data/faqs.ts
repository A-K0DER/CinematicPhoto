export interface Faq {
	q: string;
	a: string;
	/** Shown in the homepage FAQ preview; the rest only appear on the full /faq/ page. */
	featured?: boolean;
}

export const ALL_FAQS: Faq[] = [
	{
		q: 'Is Cinematic Photo really a free ai photo editor?',
		a: 'Yes. Every preset, slider, and export option is free with no account, watermark, or usage cap. There is no premium tier hiding the good filters. The full cinematic color grading tool is available the moment the page loads.',
		featured: true,
	},
	{
		q: 'Do I need to upload my photo to use this online photo editor?',
		a: 'No. Cinematic Photo is a client side photo editor: your image is decoded and rendered on a canvas inside your own browser tab. Nothing is transmitted to a server, so there is no upload wait and no privacy trade-off.',
		featured: true,
	},
	{
		q: 'How is Cinematic Photo different from Lightroom presets, VSCO, or Canva?',
		a: "Those tools either gate cinematic looks behind a subscription or membership, or treat them as generic photo effects rather than grades modeled on specific films. Cinematic Photo is a free, browser-based tool built around one job: matching a photo to a real movie or show's color grade in one click, no account or install required. See the full breakdown on the alternatives page.",
		featured: true,
	},
	{
		q: 'How do I make a photo look like The Shawshank Redemption or Pulp Fiction?',
		a: 'Drop in an image, then select the Shawshank Redemption preset for a warm, restrained 35mm prison-drama grade, or the Pulp Fiction preset for pulpy, high-contrast amber-red Tarantino tones. Each preset instantly applies a movie-accurate color curve, and you can fine-tune grain, vignette, and glow afterward.',
	},
	{
		q: 'What image formats and aspect ratios are supported?',
		a: 'JPG, PNG, and WEBP files can be dropped, pasted, or browsed in. For framing, toggle the anamorphic letterbox to crop your image to a 2.39:1 cinematic aspect ratio with black bars, just like a widescreen theatrical frame.',
	},
	{
		q: 'How do I give my photos the moody, desaturated look of Interstellar?',
		a: 'Select the Interstellar preset to apply a cold cosmic blue color curve with deep, desaturated blacks, the same restrained sci-fi grade used throughout the film. Add a touch of grain and vignette afterward to deepen the mood even further.',
	},
	{
		q: 'Can I apply the dusty, warm golden-hour color grade of Dune to my landscape photos?',
		a: "Yes. Select the Dune preset to grade your photo with warm desert-gold tones and gently blown highlights, mimicking the film's sun-bleached, dust-filled cinematography. It's especially effective on landscape and outdoor shots with strong natural light.",
	},
	{
		q: 'How do I add the iconic high-contrast green matrix tint to my portraits?',
		a: "Choose the Matrix preset to apply the film's signature high-gain digital green tint instantly. Since it's a color grade rather than a crop, it works just as well on portraits as full scenes. Layer in some grain afterward for an even more degraded-monitor feel.",
	},
	{
		q: 'How do I recreate the gritty, crushed shadows and cold steel look of The Dark Knight?',
		a: "Apply The Dark Knight preset, which crushes shadow detail and shifts tones toward a cold steel blue for the film's gritty, high-contrast urban look. Nudging up the vignette slightly helps draw the eye inward and deepen the edges of the frame.",
		featured: true,
	},
	{
		q: 'How do I get the bleached, golden arena look of Gladiator on my travel or landscape photos?',
		a: "Select the Gladiator preset to grade your photo with bleached sand tones and warm golden highlights, mimicking the film's sunbaked Colosseum cinematography. It pairs especially well with desert, ruins, or open-sky shots where warm directional light is already present.",
	},
	{
		q: 'How do I make my vacation photos look like a vintage 35mm Hollywood film still?',
		a: 'Start from any preset for your base color grade, then dial in grain for authentic film texture, a touch of vignette to darken the corners, and switch on the film stock stamp for a printed-negative finish. Toggling the anamorphic letterbox on top completes the theatrical, 35mm-still look.',
		featured: true,
	},
	{
		q: 'Can I edit my photos to match the pastel, symmetrical aesthetic of a Wes Anderson movie?',
		a: "Cinematic Photo doesn't have a dedicated Wes Anderson preset yet. Its current presets are modeled on specific sci-fi and noir-leaning films rather than pastel palettes. For now, the Original grade with light grain and no vignette leaves the most room for a soft, symmetrical edit while we look at adding a preset built specifically for that look.",
	},
	{
		q: 'How do I achieve the high-contrast, moody monochrome noir look from classic detective films?',
		a: "There isn't a black-and-white noir preset built in yet, so a full monochrome conversion isn't currently supported. The closest available options are Interstellar's deep, cool blacks or The Dark Knight's crushed shadows, both of which push contrast and shadow depth in a moody, high-contrast direction.",
	},
	{
		q: 'What is the best way to get the neon amber and teal glow of a cyberpunk movie scene on my urban night photos?',
		a: 'Use the Blade Runner 2049 preset, which grades highlights toward amber neon and shadows toward a teal haze, the classic cyberpunk color split. On night city shots, add glow and halation to bloom light sources the way anamorphic lenses flare around neon signs and streetlights.',
	},
	{
		q: 'What color grading settings do I need to make a photo look like a cinematic sci-fi thriller?',
		a: 'Interstellar, Inception, Blade Runner 2049, and Matrix are each built around a distinct sci-fi color signature: cold cosmic blue, cool steel-blue dream logic, amber-neon with teal haze, and high-gain digital green. Pick whichever tone fits your subject, then layer in grain and glow to reinforce the tense, lens-driven atmosphere of a thriller.',
	},
	{
		q: 'How do I replicate the warm, nostalgic, sun-faded film look of a 1970s indie movie?',
		a: "Combine the Dune preset's warm, sun-bleached tones with a moderate amount of grain and vignette to fade the edges and roughen the texture the way an aged 35mm print looks. The film stock stamp adds a final period-accurate touch.",
	},
	{
		q: 'How do I recreate the sickly yellow-green look of Fight Club or the rain-soaked grime of Se7en?',
		a: "Select the Fight Club preset for a desaturated, sickly yellow-green grade with heavy grain, mimicking the film's grimy underground look, or the Se7en preset for an even darker, rain-soaked crushed-black grade. Both work well on gritty urban or interior shots.",
	},
	{
		q: 'Is there a preset for epic fantasy or adventure movies like The Lord of the Rings?',
		a: "Yes. Select The Lord of the Rings: The Fellowship of the Ring preset for a rich, mythic green-and-gold grade, or browse the Fantasy & Adventure genre on the all-presets page for more options including Pirates of the Caribbean and Pan's Labyrinth.",
	},
	{
		q: 'How do I get the dark, vintage look of Peaky Blinders on my photos?',
		a: "Select the Peaky Blinders preset for a desaturated, sepia-tinged grade with deep shadows and a 1920s feel. It works best on portraits or moody indoor shots, pair it with a touch of grain and the film stock stamp for an even more period-accurate finish.",
	},
	{
		q: 'Is there a preset for the extremely dark, blue-green mood of the show Dark?',
		a: "Yes. The Dark preset pushes contrast way up and brightness down, with a cold blue-green overlay for that near-black, moody look. It's built for low-light, forest, or night scenes where there's already some shadow detail for it to work with.",
	},
	{
		q: 'How do I get the warm desert tones of Better Call Saul?',
		a: 'Choose the Better Call Saul preset for a warm, high-contrast Albuquerque-style desert grade. It reads as a softer, more even take on desert warmth than the Breaking Bad preset, well suited to sunlit portraits and architecture shots.',
	},
	{
		q: 'Is there a preset for the muted, post-apocalyptic look of The Last of Us?',
		a: "Yes. Select The Last of Us preset to grade your photo with muted greens and earthy, overgrown tones, mimicking the show's post-apocalyptic look. It's especially effective on outdoor or nature photos with existing greenery.",
	},
	{
		q: 'How do I get the neon, purple-blue dreamy look of Euphoria?',
		a: 'Apply the Euphoria preset for a neon-soaked purple-blue color grade with a soft haze layer, similar to the amber haze used in the Blade Runner 2049 preset but shifted cool. It shows off best on night shots with visible neon or string lights.',
	},
	{
		q: 'Is there a preset for the desaturated, gritty look of The Walking Dead?',
		a: 'Yes. The Walking Dead preset mutes saturation and pushes contrast for a bleak, survival-horror grade. It works well on outdoor, overcast, or abandoned-location photos where a grittier, washed-out feel fits the subject.',
	},
	{
		q: 'How do I get the dark, cool-toned medieval look of House of the Dragon?',
		a: "Select the House of the Dragon preset for a darker, cooler variant of the Game of Thrones grade, with heavier contrast and shadow depth for a candlelit, court-intrigue feel. It's built for indoor, low-light, or stone-architecture photos.",
	},
	{
		q: 'How many presets does Cinematic Photo have, and are they organized by genre?',
		a: 'Cinematic Photo has 60 movie- and TV-inspired presets organized into nine genres: Thriller & Mystery, Crime, Sci-Fi, Drama, War & History, Fantasy & Adventure, Action, Superhero, and TV Shows. Browse the full list on the all-presets page, or start from five featured presets right in the editor.',
	},
];

export function getFeaturedFaqs(): Faq[] {
	return ALL_FAQS.filter((f) => f.featured);
}
