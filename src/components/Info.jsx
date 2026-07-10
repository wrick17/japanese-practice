export const Info = () => {
  return (
    <section className="info">
      <details className="usage-guide">
        <summary>How to use the platform</summary>
        <div className="usage-guide-content">
          <p>
            Start with one kana row, such as the <strong>a row</strong>, and
            follow these steps in order:
          </p>
          <ol>
            <li>
              <strong>Learn:</strong> Learn what each character looks like and
              practise writing it.
            </li>
            <li>
              <strong>Japanese to Romaji:</strong> Look at each character and
              practise remembering how it sounds.
            </li>
            <li>
              <strong>Romaji to Japanese:</strong> Read the sound and practise
              remembering the character.
            </li>
            <li>
              <strong>Words:</strong> Practise words made from that row so the
              characters become easier to remember.
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
        <summary>Features</summary>
        <div className="usage-guide-content">
          <ul>
            <li>
              <strong>Choose your practice:</strong> Switch between Hiragana and
              Katakana, then select one row or combine several rows.
            </li>
            <li>
              <strong>Hear Japanese:</strong> Tap the practice card to hear it.
              Announce mode reads each new card automatically.
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
              kana chart, or press the <strong>?</strong> button to see keyboard
              shortcuts.
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
        <a target="__blank" href="https://www.wrick17.com">
          Wrick
        </a>{" "}
        with source on{" "}
        <a target="__blank" href="https://github.com/wrick17/japanese-practice">
          GitHub
        </a>{" "}
        and hosting on{" "}
        <a target="__blank" href="https://pages.cloudflare.com/">
          Cloudflare Pages
        </a>
        .
      </p>
    </section>
  );
};
