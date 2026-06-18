import { useState, useEffect, useCallback, useMemo } from "react";

// ─── Brand tokens ──────────────────────────────────────────────────────────
const NAVY = "#1C2D4A";
const NAVY_DK = "#15233A";
const GOLD = "#C9973A";
const GOLD_LT = "#FEF6E0";
const ROSE = "#C85A6E";
const ROSE_LT = "#FDF0F3";
const TEAL = "#1F7A78";
const TEAL_LT = "#E4F5F4";
const PLUM = "#6B4A8A";
const PLUM_LT = "#F1ECFB";
const SAGE = "#3D7060";
const SAGE_LT = "#E8F4EE";
const STEEL = "#3A5C8A";
const STEEL_LT = "#E8EFF7";
const CLAY = "#B5683E";
const CLAY_LT = "#FBEDE4";
const SLATE = "#475569";
const CREAM = "#FBF9F6";
const MID = "#E2E8F0";

// ─── Assessment data ───────────────────────────────────────────────────────
const AGE_BANDS = [
  {
    id: "1-2", label: "Age 1", minAge: 1, maxAge: 1, accent: TEAL, accentLt: TEAL_LT,
    together: "Sit on the floor for ten uninterrupted minutes. Narrate what your child is doing as they play — \u201cyou're stacking the red block on the blue one\u201d — and pause after each sentence to see whether they imitate a sound or word back. Score the first three Language items based on this exercise.",
    domains: {
      "Language & Communication": [
        "Says 5 or more words clearly and consistently",
        "Points to ask for something or to share interest with you",
        "Responds to their own name nearly every time it's called",
        "Imitates a new sound or word within the same play session",
        "Follows one simple instruction without a gesture cue (\u201cbring me the cup\u201d)",
        "Combines a word with a gesture to communicate (\u201cup\u201d while reaching)",
        "Uses at least one word to name a person who isn't in the room",
      ],
      "Emotional Development": [
        "Seeks comfort from you specifically when upset, not just anyone nearby",
        "Shows clear, repeated preferences for certain toys, foods, or people",
        "Displays a visible range of expressions: joy, frustration, curiosity, surprise",
        "Calms within a few minutes once you offer comfort or distraction",
        "Shows real interest in other children's faces or play, even from a distance",
        "Briefly checks your face for reaction after something new or surprising happens",
        "Recovers their mood after a short separation from you (you leave the room and return)",
      ],
      "Reading & Pre-Literacy": [
        "Sits through a short picture book with you for at least 5 minutes",
        "Points to at least one named picture when you ask \u2018where's the...?\u2019",
        "Attempts to turn pages, even clumsily, with some help",
        "Recognises a favourite book by its cover before you open it",
        "Imitates \u2018reading\u2019 behaviour \u2014 babbling at a book as if telling its story",
        "Reaches for or requests a specific book by gesture or sound",
      ],
    },
  },
  {
    id: "2-3", label: "Age 2", minAge: 2, maxAge: 2, accent: ROSE, accentLt: ROSE_LT,
    together: "Take a slow walk together and narrate everything you see using one \u2018upgraded\u2019 word per object \u2014 \u2018that's not just a big dog, that's an enormous dog.\u2019 Ask your child to repeat the new word. Note which words they attempt before scoring the Language section.",
    domains: {
      "Language & Communication": [
        "Uses 2\u20133 word phrases purposefully (\u2018want more juice\u2019, \u2018go outside now\u2019)",
        "Has an expressive vocabulary of roughly 50 or more words",
        "Asks simple questions, especially \u2018what's that?\u2019 or \u2018where go?\u2019",
        "Names familiar people, animals, and objects without prompting",
        "Uses at least one descriptive word beyond basics (cold, fast, heavy)",
        "Repeats back a new word you introduce within the same conversation",
        "Combines two ideas in one sentence (\u2018doggy run\u2019 or \u2018mommy go work\u2019)",
      ],
      "Emotional Development": [
        "Names at least one basic emotion correctly (happy, sad, mad, scared)",
        "Shows early signs of empathy \u2014 patting, hugging, or offering a toy when someone is upset",
        "Has tantrums that resolve within roughly 10\u201315 minutes with support",
        "Separates from you with manageable, brief distress rather than prolonged panic",
        "Begins reaching for words instead of only hitting, biting, or screaming",
        "Shows pride or pleasure clearly after completing a small task",
        "Notices and reacts when another person nearby is crying or upset",
      ],
      "Reading & Pre-Literacy": [
        "Sits through a short picture book for 5 or more minutes without losing interest",
        "Points to a named object within a book illustration",
        "Asks to be read to, rather than only accepting it when offered",
        "Recognises and anticipates a repeated phrase in a familiar story",
        "Shows curiosity about letters, signs, or print in the everyday environment",
        "Tries to \u2018tell\u2019 a familiar story back to you in fragments",
      ],
    },
  },
  {
    id: "3-4", label: "Age 3", minAge: 3, maxAge: 3, accent: GOLD, accentLt: GOLD_LT,
    together: "At dinner, ask your child to tell you one thing that happened today \u2014 not \u2018how was your day\u2019 but \u2018tell me one thing that happened.\u2019 Resist filling silences. Let them search for words before you score the first three Language items based on what they produce unprompted.",
    domains: {
      "Language & Communication": [
        "Speaks in full sentences of 4 or more words",
        "Has an expressive vocabulary estimated at 300 or more words",
        "Tells a simple story or recounts a recent event with some sequence",
        "Uses at least one advanced descriptive word unprompted (huge, tiny, exhausted)",
        "Asks \u2018why\u2019 questions regularly and listens to the answer",
        "Uses pronouns correctly most of the time (I, you, he, she)",
        "Can describe an object's use, not just its name (\u2018the spoon is for eating\u2019)",
      ],
      "Emotional Development": [
        "Names 4 or more distinct emotions correctly",
        "Can describe, in simple terms, what made them feel a certain way",
        "Begins to wait or take turns with some adult support",
        "Shows an early self-soothing attempt (deep breath, asking for a hug, finding a quiet spot)",
        "Recovers from a meltdown with guidance within about 10 minutes",
        "Notices and comments on another person's emotional state unprompted",
        "Negotiates or compromises in play at least occasionally, rather than only protesting",
      ],
      "Reading & Pre-Literacy": [
        "Listens to a full picture book from start to finish without losing focus",
        "Recognises 3 or more letters of the alphabet, especially in their own name",
        "Pretends to read aloud to a sibling, toy, or pet",
        "Asks at least one question about the story while it's being read",
        "Shows interest in what specific words \u2018say\u2019 when pointed to on a page",
        "Identifies their own name in print, even with help",
      ],
    },
  },
  {
    id: "4-5", label: "Age 4", minAge: 4, maxAge: 4, accent: PLUM, accentLt: PLUM_LT,
    together: "Read one short story together and pause halfway through. Ask \u2018why do you think they did that?\u2019 and \u2018what happens next?\u2019 Let them finish the story in their own words before reading the real ending. Use this to score the first three Language items with real evidence, not guesswork.",
    domains: {
      "Language & Communication": [
        "Tells a clear, sequenced story with a recognisable beginning and end",
        "Uses complex sentences joined with \u2018because\u2019, \u2018but\u2019, or \u2018so\u2019",
        "Uses nuanced vocabulary unprompted (frustrated, curious, proud, careful)",
        "Can explain, in their own words, roughly how something works",
        "Engages in genuine back-and-forth conversation, not just one-word answers",
        "Asks a question that builds on something you just said, showing real listening",
        "Retells part of a conversation or event accurately to a third person",
      ],
      "Emotional Development": [
        "Names and roughly explains nuanced emotions (embarrassed, nervous, proud)",
        "Uses words to express a need before escalating to a physical reaction",
        "Shows beginning signs of independent self-regulation without being prompted",
        "Demonstrates empathy unprompted, without being asked to \u2018be nice\u2019",
        "Apologises and attempts some form of repair after a conflict",
        "Tolerates a disappointing outcome (losing a game) without a prolonged meltdown",
        "Identifies one thing that helps them feel calmer when upset",
      ],
      "Reading & Pre-Literacy": [
        "Recognises most or all letters of the alphabet and some of their sounds",
        "Identifies a small number of sight words on their own (the, and, go, stop)",
        "Retells a familiar story in roughly the correct order",
        "Shows sustained interest in books for 10 or more minutes at a time",
        "Attempts to \u2018write\u2019 or copy letters and simple words",
        "Predicts what might happen next in an unfamiliar story before being told",
      ],
    },
  },
  {
    id: "5-8", label: "Ages 5–8", minAge: 5, maxAge: 8, accent: SAGE, accentLt: SAGE_LT,
    together: "Ask your child to recommend a book or show \u2018like a critic would\u2019 \u2014 what happens, who they liked, and why \u2014 then ask \u2018what would you have done differently if you were the main character?\u2019 Score the first three Language items based on the depth of their answer, not just its length.",
    domains: {
      "Language & Communication": [
        "Reads independently at or near an age-appropriate level",
        "Uses an advanced, varied vocabulary in everyday conversation",
        "Can summarise a book, show, or event clearly in their own words",
        "Communicates complex needs and feelings without excessive prompting",
        "Asks thoughtful, original questions that go beyond the immediate topic",
        "Holds a multi-turn conversation on a topic of their own choosing",
        "Explains a disagreement from both sides, not just their own",
      ],
      "Emotional Development": [
        "Identifies and names a wide emotional vocabulary accurately",
        "Self-regulates most big feelings without needing adult intervention",
        "Resolves at least minor peer conflict with minimal adult mediation",
        "Shows visible resilience after disappointment or a failed attempt",
        "Demonstrates consistent empathy and perspective-taking unprompted",
        "Reflects on their own behaviour afterward, sometimes without being asked",
        "Asks for help appropriately rather than masking distress or shutting down",
      ],
      "Reading & Pre-Literacy": [
        "Reads independently for pleasure, not only when required to",
        "Chooses their own books or stories without being prompted",
        "Discusses a character's motivations or feelings in some depth",
        "Reads at, near, or building steadily toward grade level",
        "Names at least one book or series they describe as a genuine favourite",
        "Re-reads or revisits a favourite story or chapter by choice",
      ],
    },
  },
  {
    id: "9-10", label: "Ages 9–10", minAge: 9, maxAge: 10, accent: STEEL, accentLt: STEEL_LT,
    together: "Ask your child to explain something they understand well but you don't \u2014 a game, an app, a topic from school \u2014 and genuinely let them teach you. Ask follow-up questions. Score the Language items based on how clearly they can organise and sequence an explanation for someone who doesn't already know it.",
    domains: {
      "Language & Communication": [
        "Explains a complex idea or process clearly enough for someone else to follow",
        "Uses precise, specific vocabulary rather than vague or filler words",
        "Adjusts how they speak depending on who they're talking to",
        "Builds an argument with a reason, not just a preference (\u2018because\u2026\u2019)",
        "Summarises a longer story or article, capturing the main point",
        "Asks questions that show they're thinking beyond the surface",
        "Stays on topic across a longer back-and-forth conversation",
      ],
      "Emotional Development": [
        "Names subtle or mixed emotions (frustrated-but-trying, nervous-but-excited)",
        "Recovers from disappointment without it derailing the whole day",
        "Navigates friendship friction without needing an adult to step in most times",
        "Recognises when they need a break and takes one before melting down",
        "Considers another person's perspective even when they disagree",
        "Takes responsibility after a mistake rather than only deflecting blame",
        "Talks about worries or problems rather than only bottling them up",
      ],
      "Reading & Pre-Literacy": [
        "Reads chapter books or longer texts independently and willingly",
        "Understands the main idea and key details of what they read",
        "Infers things the text implies but doesn't state directly",
        "Has clear reading preferences (a genre, author, or series they love)",
        "Uses reading to find things out, not only for assigned work",
        "Discusses what they've read with some genuine opinion or insight",
      ],
    },
  },
  {
    id: "11-12", label: "Ages 11–12", minAge: 11, maxAge: 12, accent: CLAY, accentLt: CLAY_LT,
    together: "Pick a real topic you might actually disagree on \u2014 a household rule, a current event suited to their age, a choice they want to make \u2014 and have a genuine back-and-forth where they have to make their case. Score the Language and Emotional items based on how they construct an argument and how they handle the disagreement itself.",
    domains: {
      "Language & Communication": [
        "Constructs a clear argument with supporting reasons and some evidence",
        "Uses abstract vocabulary (fairness, consequence, intention) accurately",
        "Distinguishes fact from opinion in conversation or reading",
        "Adapts tone and word choice for different audiences and settings",
        "Explains the reasoning behind their opinion, not just the opinion itself",
        "Engages with a counterpoint instead of just repeating their position",
        "Communicates disagreement respectfully rather than shutting down or escalating",
      ],
      "Emotional Development": [
        "Regulates strong emotions independently in most everyday situations",
        "Handles peer conflict, exclusion, or social pressure with growing maturity",
        "Shows empathy that accounts for context, not just surface behaviour",
        "Reflects honestly on their own role in a problem or conflict",
        "Manages frustration with schoolwork or setbacks without giving up",
        "Seeks support appropriately rather than masking stress or anxiety",
        "Begins to understand that other people's reactions aren't always about them",
      ],
      "Reading & Pre-Literacy": [
        "Reads longer and more complex texts with strong comprehension",
        "Identifies themes or deeper meaning, not just plot",
        "Forms and defends an opinion about what they've read",
        "Chooses challenging material by personal interest",
        "Connects ideas across different books, subjects, or real life",
        "Reads independently and consistently as a genuine habit",
      ],
    },
  },
];

const GRADES = [
  { min: 0, max: 5, grade: "D", color: "#B0413E", bg: "#FBEAE9",
    text: "Your child is showing gaps across multiple domains at once \u2014 not one isolated weak spot, but a pattern. That pattern matters more than any single missed milestone, because domains compound: a child who struggles to name a feeling often struggles to explain it in words, which slows reading comprehension in turn. The encouraging part: children scoring here typically show the fastest, most visible change of any starting point, because a structured daily system is replacing what was previously guesswork, in every domain at once." },
  { min: 6, max: 11, grade: "C", color: "#C97A3A", bg: "#FEF1E0",
    text: "One or two domains are genuinely behind while the rest are tracking normally \u2014 this is a narrower, more targeted gap than it may feel like. The developmental windows for vocabulary explosion (ages 1\u20135) and emotional regulation (ages 2\u20137) are still open at this score range for the vast majority of children. Twelve months from now, a child who closes this exact gap with daily, structured practice is generally indistinguishable from a same-age peer who never had it." },
  { min: 12, max: 16, grade: "B", color: GOLD, bg: GOLD_LT,
    text: "This is the most common result on this assessment, and it describes a child developing solidly with specific, identifiable edges still to sharpen. The unchecked boxes are not random \u2014 they cluster in one domain far more often than not, which is precisely what makes this score range so actionable. A targeted month of focused practice in that single domain typically moves a B to an A faster than parents expect." },
  { min: 17, max: 20, grade: "A", color: SAGE, bg: SAGE_LT,
    text: "Strong, well-rounded development across all three domains relative to typical milestones for this age. This is not common, and it is worth pausing to genuinely register that. The real risk at this score is complacency \u2014 strong early development can plateau without continued input. The objective from here is staying ahead of the next developmental stage before your child arrives at it." },
];

const PRODUCTS = {
  bundle: { name: "The Complete Connected Childhood System Bundle", url: "https://piercepublishing.gumroad.com/l/ybprp", color: NAVY,
    desc: "All four guides together, at a reduced bundle price versus buying separately. The appropriate starting point when more than one domain needs attention at once." },
  eq: { name: "The Emotional Intelligence Toolkit for Children\u2122", url: "https://piercepublishing.gumroad.com/l/zgdqs", color: ROSE,
    desc: "20 tools, 18 sections. Inside: Tantrum Response Scripts for de-escalating meltdowns word for word, the Calm-Down Routine Checklist, the Emotional Vocabulary Builder covering six weeks of feeling words, and the 21-Day Emotional Resilience Challenge." },
  vocab: { name: "Advanced Vocabulary for Toddlers\u2122", url: "https://piercepublishing.gumroad.com/l/kwbvv", color: TEAL,
    desc: "500 advanced words organised into 20 categories, the Word Upgrade Method for converting basic words into advanced ones in real time, 8 word-for-word parent conversation scripts, and a 30-day Daily Vocabulary Tracker." },
  reading: { name: "How To Raise a Child That Loves Reading\u2122", url: "https://piercepublishing.gumroad.com/l/crzqa", color: GOLD,
    desc: "The Deep Reading Method for reading aloud in a way that measurably builds comprehension, the Reading Identity Framework, an age-by-age reading roadmap from ages 2 to 10, and a 30-day Daily Reading Tracker." },
  screenfree: { name: "The Screen-Free Activity Bible\u2122 (Paperback, Amazon)", url: "https://amazon.com/s?k=The+Screen-Free+Activity+Bible+Pierce+Publishing", color: "#2DD4BF",
    desc: "Published in print only, by design. 200+ activities to channel high engagement into hands-on learning, available as a paperback that ships directly to your door." },
};

function getGrade(score) {
  return GRADES.find(g => score >= g.min && score <= g.max) || GRADES[0];
}

function getBandForAge(age) {
  if (age == null || age === "") return AGE_BANDS[0];
  const n = Number(age);
  if (Number.isNaN(n)) return AGE_BANDS[0];
  const clamped = Math.max(1, Math.min(12, Math.round(n)));
  return AGE_BANDS.find(b => clamped >= b.minAge && clamped <= b.maxAge) || AGE_BANDS[AGE_BANDS.length - 1];
}

function getMatchedProduct(grade, domainScores) {
  if (grade === "D") return [PRODUCTS.bundle];
  if (grade === "A") return [PRODUCTS.eq, PRODUCTS.vocab, PRODUCTS.reading, PRODUCTS.screenfree];
  // B or C: find lowest domain
  const entries = Object.entries(domainScores);
  entries.sort((a, b) => a[1].pct - b[1].pct);
  const lowest = entries[0][0];
  const map = {
    "Language & Communication": PRODUCTS.vocab,
    "Emotional Development": PRODUCTS.eq,
    "Reading & Pre-Literacy": PRODUCTS.reading,
  };
  return [map[lowest]];
}

// ─── Persistent storage helpers ───────────────────────────────────────────
// Uses standard browser localStorage so this works on any hosting platform
// (StackBlitz, Vercel, Netlify, your own domain) — not tied to any one host.
const STORAGE_KEY = "pierce-publishing-children-data";

function useChildrenStore() {
  const [children, setChildren] = useState([{ id: 1, name: "", age: "", checks: {} }]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) setChildren(parsed);
      }
    } catch (e) { /* no saved data yet, or storage unavailable */ }
    setLoaded(true);
  }, []);

  const persist = useCallback((next) => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
    catch (e) { /* storage unavailable (e.g. private browsing) — continue in-memory */ }
  }, []);

  const updateChildren = useCallback((updater) => {
    setChildren(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      persist(next);
      return next;
    });
  }, [persist]);

  return [children, updateChildren, loaded];
}

// ─── UI primitives ─────────────────────────────────────────────────────────
function CheckItem({ label, checked, onToggle, accent }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: "flex", alignItems: "flex-start", gap: 12,
        width: "100%", textAlign: "left", background: checked ? `${accent}0F` : "transparent",
        border: "none", borderRadius: 10, padding: "10px 12px", cursor: "pointer",
        transition: "background 0.15s",
      }}
    >
      <span style={{
        flexShrink: 0, width: 22, height: 22, borderRadius: 6, marginTop: 1,
        border: `2px solid ${checked ? accent : "#CBD5E1"}`,
        background: checked ? accent : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
      }}>
        {checked && <span style={{ color: "#fff", fontSize: 13, fontWeight: 800 }}>✓</span>}
      </span>
      <span style={{
        fontSize: 14.5, lineHeight: 1.5, color: checked ? NAVY : SLATE,
        fontWeight: checked ? 600 : 400, fontFamily: "'Source Serif Pro', Georgia, serif",
      }}>{label}</span>
    </button>
  );
}

function DomainBlock({ title, items, checks, onToggle, accent }) {
  const checkedCount = items.filter((_, i) => checks[i]).length;
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
        <h3 style={{
          fontFamily: "'Source Serif Pro', Georgia, serif", fontSize: 17, fontWeight: 700,
          color: accent, margin: 0, letterSpacing: "-0.01em",
        }}>{title}</h3>
        <span style={{
          fontSize: 12.5, fontWeight: 700, color: accent, fontFamily: "Inter, system-ui, sans-serif",
          background: `${accent}14`, padding: "3px 10px", borderRadius: 20,
        }}>{checkedCount} / {items.length}</span>
      </div>
      <div>
        {items.map((item, i) => (
          <CheckItem key={i} label={item} checked={!!checks[i]} accent={accent}
            onToggle={() => onToggle(i)} />
        ))}
      </div>
    </div>
  );
}

function GradeStamp({ grade, color, bg, size = 88 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      border: `4px solid ${color}`, background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, position: "relative",
    }}>
      <div style={{
        width: size - 16, height: size - 16, borderRadius: "50%",
        border: `1.5px solid ${color}66`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          fontFamily: "'Source Serif Pro', Georgia, serif", fontWeight: 800,
          fontSize: size * 0.42, color, lineHeight: 1,
        }}>{grade}</span>
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <a href={product.url} target="_blank" rel="noopener noreferrer" style={{
      display: "block", textDecoration: "none", borderRadius: 14, overflow: "hidden",
      border: `1.5px solid ${product.color}33`, marginBottom: 14,
      transition: "transform 0.15s", background: "#fff",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{ background: product.color, padding: "12px 18px" }}>
        <span style={{
          color: "#fff", fontWeight: 700, fontSize: 14.5,
          fontFamily: "'Source Serif Pro', Georgia, serif",
        }}>{product.name}</span>
      </div>
      <div style={{ padding: "14px 18px" }}>
        <p style={{ fontSize: 13.5, color: SLATE, lineHeight: 1.6, margin: "0 0 10px" }}>{product.desc}</p>
        <span style={{
          fontSize: 13, fontWeight: 700, color: product.color,
          fontFamily: "Inter, system-ui, sans-serif",
        }}>Get this guide →</span>
      </div>
    </a>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [children, updateChildren, loaded] = useChildrenStore();
  const [activeIdx, setActiveIdx] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const active = children[activeIdx] || children[0];
  const ageBand = getBandForAge(active?.age);

  const domainScores = useMemo(() => {
    const result = {};
    let total = 0;
    Object.entries(ageBand.domains).forEach(([domain, items]) => {
      const checks = active?.checks?.[ageBand.id]?.[domain] || {};
      const count = items.filter((_, i) => checks[i]).length;
      result[domain] = { count, total: items.length, pct: count / items.length };
      total += count;
    });
    return { domains: result, total };
  }, [active, ageBand]);

  const gradeInfo = getGrade(domainScores.total);
  const matchedProducts = useMemo(
    () => getMatchedProduct(gradeInfo.grade, domainScores.domains),
    [gradeInfo, domainScores]
  );

  const toggleCheck = (domain, idx) => {
    updateChildren(prev => {
      const next = [...prev];
      const child = { ...next[activeIdx] };
      child.checks = { ...child.checks };
      child.checks[ageBand.id] = { ...(child.checks[ageBand.id] || {}) };
      child.checks[ageBand.id][domain] = { ...(child.checks[ageBand.id][domain] || {}) };
      child.checks[ageBand.id][domain][idx] = !child.checks[ageBand.id][domain][idx];
      next[activeIdx] = child;
      return next;
    });
  };

  const setAge = (age) => {
    updateChildren(prev => {
      const next = [...prev];
      next[activeIdx] = { ...next[activeIdx], age };
      return next;
    });
  };

  const setName = (name) => {
    updateChildren(prev => {
      const next = [...prev];
      next[activeIdx] = { ...next[activeIdx], name };
      return next;
    });
  };

  const addChild = () => {
    updateChildren(prev => [...prev, {
      id: Date.now(), name: "", age: "", checks: {},
    }]);
    setActiveIdx(children.length);
    setShowResults(false);
  };

  const removeChild = (idx) => {
    if (children.length === 1) return;
    updateChildren(prev => prev.filter((_, i) => i !== idx));
    setActiveIdx(0);
    setShowResults(false);
  };

  const totalPossible = 20;
  const progressPct = Math.round((domainScores.total / totalPossible) * 100);

  if (!loaded) return null;

  return (
    <div style={{
      minHeight: "100vh", background: CREAM,
      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,400;0,600;0,700;0,800;1,400&family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::selection { background: ${GOLD}55; }
      `}</style>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div style={{ background: NAVY, padding: "0 0 0", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: -120, right: -80, width: 320, height: 320,
          borderRadius: "50%", background: "#25354A",
        }} />
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "36px 24px 28px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{
              background: GOLD, color: NAVY, fontWeight: 800, fontSize: 10.5,
              letterSpacing: "0.06em", borderRadius: 5, padding: "3px 9px",
            }}>PIERCE PUBLISHING™</span>
            <span style={{ color: "#8AABB0", fontSize: 12.5 }}>The Connected Childhood System™</span>
          </div>
          <h1 style={{
            fontFamily: "'Source Serif Pro', Georgia, serif", color: "#fff",
            fontSize: "clamp(28px, 5vw, 38px)", fontWeight: 800, margin: "0 0 8px",
            letterSpacing: "-0.01em", lineHeight: 1.1,
          }}>Is My Child On Track?</h1>
          <p style={{ color: "#B8C8D8", fontSize: 14.5, margin: 0, maxWidth: 480, lineHeight: 1.6 }}>
            A 20-point developmental assessment across language, emotional growth, and reading readiness. Fill it in for each child below — your answers are saved automatically.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ── Child tabs ────────────────────────────────────────────── */}
        <div style={{
          display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center",
          marginTop: -18, marginBottom: 28, position: "relative", zIndex: 2,
        }}>
          {children.map((child, idx) => {
            const isActive = idx === activeIdx;
            return (
              <div key={child.id} style={{ position: "relative" }}>
                <button
                  onClick={() => { setActiveIdx(idx); setShowResults(false); }}
                  style={{
                    background: isActive ? "#fff" : "#FFFFFFCC",
                    color: isActive ? NAVY : SLATE,
                    border: `1.5px solid ${isActive ? GOLD : MID}`,
                    borderRadius: 10, padding: "10px 16px 10px 14px",
                    fontWeight: isActive ? 700 : 500, fontSize: 13.5,
                    cursor: "pointer", boxShadow: isActive ? "0 4px 14px rgba(0,0,0,0.08)" : "none",
                    transition: "all 0.15s",
                  }}
                >
                  {child.name || `Child ${idx + 1}`}
                  {child.age !== "" && child.age != null && (
                    <span style={{ opacity: 0.6, fontWeight: 500 }}> · {child.age}y</span>
                  )}
                  {children.length > 1 && (
                    <span
                      onClick={(e) => { e.stopPropagation(); removeChild(idx); }}
                      style={{ marginLeft: 8, color: "#94A3B8", fontWeight: 700 }}
                    >×</span>
                  )}
                </button>
              </div>
            );
          })}
          <button onClick={addChild} style={{
            background: "transparent", border: `1.5px dashed ${MID}`, borderRadius: 10,
            padding: "10px 16px", color: SLATE, fontSize: 13.5, fontWeight: 600,
            cursor: "pointer",
          }}>+ Add child</button>
        </div>

        {/* ── Child setup row ───────────────────────────────────────── */}
        <div style={{
          background: "#fff", borderRadius: 16, padding: "20px 22px", marginBottom: 24,
          border: `1px solid ${MID}`, display: "flex", gap: 16, flexWrap: "wrap",
        }}>
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: SLATE, letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
              CHILD'S NAME (optional)
            </label>
            <input
              value={active?.name || ""}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Maya"
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 8,
                border: `1.5px solid ${MID}`, fontSize: 14.5, fontFamily: "inherit",
                color: NAVY, outline: "none",
              }}
            />
          </div>
          <div style={{ flex: "1 1 160px" }}>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: SLATE, letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
              CHILD'S AGE
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="number" min={1} max={12} step={1}
                value={active?.age ?? ""}
                onChange={e => {
                  const v = e.target.value;
                  if (v === "") { setAge(""); return; }
                  const n = Math.max(1, Math.min(12, Math.round(Number(v))));
                  setAge(n);
                }}
                placeholder="3"
                style={{
                  width: 72, padding: "10px 12px", borderRadius: 8,
                  border: `1.5px solid ${MID}`, fontSize: 14.5, fontFamily: "inherit",
                  color: NAVY, outline: "none", fontWeight: 700,
                }}
              />
              <span style={{ fontSize: 13, color: SLATE }}>years old</span>
            </div>
            {active?.age !== "" && active?.age != null && (
              <div style={{ marginTop: 8, fontSize: 12, color: ageBand.accent, fontWeight: 700 }}>
                Scoring against: {ageBand.label} milestones
              </div>
            )}
          </div>
        </div>

        {(active?.age === "" || active?.age == null) && (
          <div style={{
            background: GOLD_LT, borderRadius: 12, padding: "12px 16px",
            marginBottom: 20, fontSize: 13.5, color: NAVY, fontWeight: 600,
          }}>
            Enter your child's age above to load the right set of milestones.
          </div>
        )}

        {active?.age !== "" && active?.age != null && (
          <>
            {/* ── Progress bar ──────────────────────────────────────── */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>
                  {domainScores.total} of {totalPossible} milestones checked
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: ageBand.accent }}>{progressPct}%</span>
              </div>
              <div style={{ height: 8, background: MID, borderRadius: 20, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${progressPct}%`, background: ageBand.accent,
                  borderRadius: 20, transition: "width 0.3s ease",
                }} />
              </div>
            </div>

            {/* ── Together prompt ───────────────────────────────────── */}
            <div style={{
              background: ageBand.accentLt, borderRadius: 14, padding: "16px 20px",
              marginBottom: 28, borderLeft: `4px solid ${ageBand.accent}`,
            }}>
              <div style={{
                fontSize: 11.5, fontWeight: 800, color: ageBand.accent,
                letterSpacing: "0.05em", marginBottom: 6,
              }}>BEFORE YOU SCORE THIS SECTION</div>
              <p style={{ fontSize: 13.5, color: SLATE, lineHeight: 1.6, margin: 0 }}>{ageBand.together}</p>
            </div>

            {/* ── Domain checklists ─────────────────────────────────── */}
            {Object.entries(ageBand.domains).map(([domain, items]) => (
              <DomainBlock
                key={domain}
                title={domain}
                items={items}
                checks={active?.checks?.[ageBand.id]?.[domain] || {}}
                onToggle={(i) => toggleCheck(domain, i)}
                accent={ageBand.accent}
              />
            ))}

            {/* ── See results button ──────────────────────────────────── */}
            {!showResults && (
              <button
                onClick={() => setShowResults(true)}
                style={{
                  width: "100%", background: NAVY, color: "#fff", border: "none",
                  borderRadius: 14, padding: "16px", fontSize: 15.5, fontWeight: 700,
                  cursor: "pointer", fontFamily: "'Source Serif Pro', Georgia, serif",
                  boxShadow: "0 4px 16px rgba(28,45,74,0.25)", marginTop: 8,
                }}
              >
                See {active?.name || "this child"}'s Grade →
              </button>
            )}
          </>
        )}

        {/* ── Results ────────────────────────────────────────────────── */}
        {showResults && active?.age !== "" && active?.age != null && (
          <div style={{ marginTop: 12 }}>
            <div style={{
              background: "#fff", borderRadius: 18, padding: "28px 24px",
              border: `1.5px solid ${gradeInfo.color}44`, marginBottom: 24,
              display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap",
            }}>
              <GradeStamp grade={gradeInfo.grade} color={gradeInfo.color} bg={gradeInfo.bg} />
              <div style={{ flex: "1 1 220px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: SLATE, marginBottom: 4 }}>
                  {active?.name || "This child"}'s score: {domainScores.total} / 20
                </div>
                <p style={{ fontSize: 14, color: SLATE, lineHeight: 1.65, margin: 0 }}>{gradeInfo.text}</p>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h3 style={{
                fontFamily: "'Source Serif Pro', Georgia, serif", fontSize: 18,
                color: NAVY, marginBottom: 12,
              }}>Domain breakdown</h3>
              {Object.entries(domainScores.domains).map(([domain, d]) => (
                <div key={domain} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span style={{ color: NAVY, fontWeight: 600 }}>{domain}</span>
                    <span style={{ color: SLATE }}>{d.count} / {d.total}</span>
                  </div>
                  <div style={{ height: 6, background: MID, borderRadius: 20, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${d.pct * 100}%`, background: ageBand.accent, borderRadius: 20,
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{
              fontFamily: "'Source Serif Pro', Georgia, serif", fontSize: 18,
              color: NAVY, marginBottom: 12,
            }}>{active?.name || "Your child"}'s matched resource{matchedProducts.length > 1 ? "s" : ""}</h3>
            {matchedProducts.map(p => <ProductCard key={p.name} product={p} />)}

            <button
              onClick={() => setShowResults(false)}
              style={{
                background: "transparent", border: "none", color: SLATE,
                fontSize: 13.5, fontWeight: 600, cursor: "pointer", padding: "8px 0",
                textDecoration: "underline", marginTop: 4,
              }}
            >← Back to checklist</button>
          </div>
        )}

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div style={{ marginTop: 56, paddingTop: 24, borderTop: `1px solid ${MID}`, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.7, margin: "0 0 4px" }}>
            This assessment is an independent tool created by Pierce Publishing for general informational purposes. It is not a diagnostic instrument and does not replace evaluation by a pediatrician, speech-language pathologist, or licensed child psychologist.
          </p>
          <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>
            Dorian Pierce · Pierce Publishing™ · The Connected Childhood System™
          </p>
        </div>
      </div>
    </div>
  );
}
