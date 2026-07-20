import { BookOpen, ChevronDown, ExternalLink, Sparkles } from "lucide-react";

const ExternalIcon = () => (
  <ExternalLink aria-hidden="true" className="external-link-icon" />
);

export const getLearningGuide = (isKanji) =>
  isKanji
    ? {
        intro: "Start with the N5 estimate and follow these steps in order:",
        steps: [
          {
            label: "Learn",
            text: "Study each Kanji's shape, meaning, on-yomi, and kun-yomi, and practise writing it.",
          },
          {
            label: "Kanji to Reading",
            text: "Look at the Kanji and recall its readings and meaning.",
          },
          {
            label: "Reading to Kanji",
            text: "Read the given sound and recall the matching Kanji and meaning.",
          },
        ],
        outro:
          "Once N5 feels familiar, add the next JLPT estimate. Mix levels only after you can recognise the earlier Kanji without relying on their order.",
      }
    : {
        intro:
          "Start with one Hiragana or Katakana row, such as the a row, and follow these steps in order:",
        steps: [
          {
            label: "Learn",
            text: "Learn what each kana looks like and practise writing it.",
          },
          {
            label: "Japanese to Romaji",
            text: "Look at each kana and recall its sound.",
          },
          {
            label: "Romaji to Japanese",
            text: "Read the sound and recall the matching kana.",
          },
          {
            label: "Words",
            text: "Practise words made from your selected rows so the kana become easier to remember.",
          },
        ],
        outro:
          "Once you know a few rows, select them together and repeat the same steps. Mixing familiar rows helps you remember them without relying on chart order.",
      };

export const Info = () => {
  const guides = [
    ["Kana learning path", getLearningGuide(false)],
    ["Kanji learning path", getLearningGuide(true)],
  ];

  return (
    <section className="info">
      <details className="usage-guide">
        <summary>
          <BookOpen aria-hidden="true" className="guide-icon" />
          How to use the platform
          <ChevronDown aria-hidden="true" className="guide-chevron" />
        </summary>
        <div className="usage-guide-content">
          {guides.map(([title, guide]) => (
            <section className="learning-path" key={title}>
              <h3>{title}</h3>
              <p>{guide.intro}</p>
              <ol>
                {guide.steps.map(({ label, text }) => (
                  <li key={label}>
                    <strong>{label}:</strong> {text}
                  </li>
                ))}
              </ol>
              <p>{guide.outro}</p>
            </section>
          ))}
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
