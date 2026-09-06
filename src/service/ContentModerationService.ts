import { blockedPhrases, blockedWords } from "./blockedTerms";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[@4]/g, "a")
    .replace(/[3]/g, "e")
    .replace(/[1!|]/g, "i")
    .replace(/[0]/g, "o")
    .replace(/[$5]/g, "s")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const blockedTerms = new Set(
  [...blockedWords, ...blockedPhrases]
    .map(normalizeText)
    .filter(Boolean),
);

export function findBlockedTerm(value: string) {
  const normalized = normalizeText(value);
  const words = normalized.split(" ").filter(Boolean);
  const compactText = words.join("");

  for (const term of blockedTerms) {
    if (term.includes(" ") ? normalized.includes(term) : words.includes(term)) return term;

    const compactTerm = term.replace(/\s/g, "");
    if (compactTerm.length >= 4 && compactText.includes(compactTerm)) return term;
  }

  for (let index = 0; index < words.length; index += 1) {
    if (words[index].length !== 1) continue;
    let joined = "";
    for (let cursor = index; cursor < Math.min(words.length, index + 12); cursor += 1) {
      if (words[cursor].length !== 1) break;
      joined += words[cursor];
      if (blockedTerms.has(joined)) return joined;
    }
  }

  return null;
}

export function assertTextAllowed(value: string) {
  if (findBlockedTerm(value)) {
    throw new Error("O texto contém linguagem imprópria. Revise o conteúdo antes de publicar.");
  }
}
