# Art sources

Every picture on the site is either a public-domain painting translated by `art/build.py`, a pixel wordmark read from an open font by `art/wordmark.py`, or a diagram generated from code in `src/art/`. No image comes from an image generator, and no artwork of another website is used. Originals are not committed: `python -I art/build.py --raw <empty scratch dir> --download` fetches them from the URLs below, and the script writes only the processed files to `public/art/`.

Licence reasoning: each painter died more than 70 years ago (Wright of Derby 1797, Menzel 1905), so the paintings are in the public domain worldwide; a faithful photograph of a flat work adds no new right (Wikimedia Commons tags: PD-Art, PD-old-100). The pixel translations are our adaptation; the originals stay public domain.

| Plate (file in `public/art/`) | Painting | Owner and object | Original file (Wikimedia Commons) | Licence tag on Commons | Used for |
|---|---|---|---|---|---|
| `forge-hero`, `forge-hero-sepia` | Joseph Wright of Derby, *An Iron Forge*, 1772 | Tate, T06670 | https://commons.wikimedia.org/wiki/File:Joseph_Wright_-_An_Iron_Forge_-_Google_Art_Project.jpg (Google Arts & Culture 8QFaV4btMWcjBA, 2801 x 2572) | PD-Art, PD-old-100-expired (deathyear 1797) | Home hero backdrop |
| `forge-smithy`, `forge-smithy-sepia` | Joseph Wright of Derby, *The Blacksmith's Shop*, 1771 | Yale Center for British Art, Paul Mellon Collection | https://commons.wikimedia.org/wiki/File:Joseph_Wright_of_Derby_-_The_Blacksmith%27s_Shop_-_Google_Art_Project.jpg (Google Arts & Culture YQG7cp1C1rHxag, 4688 x 5975) | PD-Art, PD-old-100-expired | Acquisition plate, banner of some pages |
| `forge-mill-wide`, `forge-mill-wide-sepia`, `forge-slab`, `forge-slab-sepia` | Adolph Menzel, *Das Eisenwalzwerk (Moderne Cyklopen)* (*The Iron Rolling Mill*), 1872 to 1875 | Alte Nationalgalerie, Staatliche Museen zu Berlin | https://commons.wikimedia.org/wiki/File:Adolph_Menzel_-_Eisenwalzwerk_-_Google_Art_Project.jpg (Google Arts & Culture pgFVPI1J1YGXZA, 3543 x 2199) | PD-art-two-auto (deathyear 1905) | Call-to-action panorama, section edges |
| `forge-night`, `forge-night-sepia` | Joseph Wright of Derby, *An Iron Forge Viewed from Without*, 1773 | Hermitage Museum, Saint Petersburg | https://commons.wikimedia.org/wiki/File:The_Iron_Forge_Viewed_from_Without.jpg (Web Gallery of Art, 1243 x 904) | PD-Art, PD-old-auto-expired | Page banners, 404 |

Other pictures:

| What | Source | Licence |
|---|---|---|
| Pixel wordmark OGUN (`src/art/pixel-wordmark.mjs`) | Glyph outlines of Departure Mono 1.500, https://github.com/rektdeckard/departure-mono, copyright 2022 to 2024 Helena Zhang | SIL OFL 1.1 (`public/fonts/LICENSE-departure-mono.txt`) |
| Ogun Studio screenshots (`public/img/studio-*.png`) | Ogun Studio 0.0.1a on the hosted pre-alpha hub, sample data only, captured with Playwright | Apache-2.0 (the product) |
| Operating-system logos on the download cards | Simple Icons | CC0 |

Treatment parameters (crop box, grid, black point, gamma, local contrast) are in `PLATES` in `build.py`. The ramps are `RAMPS`. The grid is 480 x 300 art pixels for the hero, 560 x 200 for the panorama, 240 x 160 for the slab and night plates and 200 x 160 for the smithy; one art pixel is drawn 2 to 4 CSS pixels wide.
