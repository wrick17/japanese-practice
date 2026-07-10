export const fitText = (container, text, maxFontSize = 160) => {
  let smallest = 1;
  let largest = maxFontSize;

  while (smallest < largest) {
    const fontSize = Math.ceil((smallest + largest) / 2);
    text.style.fontSize = `${fontSize}px`;

    if (
      text.scrollWidth <= container.clientWidth &&
      text.scrollHeight <= container.clientHeight
    ) {
      smallest = fontSize;
    } else {
      largest = fontSize - 1;
    }
  }

  text.style.fontSize = `${smallest}px`;
  return smallest;
};
