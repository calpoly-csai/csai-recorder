export function textFromCamelCase(key) {
  let isUppercase = char => char.charCodeAt(0) > 64 && char.charCodeAt(0) < 90;
  let str = "";
  for (let i = 0; i < key.length; i++) {
    if (i === 0) str += key[i].toUpperCase();
    else if (isUppercase(key[i])) str += " " + key[i];
    else str += key[i];
  }
  return str;
}

export function textToCamelCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word, i) => (i === 0 ? word : word[0].toUpperCase() + word.slice(1)))
    .join("");
}
