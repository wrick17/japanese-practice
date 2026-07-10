# Third-Party Notices

## kanji-data

The JLPT estimate assignments and display order in
`src/constants/kanjiV1.json` are derived from
[`davidluzgouveia/kanji-data`](https://github.com/davidluzgouveia/kanji-data),
commit `00fd7079c3890f430759536f91aa5e854ec0ca4f`.

MIT License

Copyright (c) 2019 David Gouveia

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Tanos JLPT Resources

The pinned `kanji-data` project attributes its `jlpt_new` estimate mapping to
Jonathan Waller's [Tanos JLPT Resources](https://www.tanos.co.uk/jlpt/). Tanos
permits reuse of its freely available data under Creative Commons Attribution
and asks users to credit and link the site; see its
[sharing and copyright statement](https://www.tanos.co.uk/jlpt/sharing/).

## KANJIDIC2

The readings and English meanings in `src/constants/kanjiV1.json` are derived
from [KANJIDIC2](https://www.edrdg.org/wiki/KANJIDIC_Project.html), copyright
James William Breen and the Electronic Dictionary Research and Development
Group. KANJIDIC2 is licensed under the
[Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).
See the [EDRDG licence statement](https://www.edrdg.org/edrdg/licence.html).
Accordingly, the derived `src/constants/kanjiV1.json` file is distributed under
CC BY-SA 4.0.

The generated derivative filters KANJIDIC2 to the 2,230 characters assigned a
new or legacy N5-N1 estimate by the pinned `kanji-data` source, retains Japanese
on-yomi and kun-yomi plus English meanings, groups and orders entries using that
estimate source, and records the KANJIDIC2 database version, creation date,
source URL, and downloaded file's SHA-256 hash. Reading and meaning strings are
otherwise preserved from the recorded KANJIDIC2 snapshot.
