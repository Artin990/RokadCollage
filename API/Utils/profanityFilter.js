import PersianSwear from "persian-swear-words";
import { pinglishDataSet } from "detect-persian-swears/build/src/pinglishDataSet.js";

/**
 * Persian & Fingilish Profanity Filter & Content Moderation Engine
 * Multi-layer detection:
 * 1. Persian Dataset (persian-swear-words) + Turkic/Azeri Slang Dataset
 * 2. Fingilish Dataset (detect-persian-swears/pinglishDataSet + core stems)
 * 3. Persian Anti-Bypass: De-spacing (ک.ی.ر), Tatweel (کــــیر), Repeat collapse (کییییر), Leetspeak (کیعر, کوبص کش)
 * 4. Fingilish Anti-Bypass: De-spacing (k.i.r, k i r), Repeat collapse (kiiiir, koooon), Phonetics (jinda, jendeh, kyr), Levenshtein
 * 5. False Positive Protection: Whitelist for Persian and English dictionary words
 */

// High-severity root profanities that users often try to obfuscate (Persian & Turkic)
const SEVERE_ROOTS = [
  "کیر",
  "کص",
  "کس",
  "کون",
  "کونی",
  "جنده",
  "دیوث",
  "لاشی",
  "حرومزاده",
  "مادرجنده",
  "خارکصه",
  "خارکسه",
  "بیناموس",
  "پدرسگ",
  "خایه",
  "خایمال",
  "قحبه",
  "قهبه",
  "کسکش",
  "کصکش",
  "سکس",
  "پورن",
  "جق",
  "جقی",
  "سیکتیر",
  "سیک",
  "سیکیم",
  "سیکیش",
  "سیکن",
  "سیکدیر",
  "سیکتر",
  "سیکیمخیار",
  "داشاق",
  "داشاغ",
  "داشاخ",
  "گوت",
  "گوتورن",
  "گاییدن",
  "گاییدی",
  "سگپدر",
  "تخمسگ",
  "ننهجنده",
  "بکیرم",
  "بکنبکن",
  "شاش",
  "فاحشه",
  "حشری",
  "دول",
  "دودول",
  "سوراخکون",
  "کصلیس",
  "کسلیس",
  "چسخور",
  "ولدزنا",
  "کوبص",
  "کوبس",
  "کوص",
  "کوث",
  "کوسکش",
  "کوبصکش",
];

// Core Fingilish / Pinglish roots and vulgar stems
const FINGILISH_ROOTS = [
  "kir",
  "kiri",
  "kiram",
  "bekiram",
  "kirekhar",
  "kyr",
  "kos",
  "koss",
  "koos",
  "kose",
  "kosekesh",
  "koskesh",
  "koskhol",
  "koslis",
  "kossher",
  "kus",
  "koon",
  "kooni",
  "kuni",
  "koonde",
  "koonesh",
  "kun",
  "jende",
  "jendee",
  "jendeh",
  "zhende",
  "jinda",
  "jande",
  "jandeh",
  "dayoos",
  "dayus",
  "dayooc",
  "dayos",
  "lashi",
  "laashi",
  "lashkhor",
  "siktir",
  "sikter",
  "seekteer",
  "sik",
  "sikim",
  "seekeem",
  "sikish",
  "siktar",
  "dashagh",
  "dashag",
  "dashakh",
  "dashaagh",
  "dashaq",
  "khaye",
  "khayemal",
  "xaye",
  "xayemal",
  "haroomzade",
  "haromzade",
  "haroomi",
  "sagpedar",
  "pedarsag",
  "madarsag",
  "madarjende",
  "benamoos",
  "binamus",
  "qahbeh",
  "ghahbeh",
  "gahba",
  "qahba",
  "chaghal",
  "chaqal",
  "jagh",
  "jaghi",
  "shash",
  "shashidam",
  "goh",
  "gooh",
  "ridan",
  "ridi",
  "sexy",
  "porn",
  "koobas",
  "koobos",
  "koobs",
  "kobs",
  "gotveran",
];

// Full Fingilish dataset combining specialized dataset with core roots
const ALL_FINGILISH_SWEARS = Array.from(
  new Set([
    ...pinglishDataSet.map((w) => w.toLowerCase().trim()),
    ...FINGILISH_ROOTS.map((w) => w.toLowerCase().trim()),
  ])
);
const FINGILISH_SET = new Set(ALL_FINGILISH_SWEARS);

// Safe Persian words whitelist to prevent False Positives (Scunthorpe problem)
const SAFE_WHITELIST = new Set([
  "کویر",
  "کبیر",
  "کثیر",
  "امیر",
  "شیر",
  "پیر",
  "سیر",
  "تیر",
  "دیر",
  "گیر",
  "مسیر",
  "اکسیر",
  "کسب",
  "کسر",
  "شکست",
  "عکاس",
  "عکاسی",
  "کلاس",
  "تاکسی",
  "کانون",
  "قانون",
  "ستون",
  "اکنون",
  "مدیون",
  "میمون",
  "صابون",
  "طاعون",
  "خرس",
  "ترس",
  "درس",
  "پرس",
  "کیک",
  "کیکر",
  "کار",
  "کردن",
  "انجام",
  "کاش",
  "کشور",
  "کتاب",
  "کاهش",
  "افزایش",
  "سکوت",
  "سکه",
  "سکته",
  "ساکن",
  "ساکت",
  "کونیک",
  "پستاندار",
  "پستانداران",
  "بستن",
  // Words containing 'سیک' or similar phonetics:
  "کلاسیک",
  "تاکسیک",
  "پلاستیک",
  "لاستیک",
  "آکوستیک",
  "ژنتیک",
  "میکروتیک",
  "ارگانیک",
  "فیزیک",
  "موزیک",
  "مکزیک",
  "پیک",
  "باربیکیو",
  "بیسکویت",
]);

// Safe English dictionary words to prevent False Positives in English sentences
const SAFE_ENGLISH_WHITELIST = new Set([
  "kiss",
  "kid",
  "kit",
  "kin",
  "sir",
  "cook",
  "cool",
  "look",
  "book",
  "hook",
  "good",
  "kind",
  "soon",
  "moon",
  "noon",
  "room",
  "key",
  "king",
  "join",
  "point",
  "like",
  "link",
  "list",
  "line",
  "live",
  "life",
  "post",
  "host",
  "most",
  "cost",
  "skill",
  "skip",
  "task",
  "desk",
  "class",
  "click",
  "clock",
  "clean",
  "clear",
  "code",
  "node",
  "core",
  "more",
  "done",
  "one",
  "fine",
  "file",
  "find",
  "first",
  "disk",
  "risk",
  "user",
  "role",
  "name",
  "text",
  "test",
  "best",
  "rest",
  "next",
  "front",
  "back",
  "end",
  "app",
  "web",
  "dev",
  "tech",
  "data",
  "date",
  "base",
  "page",
  "home",
  "card",
  "part",
  "port",
  "cart",
  "sort",
  "site",
  "side",
  "size",
]);

/**
 * Normalizes Persian/Arabic text:
 * Removes zero-width characters, tatweel/kashida, tashkeel, standardizes arabic letters.
 *
 * @param {string} str
 * @returns {string}
 */
const normalizeText = (str) => {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // ZWNJ / ZWJ / BOM
    .replace(/\u0640+/g, "") // Tatweel / kashida (e.g. کــــیر -> کیر)
    .replace(/[ي]/g, "ی")
    .replace(/[ك]/g, "ک")
    .replace(/[ة]/g, "ه")
    .replace(/[ؤ]/g, "و")
    .replace(/[إأآ]/g, "ا")
    .replace(/[\u064B-\u065F]/g, "") // Tashkeel / diacritics
    .toLowerCase()
    .trim();
};

/**
 * Collapses duplicate letters (e.g. "کییییر" or "کییر" -> "کیر").
 *
 * @param {string} str
 * @returns {string}
 */
const collapseRepeats = (str) => {
  return str.replace(/(.)\1+/g, "$1");
};

/**
 * Collapses individual letters separated by dots, spaces, dashes (e.g. "ک . ی . ر" -> "کیر").
 *
 * @param {string} str
 * @returns {string}
 */
const deSpace = (str) => {
  return str.replace(/([آ-یa-z0-9])[\s\.\-\_\*\/\\+\#\@\^~=]+(?=[آ-یa-z0-9])/gi, "$1");
};

/**
 * Collapses Latin letters separated by symbols (e.g. "k.i.r" -> "kir", "k i r" -> "kir").
 *
 * @param {string} str
 * @returns {string}
 */
const deSpaceLatin = (str) => {
  return str.replace(/([a-z0-9])[\s\.\-\_\*\/\\+\#\@\^~=]+(?=[a-z0-9])/gi, "$1");
};

/**
 * Collapses Latin repeated letters (e.g. "kiiiir" -> "kir", "koooon" -> "kon").
 *
 * @param {string} str
 * @returns {string}
 */
const collapseLatin = (str) => {
  return str.replace(/([a-z])\1+/g, "$1");
};

/**
 * Collapses Latin 3+ repeated letters to double letters (e.g. "koooon" -> "koon").
 *
 * @param {string} str
 * @returns {string}
 */
const collapseLatinDouble = (str) => {
  return str.replace(/([a-z])\1{2,}/g, "$1$1");
};

/**
 * Maps common Persian leetspeak / intentional typo bypass tricks.
 * Handles "کیعر", "کوبص", "کوبص کش", "جندع", "دیوص", etc.
 *
 * @param {string} str
 * @returns {string}
 */
const normalizeLeetspeak = (str) => {
  return str
    .replace(/کیعر/g, "کیر")
    .replace(/کعر/g, "کیر")
    .replace(/کعیر/g, "کیر")
    .replace(/کوبص/g, "کص")
    .replace(/کوبس/g, "کس")
    .replace(/کوص/g, "کص")
    .replace(/کوث/g, "کص")
    .replace(/جندع/g, "جنده")
    .replace(/کصع/g, "کص")
    .replace(/کونع/g, "کون")
    .replace(/دیوص/g, "دیوث")
    .replace(/دیوس/g, "دیوث")
    .replace(/قرمساق/g, "غرمساق")
    .replace(/قرمصاق/g, "غرمساق");
};

/**
 * Generates phonetic and typo-normalized variants of a Fingilish token.
 *
 * @param {string} str
 * @returns {string[]}
 */
const normalizeFingilishToken = (str) => {
  if (!str) return [];
  const s = str.toLowerCase().trim();
  const variants = new Set();
  variants.add(s);

  const deSpaced = deSpaceLatin(s);
  variants.add(deSpaced);

  const c1 = collapseLatin(s);
  const c2 = collapseLatinDouble(s);
  const dc1 = collapseLatin(deSpaced);
  const dc2 = collapseLatinDouble(deSpaced);

  variants.add(c1);
  variants.add(c2);
  variants.add(dc1);
  variants.add(dc2);

  // Common phonetic substitutions in Fingilish
  for (const v of Array.from(variants)) {
    variants.add(v.replace(/oo/g, "u"));
    variants.add(v.replace(/oo/g, "o"));
    variants.add(v.replace(/ee/g, "i"));
    variants.add(v.replace(/y/g, "i"));
    variants.add(v.replace(/x/g, "kh"));
    variants.add(v.replace(/q/g, "gh"));
    variants.add(v.replace(/h$/g, "")); // jendeh -> jende
    variants.add(v.replace(/c$/g, "s")); // dayooc -> dayoos
    variants.add(v.replace(/ck/g, "k")); // sick -> sik
  }

  return Array.from(variants).filter(Boolean);
};

/**
 * Computes Levenshtein distance between two strings.
 *
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
const levenshtein = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

/**
 * Inspects input text for Persian, Turkic, or Fingilish profanity.
 * Employs multiple normalization passes + dataset search + fuzzy typo matching.
 *
 * @param {string} text - The input text to validate
 * @returns {{ hasProfanity: boolean, matchedWords: string[] }}
 */
export const containsProfanity = (text) => {
  if (!text || typeof text !== "string") {
    return { hasProfanity: false, matchedWords: [] };
  }

  const matched = new Set();

  // ================= PERSIAN & TURKIC PASS =================
  const norm = normalizeText(text);
  const collapsed = collapseRepeats(norm);
  const leetNorm = normalizeLeetspeak(collapsed);
  const deSpacedNorm = deSpace(norm);
  const deSpacedCollapsed = collapseRepeats(deSpacedNorm);
  const deSpacedLeet = normalizeLeetspeak(deSpacedCollapsed);

  const persianVariants = [
    norm,
    collapsed,
    leetNorm,
    deSpacedNorm,
    deSpacedCollapsed,
    deSpacedLeet,
  ];

  // 1. Direct PersianSwear dataset lookup across normalized variants
  for (const variant of persianVariants) {
    const tokens = variant.split(/\s+/);
    for (const token of tokens) {
      if (SAFE_WHITELIST.has(token)) continue;
      if (PersianSwear.isBad(token)) {
        matched.add(token);
      }
    }
  }

  // 2. Severe root profanities boundary & phrase match
  for (const root of SEVERE_ROOTS) {
    for (const variant of persianVariants) {
      const regex = new RegExp(`(^|\\s|[.,!?;:])(${root})($|\\s|[.,!?;:])`, "iu");
      if (regex.test(variant)) {
        matched.add(root);
      }
    }
  }

  // 3. Fuzzy Levenshtein match for intentional Persian typos (e.g. 'کیعر')
  const allPersianTokens = new Set([
    ...norm.split(/\s+/),
    ...collapsed.split(/\s+/),
    ...deSpacedCollapsed.split(/\s+/),
  ]);

  for (const token of allPersianTokens) {
    if (!token || token.length < 3) continue;
    if (SAFE_WHITELIST.has(token)) continue;

    for (const root of SEVERE_ROOTS) {
      if (Math.abs(token.length - root.length) <= 1) {
        const dist = levenshtein(token, root);
        if (dist === 1 && token.length >= 3) {
          if (token[0] === root[0] || token.endsWith(root.slice(1))) {
            matched.add(token);
          }
        }
      }
    }
  }

  // ================= FINGILISH / LATIN PASS =================
  const latinLower = text.toLowerCase().trim();
  const latinDeSpaced = deSpaceLatin(latinLower);
  const latinVariants = [
    latinLower,
    latinDeSpaced,
    collapseLatin(latinLower),
    collapseLatin(latinDeSpaced),
  ];

  // 1. Token-level normalization against full Fingilish dataset
  for (const lv of latinVariants) {
    const tokens = lv.split(/[^a-z0-9]+/i).filter(Boolean);
    for (const token of tokens) {
      if (SAFE_ENGLISH_WHITELIST.has(token)) continue;

      const normVariants = normalizeFingilishToken(token);
      for (const nv of normVariants) {
        if (SAFE_ENGLISH_WHITELIST.has(nv)) continue;
        if (FINGILISH_SET.has(nv)) {
          matched.add(token);
          break;
        }
      }
    }
  }

  // 2. Multi-word Fingilish phrase check
  for (const phrase of ALL_FINGILISH_SWEARS) {
    if (phrase.includes(" ")) {
      const pRegex = new RegExp(`(^|\\s|[.,!?;:])(${phrase})($|\\s|[.,!?;:])`, "i");
      if (pRegex.test(latinLower) || pRegex.test(latinDeSpaced)) {
        matched.add(phrase);
      }
    }
  }

  // 3. Fuzzy Levenshtein match for obfuscated 3-6 letter Fingilish roots (e.g. 'jeende', 'jinda')
  const allLatinTokens = latinLower.split(/[^a-z0-9]+/i).filter((t) => t.length >= 3);
  for (const token of allLatinTokens) {
    if (SAFE_ENGLISH_WHITELIST.has(token)) continue;

    for (const root of FINGILISH_ROOTS) {
      if (Math.abs(token.length - root.length) <= 1) {
        const dist = levenshtein(token, root);
        if (dist <= 1 && token.length >= 3) {
          if (token[0] === root[0] || token.slice(-2) === root.slice(-2)) {
            matched.add(token);
            break;
          }
        }
      }
    }
  }

  return {
    hasProfanity: matched.size > 0,
    matchedWords: Array.from(matched),
  };
};

/**
 * Masks prohibited words in text with asterisks (***).
 *
 * @param {string} text
 * @returns {string}
 */
export const maskProfanity = (text) => {
  if (!text || typeof text !== "string") return "";
  let result = text;
  const { matchedWords } = containsProfanity(text);
  for (const word of matchedWords) {
    const cleanWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(cleanWord, "giu");
    result = result.replace(regex, "***");
  }
  return result;
};

export default containsProfanity;
