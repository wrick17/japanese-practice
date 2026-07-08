export const Info = () => {
  return (
    <section className="info">
      <h2>Study notes</h2>
      <p>
        Pick Hiragana or Katakana, choose a study mode, then select the rows you
        want in the deck. Reset restores the default Hiragana vowel row and
        sequential order.
      </p>
      <p>
        Words come from a generated local JMdict-Simplified word bank, so the
        app runs without a backend or runtime API calls. A word appears only
        when every kana unit in it belongs to the selected rows.
      </p>
      <p>
        The cheat sheet stays available for quick review, and the announce
        control uses the browser's built-in Japanese speech voice when one is
        available.
      </p>
      <p>
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
