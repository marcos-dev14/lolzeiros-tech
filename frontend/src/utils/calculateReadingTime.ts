export function calculateReadingTime(text: string) {
  const formattedText = text.replaceAll(new RegExp(/[^A-Za-z 0-9]/g), '').trim();

  const wordsCount = formattedText.split(' ').length;
  
  const minutes = Math.floor(wordsCount / 140);
  let seconds = (Math.floor(wordsCount % 140 / (140/60)));

  if (!seconds) {
    return `${minutes} minutos`;
  }
  
  if (seconds < 10) {
    seconds = Number(`0${seconds}`);
  }

  return `${minutes}:${seconds} minutos`
}