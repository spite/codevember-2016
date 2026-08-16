# Music credits

The audio-reactive experiments (10, 16 and 30) originally streamed from
SoundCloud. That API now requires OAuth 2.1 on every request, including the
stream endpoint, and registering an app requires a paid Artist Pro account —
neither of which a static page can do. They now play the tracks below, bundled
here so nothing depends on a third party API.

Each file was re-encoded to 128kbps to keep the repository small. Two are
Creative Commons and require attribution, which is what this file is for; two
are from Pixabay, whose licence asks for none but does not allow redistributing
the file on a standalone basis — they ship as components of the experiments.

All three experiments load the same playlist — **Play** cycles through it — and
each one starts on the track that suits its bands best.

| Default in | Track | Artist | Release | Licence | Source |
| --- | --- | --- | --- | --- | --- |
| 10 — Odeo | i love she | Florian Filsinger | King of Verlieren [am038], Acedia Music | [CC BY 2.5](https://creativecommons.org/licenses/by/2.5/) | [archive.org/details/acediamusic038](https://archive.org/details/acediamusic038) |
| 16 — Torus | the other side | XU | Singing rust [ndn025] | [CC BY 2.5](https://creativecommons.org/licenses/by/2.5/) | [archive.org/details/ndn025](https://archive.org/details/ndn025) |
| 30 — Triangle Tunnel | Intro Opening Titles Music | Alex Morgan | — | [Pixabay Content License](https://pixabay.com/service/license-summary/) | [pixabay.com/music/…-583247](https://pixabay.com/es/music/sintetizador-intro-opening-titles-music-583247/) |
| — | Late Chill Lofi Hip Hop Type Beat (Fog) | see Pixabay page | — | [Pixabay Content License](https://pixabay.com/service/license-summary/) | [pixabay.com/music/…-211509](https://pixabay.com/es/music/late-chill-lofi-hip-hop-type-beat-fog-211509/) |

30 is a reconstruction of GMUNK and Onesize's PYRADICAL titles, whose soundtrack
MassiveMusic composed to commission and never released — so a title-sequence
piece stands in for it.

The two Creative Commons tracks come from the Internet Archive **netlabels**
collection. That distinction matters: archive.org's `licenseurl` field is filled
in by whoever uploaded the item, so it means nothing on its own — the collection
is full of vinyl rips of commercial albums tagged CC0 by strangers. Inside
`collection:netlabels` the uploader *is* the label publishing the release, which
is what makes the licence trustworthy. Both items above were checked with
`https://archive.org/metadata/<identifier>` for licence and uploader.

The Pixabay track is **not** Creative Commons. The Pixabay Content License
allows free use including commercially and without attribution, but it does not
permit redistributing the file on a standalone basis. It ships here as one
component of the experiments rather than as a download in its own right; if that
reading ever looks thin, delete `pixabay-lofi-fog.mp3` and drop its entry from
the `tracks` array in 10, 16 and 30 — the playlist skips missing files.

## Replacing a track

The tracks were picked by measuring what the visualisations actually read: an
`AnalyserNode` with `fftSize` 256, so 128 bins of ~172Hz each. `Kick.js` watches
bins 5-20 in 10, and bins 10-20 and 20-30 in 30 — roughly 0.9-5kHz, the
percussion and upper-mid range, not the bass. A track that saturates those bins
constantly gives a static-looking result, so what matters is how much they
*vary*, not how loud they are.

Good hunting grounds for CC-licensed music:

- [Internet Archive netlabels](https://archive.org/details/netlabels) — verifiable licence metadata, CORS-enabled hosting
- [Openverse](https://openverse.org/) — Creative Commons' own search, with an API that needs no key
- [Jamendo](https://www.jamendo.com/) and [ccMixter](http://ccmixter.org/)
- [Free Music Archive](https://freemusicarchive.org/)

Prefer CC BY, CC BY-SA or CC0. Avoid NC, which conflicts with this repository's
own CC BY licence, and avoid covers or edits — the uploader can license their
recording but not the underlying composition.
