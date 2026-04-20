/**
 * Sol — MEDWELL's chatbot engine.
 *
 * Rule-based on purpose: the site ships to GitHub Pages with no backend,
 * so we match keywords client-side against curated responses instead of
 * piping through an LLM. That keeps the experience instant, free, and
 * free of API-key leaks — at the cost of only knowing what's in this file.
 *
 * Structure:
 *   NAV              — destinations Sol can send the user to
 *   INTERESTS        — topical buckets (research, clinical, wellness…)
 *                      each with trigger keywords, a blurb, and a nudge
 *   NAV_PHRASES      — "take me to events" style intents
 *   FAQ              — canned answers for common direct questions
 *   respond(text)    — orchestrator that returns { text, nav?, actions? }
 *
 * The order of checks in respond() matters — see comments there.
 */

export const SOL_INTRO =
  "Hey — I'm Sol, MEDWELL's sun guide. Tell me what you're into or where you want to head, and I'll nudge you the right way.";

export const STARTER_CHIPS = [
  { label: "I'm new here", payload: "i'm new here" },
  { label: 'What events fit me?', payload: 'what events fit me' },
  { label: 'How do I join?', payload: 'how do i join' },
  { label: 'Meet the collective', payload: 'meet the collective' },
];

// Central destination table. navKey references here are used by FAQ and
// interest entries so we don't duplicate URLs.
const NAV = {
  about: { label: 'About', to: '/#about' },
  anatomy: { label: 'The Anatomy', to: '/#anatomy' },
  events: { label: 'Events', to: '/events' },
  news: { label: 'News', to: '/news' },
  join: { label: 'Join MEDWELL', to: 'https://linktr.ee/medwellucsd', external: true },
  contact: { label: 'Email the board', to: 'mailto:medwell@ucsd.edu', external: true },
  instagram: { label: 'Instagram', to: 'https://www.instagram.com/medwell.at.ucsd/', external: true },
  home: { label: 'Home', to: '/' },
};

// Interest buckets. A user message can match multiple — Sol stitches
// together up to two blurbs and offers the matched nudges as CTAs.
const INTERESTS = [
  {
    id: 'research',
    match: ['research', 'lab', 'bench', 'publication', 'paper', 'principal investigator', ' pi ', 'thesis'],
    blurb:
      'For the research-minded: keep an eye on our Research Rounds and lab-lead panels — members share current projects, and alumni in labs often post openings.',
    nudge: 'events',
  },
  {
    id: 'clinical',
    match: ['clinical', 'shadow', 'shadowing', 'hospital', 'doctor', 'patient', 'volunteer', 'scribe', 'clinic'],
    blurb:
      'Clinical exposure is one of our core pillars — watch Events for shadowing nights, physician Q&As, and clinic volunteer sign-ups.',
    nudge: 'events',
  },
  {
    id: 'wellness',
    match: ['wellness', 'mental', 'burnout', 'balance', 'stress', 'self care', 'self-care', 'mindful', 'meditation', 'sleep', 'therapy', 'anxiety', 'overwhelm'],
    blurb:
      "Wellness is literally the point. The Anatomy section breaks down how we weave mental-health support, community, and academic structure into one thing.",
    nudge: 'anatomy',
  },
  {
    id: 'community',
    match: ['community', 'friends', 'social', 'mentor', 'peer', 'belong', 'connect', 'meet people', 'find people'],
    blurb:
      'We treat MEDWELL as a collective first. Monthly socials, mentor pods, and small-group study nights are the fastest way to plug in.',
    nudge: 'about',
  },
  {
    id: 'mcat',
    match: ['mcat', 'test prep', 'cars', 'bio bio', 'kaplan', 'aamc'],
    blurb:
      "MCAT support shows up as guided study blocks and CARS-style discussion sessions — not a prep course, more like a study family.",
    nudge: 'events',
  },
  {
    id: 'apps',
    match: ['amcas', 'aacomas', 'personal statement', 'admissions', 'secondaries', 'med school app', 'medical school application'],
    blurb:
      'For app-year folks: our Senior Circle runs personal-statement workshops and mock interviews each cycle.',
    nudge: 'events',
  },
  {
    id: 'career',
    match: ['specialty', 'osteopath', 'physician assistant', 'nursing', 'public health', 'dental school', 'pharmacy school', 'career path', 'specialties'],
    blurb:
      'Specialty panels rotate through MD, DO, PA, and public-health tracks — great for figuring out which path actually fits.',
    nudge: 'events',
  },
  {
    id: 'leadership',
    match: ['lead', 'leadership', 'officer', 'board', 'committee', 'run for', 'get involved deeper'],
    blurb:
      'Every spring we open officer and committee seats — start by showing up to a few events so the current board knows your name.',
    nudge: 'contact',
  },
];

// Direct-navigation regexes. Only fires when the user clearly wants to
// land on a destination ("take me to events", "go to news", "about").
const NAV_PHRASES = [
  { test: /\babout\b|who (are|is) (you|medwell)|what is medwell|your mission|what do (you|y'?all) do/, nav: 'about' },
  { test: /\banatomy\b|pillars?|structure|framework/, nav: 'anatomy' },
  { test: /\bevents?\b|calendar|upcoming|happening|what'?s on/, nav: 'events' },
  { test: /\bnews\b|announcements?|articles?|updates?/, nav: 'news' },
  { test: /\bjoin\b|sign.?up|become (a )?member|how do i get in/, nav: 'join' },
  { test: /\bcontact\b|email (me|us|the|you)?|reach (out|you)|get in touch/, nav: 'contact' },
  { test: /\binsta(gram)?\b|ig\b/, nav: 'instagram' },
  { test: /^home$|take me home|go home|back home/, nav: 'home' },
];

// Short-form canned answers. FAQ runs first so "how do I join" style
// phrasing lands a conversational reply + nudge instead of a silent nav.
const FAQ = [
  {
    test: /new here|new to medwell|first time|just found|get started|start here|don'?t know where/,
    reply:
      "Welcome! Fast orientation — 1) read About for the vibe, 2) skim Events for what's next, 3) drop yourself on the list via Linktree. Which first?",
    actions: ['about', 'events', 'join'],
  },
  {
    test: /what events fit|which events should|events for me|match.+interest|help me (pick|choose)/,
    reply:
      "Tell me 2–3 things you're into — wellness, clinical exposure, research, community, MCAT, med-school apps, specialty panels — and I'll match them to our pillars.",
    actions: [],
  },
  {
    test: /how (do|can|would) (i|you|one) (join|get in|sign up|become (a )?member)|how to join/,
    reply:
      "No application fee, no dues — we run on the Linktree for sign-ups. I can pop it open for you.",
    actions: ['join', 'contact'],
  },
  {
    test: /who runs|leadership|president|officers?|\bboard\b/,
    reply:
      "Leadership rotates each year and is listed on our Linktree bio. Best direct line is medwell@ucsd.edu.",
    actions: ['contact', 'join'],
  },
  {
    test: /when .* meet|meeting time|schedule|gbm|general body/,
    reply:
      "General body meetings run roughly every other Wednesday evening on campus. The Events page has the live calendar.",
    actions: ['events'],
  },
  {
    test: /(application|app)\s*fee|cost|price|dues|how much/,
    reply:
      "No application fee, no dues. All majors welcome — we're student-affairs recognized at UCSD.",
    actions: ['join'],
  },
  {
    test: /major|pre.?med only|biology only|bio major|cog sci|engineering major/,
    reply:
      "All majors. Pre-med is a path, not a major — members come from cog sci, bioengineering, lit, music, you name it.",
    actions: ['about'],
  },
  {
    test: /first year|freshman|sophomore|transfer|new (to )?(ucsd|campus|school)/,
    reply:
      "First- and second-years thrive here — no prior experience needed. Come to one GBM, then drift toward whichever pillar speaks to you.",
    actions: ['events', 'about'],
  },
  {
    test: /meet the collective|who are (y'?all|you people)|members/,
    reply:
      "The collective is spread across class years and majors — bound by the same instinct that medicine should feel human. The Anatomy section shows how we're built.",
    actions: ['anatomy', 'about'],
  },
  {
    test: /\bhi\b|\bhello\b|\bhey\b|^yo\b|^sup\b|what'?s up/,
    reply: "Hey! Want a quick tour, or do you already have something specific in mind?",
    actions: ['about', 'events'],
  },
  {
    test: /\bthanks?\b|\bthank you\b|\bappreciate\b|\bty\b/,
    reply: "Anytime. Good luck out there.",
    actions: [],
  },
  {
    test: /who (are|made) you|what are you|you a bot|are you (a )?human|your name/,
    reply:
      "I'm Sol — MEDWELL's little sun guide. I don't replace the humans on the board; I just help you find them faster.",
    actions: ['about', 'contact'],
  },
];

/**
 * Lowercase, collapse whitespace, pad with spaces so `\b` and leading/
 * trailing phrase matches behave consistently.
 */
function normalize(str) {
  return ' ' + str.toLowerCase().replace(/[^a-z0-9\s']/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
}

function matchInterests(text) {
  return INTERESTS.filter((intr) => intr.match.some((kw) => text.includes(kw)));
}

function actionsFromKeys(keys = []) {
  return keys.map((k) => ({ label: NAV[k].label, nav: NAV[k] }));
}

/**
 * Main entry. Returns one of:
 *   { text, nav }             — Sol is navigating
 *   { text, actions: [...] }  — Sol is suggesting next steps
 *
 * Order of checks:
 *   1. FAQ (most specific wording wins)
 *   2. Interests (advice is more valuable than a silent route change)
 *   3. NAV_PHRASES (explicit navigation)
 *   4. Fallback
 */
export function respond(rawInput) {
  const input = normalize(rawInput);
  if (!input.trim()) {
    return {
      text: "I didn't catch that — try asking about events, wellness, research, or just say 'join'.",
      actions: actionsFromKeys(['events', 'about', 'join']),
    };
  }

  for (const f of FAQ) {
    if (f.test.test(input)) {
      return { text: f.reply, actions: actionsFromKeys(f.actions) };
    }
  }

  const matches = matchInterests(input);
  if (matches.length === 1) {
    const m = matches[0];
    return {
      text: m.blurb,
      actions: actionsFromKeys([m.nudge]),
    };
  }
  if (matches.length > 1) {
    const top = matches.slice(0, 2);
    const text =
      "You've got a few things going — here's what fits:\n\n" +
      top.map((m) => `• ${m.blurb}`).join('\n\n');
    const keys = [...new Set(matches.slice(0, 3).map((m) => m.nudge))];
    return { text, actions: actionsFromKeys(keys) };
  }

  for (const p of NAV_PHRASES) {
    if (p.test.test(input)) {
      const dest = NAV[p.nav];
      return { text: `Taking you to ${dest.label}.`, nav: dest };
    }
  }

  return {
    text:
      "I'm not sure I've got a great answer for that one. I'm strongest on events, sections of the site, and nudges based on what you're into — try one of these:",
    actions: actionsFromKeys(['events', 'about', 'join']),
  };
}
