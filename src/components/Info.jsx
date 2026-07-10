import { BookOpen, ChevronDown, ExternalLink, Sparkles } from "lucide-react";

const ExternalIcon = () => (
  <ExternalLink aria-hidden="true" className="external-link-icon" />
);

export const Info = () => {
  return (
    <section className="info">
      <details className="usage-guide">
        <summary>
          <BookOpen aria-hidden="true" className="guide-icon" />
          How to use the platform
          <ChevronDown aria-hidden="true" className="guide-chevron" />
        </summary>
        <div className="usage-guide-content">
          <p>
            For kana, start with one row such as the <strong>a row</strong>. For
            Kanji, start with the <strong>N5 estimate</strong>. Then follow
            these steps in order:
          </p>
          <ol>
            <li>
              <strong>Learn:</strong> Learn what each character looks like and
              practise writing it.
            </li>
            <li>
              <strong>Character to Reading:</strong> Look at each character and
              practise remembering its reading.
            </li>
            <li>
              <strong>Reading to Character:</strong> Read the sound and practise
              remembering the character.
            </li>
            <li>
              <strong>Words:</strong> After kana, practise words made from your
              selected rows so the characters become easier to remember.
            </li>
          </ol>
          <p>
            Once you know a few rows, select them together and repeat the same
            steps. Mixing familiar rows helps you remember them without relying
            on their chart order.
          </p>
        </div>
      </details>
      <details className="usage-guide features-guide">
        <summary>
          <Sparkles aria-hidden="true" className="guide-icon" />
          Features
          <ChevronDown aria-hidden="true" className="guide-chevron" />
        </summary>
        <div className="usage-guide-content">
          <ul>
            <li>
              <strong>Choose your practice:</strong> Switch between Hiragana,
              Katakana, and Kanji, then select one or more study groups.
            </li>
            <li>
              <strong>Hear Japanese:</strong> Tap the practice card to hear it.
              Kanji uses the first listed on-yomi, or the first kun-yomi when no
              on-yomi is listed. Announce mode reads each new card
              automatically.
            </li>
            <li>
              <strong>Practise real words:</strong> Words use only kana from
              your selected rows, with Japanese, romaji, or English prompts.
            </li>
            <li>
              <strong>Control the deck:</strong> Use sequential or shuffle order
              and follow your position with the card counter. Word decks always
              shuffle.
            </li>
            <li>
              <strong>Use quick study tools:</strong> Reveal answers, open the
              chart or Kanji reference, or press the keyboard button to see
              keyboard shortcuts.
            </li>
            <li>
              <strong>Continue later:</strong> Your selections and settings are
              saved in this browser. Reset returns to the beginner defaults.
            </li>
          </ul>
        </div>
      </details>
      <p className="credits">
        Made by{" "}
        <a href="https://www.wrick17.com" rel="noreferrer" target="_blank">
          Wrick
          <ExternalIcon />
        </a>{" "}
        with source on{" "}
        <a
          href="https://github.com/wrick17/japanese-practice"
          rel="noreferrer"
          target="_blank"
        >
          GitHub
          <ExternalIcon />
        </a>{" "}
        and hosting on{" "}
        <a
          href="https://pages.cloudflare.com/"
          rel="noreferrer"
          target="_blank"
        >
          Cloudflare Pages
          <ExternalIcon />
        </a>
        {"."}
      </p>
      <p className="credits">
        Kanji readings and meanings from{" "}
        <a
          href="https://www.edrdg.org/wiki/KANJIDIC_Project.html"
          rel="noreferrer"
          target="_blank"
        >
          KANJIDIC2
          <ExternalIcon />
        </a>{" "}
        © EDRDG under{" "}
        <a
          href="https://creativecommons.org/licenses/by-sa/4.0/"
          rel="noreferrer"
          target="_blank"
        >
          CC BY-SA 4.0
          <ExternalIcon />
        </a>
        {"; "}JLPT estimates from{" "}
        <a
          href="https://github.com/davidluzgouveia/kanji-data"
          rel="noreferrer"
          target="_blank"
        >
          kanji-data
          <ExternalIcon />
        </a>{" "}
        based on{" "}
        <a
          href="https://www.tanos.co.uk/jlpt/"
          rel="noreferrer"
          target="_blank"
        >
          Tanos JLPT Resources
          <ExternalIcon />
        </a>
        {"."}
      </p>
    </section>
  );
};
