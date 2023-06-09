export const Info = () => {
  return (
    <div className="info">
      <h2>How to use</h2>
      <p>
        So you're learning Japanese. You want to practice writing after hearing
        or seeing the character. This tool helps you do just that.
      </p>
      <p>
        Just select which row you want to practice (you can select multiple rows
        if you like). White button signifies the selected row. By default only
        the vowels are selected.
      </p>
      <p>
        Click on the "Surprise Me" button to get a random character. Click on
        the character to hear it. Click on the "Help Me" button to see the
        character. Click on the "Done" button to move on to the next character.
        <br />
        <br />
        NOTE:{" "}
        <b>
          If you don't select anything then all the characters will be selected.
        </b>
        <br />
        <br />
        If you want to see all the characters at once, click on the{" "}
        <b>
          <u>Show Cheat Sheet</u>
        </b>{" "}
        button. It'll show you all the characters in a grid.
      </p>
      <p>
        If you wish to hear what the character sounds like, you can turn on the{" "}
        <b>Announce</b> button. Every time the character chanages it'll announce
        the syllable for you.
      </p>
      <p>
        If you wish to switch to <b>Katakana</b> or <b>Hiragana</b>, you can use
        the toggle at the top in the header.
      </p>
      <br />
      <p>
        <a href="/">Reload</a>
      </p>
      <br />
      <br />
      <p>
        Made with <span className="red">♥️</span> by{" "}
        <a target="__blank" href="https://www.wrick17.com">
          Wrick
        </a>{" "}
        and hosted on{" "}
        <a target="__blank" href="https://github.com/wrick17/japanese-practice">
          Github
        </a>
      </p>
    </div>
  );
};

