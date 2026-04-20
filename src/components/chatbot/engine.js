/**
 * Sol — MEDWELL's chatbot engine.
 *
 * Rule-based on purpose: the site ships to GitHub Pages with no backend,
 * so we match keywords client-side against curated responses instead of
 * piping through an LLM. That keeps it instant, free, and key-free, at
 * the cost of only knowing what's in this file.
 *
 * The tone goal here is "warm, specific, unhurried" — the responses are
 * composed from an opener + a body + a soft closing nudge, with small
 * variations so Sol doesn't feel like it's reading off a card.
 */

export const SOL_INTRO =
  "Hey — I'm Sol, MEDWELL's little sun guide. Tell me what's on your mind or what you're into, and I'll help you figure out where to land. No right way to start.";

export const STARTER_CHIPS = [
  { label: "I'm new here", payload: "i'm new here and not sure where to start" },
  { label: 'What events fit me?', payload: 'what events fit me' },
  { label: 'How do I join?', payload: 'how do i join' },
  { label: 'Meet the collective', payload: 'meet the collective' },
];

// Central destination table.
const NAV = {
  about: { label: 'About', to: '/#about' },
  anatomy: { label: 'The Anatomy', to: '/#anatomy' },
  events: { label: 'Events', to: '/events' },
  news: { label: 'News', to: '/news' },
  join: { label: 'Join MEDWELL', to: 'https://linktr.ee/medwellucsd', external: true },
  contact: { label: 'Email the board', to: 'medwell@ucsd.edu', external: true, raw: 'mailto:medwell@ucsd.edu' },
  instagram: { label: 'Instagram', to: 'https://www.instagram.com/medwell.at.ucsd/', external: true },
  home: { label: 'Home', to: '/' },
};

// Fix — contact.to was mailto; normalize external handling in Sol.jsx.
NAV.contact.to = 'mailto:medwell@ucsd.edu';

/**
 * Interest buckets, each with a small set of opener + outro phrasings
 * so repeat queries about the same topic don't echo each other back
 * word-for-word. `nudge` resolves to a NAV key.
 */
const INTERESTS = [
  {
    id: 'research',
    match: ['research', ' lab ', 'labs', 'bench', 'publication', 'paper', 'principal investigator', ' pi ', 'thesis', 'undergrad research'],
    openers: [
      "Research energy — love that.",
      "Lab-curious, okay.",
      "For the research-leaning folks:",
    ],
    body:
      "We run Research Rounds where members pitch what they're actually working on — small, unpolished, real. Mentors in the collective have posted lab openings there more than once too.",
    outros: [
      "Want me to open Events so you can see what's on the roster?",
      "I can pull up Events if you want to scan the next one.",
    ],
    nudge: 'events',
  },
  {
    id: 'clinical',
    match: ['clinical', 'shadow', 'shadowing', 'hospital', 'doctor', 'patient', 'volunteer', 'scribe', 'clinic', 'ucsd health'],
    openers: [
      "Clinical exposure — good instinct this early in the game.",
      "Okay, the patient-facing path.",
    ],
    body:
      "Shadowing nights, scribe intros, and physician Q&As rotate in roughly monthly. The live calendar is the fastest way to catch one before it fills up — they fill fast.",
    outros: [
      "Want me to open Events for you?",
      "Say the word and I'll pull up the calendar.",
    ],
    nudge: 'events',
  },
  {
    id: 'wellness',
    match: ['wellness', 'mental', 'mental health', 'burnout', 'balance', 'stress', 'self care', 'self-care', 'mindful', 'meditation', 'sleep', 'therapy', 'anxiety', 'overwhelm', 'overwhelmed', 'tired', 'exhausted', 'burnt out', 'panic'],
    openers: [
      "Hey — wellness first, genuinely.",
      "I'm glad you brought it up.",
      "This is the part nobody talks about enough.",
    ],
    body:
      "MEDWELL exists because \"pre-med grind\" culture will eat you alive if you let it. The Anatomy section shows how the collective weaves mental-health support, community, and academic structure into one connected thing rather than three afterthoughts.",
    outros: [
      "I can take you there, or keep going — your call.",
      "Want me to open The Anatomy, or would you rather chat more first?",
    ],
    nudge: 'anatomy',
  },
  {
    id: 'community',
    match: ['community', 'friends', 'social', 'mentor', 'peer', 'belong', 'connect', 'meet people', 'find people', 'lonely', 'alone', 'isolated'],
    openers: [
      "That's the whole point, honestly.",
      "Community is what holds the rest of it together.",
    ],
    body:
      "Monthly socials, mentor pods, and small-group study nights are where the collective actually feels like a collective. Show up to one and you'll know a few people by the end of it.",
    outros: [
      "Want me to open About, or jump to upcoming events?",
      "I can walk you into either the About page or the event list — which feels better first?",
    ],
    nudge: 'about',
  },
  {
    id: 'mcat',
    match: ['mcat', 'test prep', 'cars', 'bio bio', 'kaplan', 'aamc', 'practice exam'],
    openers: [
      "MCAT season. Deep breath.",
      "Okay — the MCAT doesn't have to be a solo grind.",
    ],
    body:
      "We don't run a prep course — what we do is guided study blocks and CARS-style discussion sessions. Think study family, not curriculum.",
    outros: [
      "Want me to surface upcoming sessions?",
    ],
    nudge: 'events',
  },
  {
    id: 'apps',
    match: ['amcas', 'aacomas', 'personal statement', 'admissions', 'secondaries', 'med school app', 'medical school application', 'applying to med'],
    openers: [
      "App cycle is its own beast.",
      "Application-year energy — got you.",
    ],
    body:
      "Our Senior Circle runs personal-statement workshops, mock interviews, and round-table debriefs each cycle. Everyone on the other side remembers exactly how scary this phase felt — they want to make yours easier.",
    outros: [
      "Open Events so you can see what's next?",
    ],
    nudge: 'events',
  },
  {
    id: 'career',
    match: ['specialty', 'specialties', 'osteopath', 'physician assistant', 'nursing', 'public health', 'dental school', 'pharmacy school', 'career path', 'which path', 'what path', 'what specialty', 'md vs do'],
    openers: [
      "Figuring out which path fits is half the stress, not a sign something's wrong.",
      "Okay, the big 'what am I actually doing' question.",
    ],
    body:
      "Specialty panels rotate through MD, DO, PA, and public-health tracks. You hear from people who chose each and why they'd do it again (or differently).",
    outros: [
      "Want me to open Events?",
    ],
    nudge: 'events',
  },
  {
    id: 'leadership',
    match: ['leadership position', 'officer', 'committee', 'run for', 'get involved deeper', 'step up', 'join the board'],
    openers: [
      "Wanting to step up — respect.",
      "Okay, getting involved deeper.",
    ],
    body:
      "Officer and committee seats open every spring. Best way in is consistency — show up to enough things that the current board already knows your name before apps go out. A direct email works too.",
    outros: [
      "I can open an email to the board for you.",
    ],
    nudge: 'contact',
  },
];

// Stress / empathy cues. When one of these fires, Sol prepends a short
// empathic line BEFORE the regular response. This handles "i'm stressed"
// type messages even when paired with another interest.
const STRESS_CUES = [
  'overwhelm', 'overwhelmed', 'stressed', 'burnout', 'burnt out', 'anxious',
  'panic', 'crashing', 'struggling', "can't handle", 'falling behind',
  'failing', 'depressed', 'hopeless', 'exhausted',
];

const EMPATHY_LINES = [
  "That's a lot — I hear you. The pre-med path doesn't make room for any of this by default, which is exactly why MEDWELL exists.",
  "Okay, that sounds heavy. You're not being dramatic — this path breaks a lot of people. Let's figure out a next step together.",
  "Hey. Real talk: if it feels like too much right now, that's information, not failure. Here's what I'd look at:",
];

// Direct-navigation regexes — only fire when nothing else (FAQ, interest,
// empathy cue) landed. Phrasing like "take me to events" reaches here.
const NAV_PHRASES = [
  { test: /\babout\b|who (are|is) (you|medwell)|what is medwell|your mission|what do (you|y'?all) do/, nav: 'about' },
  { test: /\banatomy\b|pillars?|structure|framework/, nav: 'anatomy' },
  { test: /\bevents?\b|calendar|upcoming|happening|what'?s on/, nav: 'events' },
  { test: /\bnews\b|announcements?|articles?|updates?/, nav: 'news' },
  { test: /\bjoin\b|sign.?up|become (a )?member|how do i get in/, nav: 'join' },
  { test: /\bcontact\b|email (me|us|the|you)?|reach (out|you)|get in touch/, nav: 'contact' },
  { test: /\binsta(gram)?\b/, nav: 'instagram' },
  { test: /^home$|take me home|go home|back home/, nav: 'home' },
];

// Friendly wrappers for navigation — varied so it doesn't feel canned.
const NAV_FLAVOR = {
  about: [
    "Pulling up About — that's the clearest read on what MEDWELL is and why it exists.",
    "Opening About for you. It's short, give it a minute.",
  ],
  anatomy: [
    "Heading to The Anatomy — this is the pillars breakdown.",
    "Opening The Anatomy — the four pillars live here.",
  ],
  events: [
    "Opening Events — the calendar's live and filterable by pillar.",
    "Heading to Events. Filter by pillar once you're there if something specific is on your mind.",
  ],
  news: [
    "Opening News.",
    "Heading to News — recent posts, recaps, and announcements live there.",
  ],
  join: [
    "Sending you to our Linktree — that's the front door. No fee, no dues.",
    "Opening the join page. Takes less than a minute.",
  ],
  contact: [
    "Drafting an email to the board for you.",
    "Opening your mail client so you can reach the board directly.",
  ],
  instagram: [
    "Opening the IG — follows usually go up there first before the site.",
  ],
  home: [
    "Heading home.",
  ],
};

// Short-form canned answers for direct questions.
const FAQ = [
  {
    test: /new here|new to medwell|first time|just found|get started|start here|don'?t know where|where (do|should) i start/,
    replyFn: () => ({
      text:
        "Welcome — happy you found us. Here's my honest fast-start: read About for the why, skim Events for something that catches your eye, then drop yourself on the Linktree so we know you exist. Which sounds better first?",
      keys: ['about', 'events', 'join'],
    }),
  },
  {
    test: /what events fit|which events should|events for me|match.+interest|help me (pick|choose)/,
    replyFn: () => ({
      text:
        "Tell me two or three things you're actually into — wellness, clinical exposure, research, community, MCAT, med-school apps, specialty panels, whatever — and I'll match them to the pillars we run. The more you give me, the better I can steer.",
      keys: [],
    }),
  },
  {
    test: /how (do|can|would) (i|you|one) (join|get in|sign up|become (a )?member)|how to join/,
    replyFn: () => ({
      text:
        "Easier than most clubs — no application fee, no dues. The Linktree is the front door: drop your email there and you'll start seeing our stuff on your radar. Want me to open it?",
      keys: ['join', 'contact'],
    }),
  },
  {
    test: /who runs|leadership|president|officers?|\bboard\b/,
    replyFn: () => ({
      text:
        "Leadership rotates yearly — the current board is listed on the Linktree bio. Quickest way to actually reach them is medwell@ucsd.edu. They read it.",
      keys: ['contact', 'join'],
    }),
  },
  {
    test: /when .* meet|meeting time|schedule|gbm|general body/,
    replyFn: () => ({
      text:
        "General body meetings run roughly every other Wednesday evening on campus. The Events page has the live calendar — if you're unsure which GBM is next, that's where to look.",
      keys: ['events'],
    }),
  },
  {
    test: /(application|app)\s*fee|cost|price|dues|how much/,
    replyFn: () => ({
      text:
        "No fee, no dues, no weird hazing. We're student-affairs recognized, so everything runs on goodwill and a few UCSD grants.",
      keys: ['join'],
    }),
  },
  {
    test: /major|pre.?med only|biology only|bio major|cog sci|engineering major/,
    replyFn: () => ({
      text:
        "All majors — honestly. Pre-med is a path, not a major. Members come from cog sci, bioengineering, lit, music, poli-sci. The shared thing is the instinct that medicine should feel human.",
      keys: ['about'],
    }),
  },
  {
    test: /first year|freshman|sophomore|transfer|new (to )?(ucsd|campus|school)/,
    replyFn: () => ({
      text:
        "First- and second-years thrive here — no prior experience needed. Show up to one GBM, then drift toward whatever pillar actually speaks to you. Nobody's going to quiz you.",
      keys: ['events', 'about'],
    }),
  },
  {
    test: /meet the collective|who are (y'?all|you people)|members/,
    replyFn: () => ({
      text:
        "The collective is spread across class years and majors — held together by the belief that medicine should feel human, not transactional. The Anatomy section is the best map of how we're built.",
      keys: ['anatomy', 'about'],
    }),
  },
  {
    test: /\bhi\b|\bhello\b|\bhey\b|^yo\b|^sup\b|what'?s up/,
    replyFn: () => ({
      text: pickRandom([
        "Hey! Want a quick tour, or do you already have something specific in mind?",
        "Hi — want me to walk you through the site, or are you chasing something particular?",
        "Hey there. I can give you the quick tour or just answer whatever's on your mind.",
      ]),
      keys: ['about', 'events'],
    }),
  },
  {
    test: /\bthanks?\b|\bthank you\b|\bappreciate\b|\bty\b/,
    replyFn: () => ({
      text: pickRandom([
        "Anytime. Good luck out there.",
        "You got it. I'll be here if anything else comes up.",
        "Happy to help. Come back anytime.",
      ]),
      keys: [],
    }),
  },
  {
    test: /who (are|made) you|what are you|you a bot|are you (a )?human|your name|what'?s your name/,
    replyFn: () => ({
      text:
        "I'm Sol — MEDWELL's little sun guide. Definitely a bot (rule-based, nothing fancy), but I know the site well enough to point you in the right direction. The humans on the board are the ones you actually want for anything big.",
      keys: ['about', 'contact'],
    }),
  },
];

function pickRandom(arr) {
  if (!arr || arr.length === 0) return '';
  return arr[Math.floor(Math.random() * arr.length)];
}

function normalize(str) {
  return ' ' + str.toLowerCase().replace(/[^a-z0-9\s']/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
}

function matchInterests(text) {
  return INTERESTS.filter((intr) => intr.match.some((kw) => text.includes(kw)));
}

function hasStress(text) {
  return STRESS_CUES.some((kw) => text.includes(kw));
}

function actionsFromKeys(keys = []) {
  return keys.map((k) => ({ label: NAV[k].label, nav: NAV[k] }));
}

function composeInterestReply(matches, text) {
  const stressed = hasStress(text);
  const empathy = stressed ? pickRandom(EMPATHY_LINES) + '\n\n' : '';

  if (matches.length === 1) {
    const m = matches[0];
    const body = `${pickRandom(m.openers)} ${m.body}`;
    const outro = pickRandom(m.outros);
    return {
      text: empathy + body + (outro ? '\n\n' + outro : ''),
      actions: actionsFromKeys([m.nudge]),
    };
  }

  // Multiple matches — reflect the combo back, give one stitched paragraph.
  const labels = matches.slice(0, 3).map((m) => m.id).join(' + ');
  const intro = `Okay — ${labels} is a real combo. Here's what jumps out:`;
  const parts = matches.slice(0, 2).map((m) => `• ${m.body}`);
  const keys = [...new Set(matches.slice(0, 3).map((m) => m.nudge))];
  const outro =
    "Want me to take you to one of these, or say more about what you're looking for?";
  return {
    text: empathy + intro + '\n\n' + parts.join('\n\n') + '\n\n' + outro,
    actions: actionsFromKeys(keys),
  };
}

/**
 * Main entry. Returns one of:
 *   { text, nav }             — Sol is navigating (and showing a line)
 *   { text, actions: [...] }  — Sol is suggesting next steps
 *
 * Order of checks:
 *   1. FAQ            (canned answers for specific direct questions)
 *   2. Interests      (topical advice — empathy cues get prepended)
 *   3. NAV_PHRASES    (explicit navigation like "take me to events")
 *   4. Fallback
 */
export function respond(rawInput) {
  const input = normalize(rawInput);
  if (!input.trim()) {
    return {
      text: "I didn't quite catch that — try asking about events, wellness, research, or just say 'join'.",
      actions: actionsFromKeys(['events', 'about', 'join']),
    };
  }

  for (const f of FAQ) {
    if (f.test.test(input)) {
      const r = f.replyFn();
      return { text: r.text, actions: actionsFromKeys(r.keys) };
    }
  }

  const matches = matchInterests(input);
  if (matches.length > 0) {
    return composeInterestReply(matches, input);
  }

  // Pure empathy message with no topical match → wellness default
  if (hasStress(input)) {
    const wellness = INTERESTS.find((i) => i.id === 'wellness');
    return composeInterestReply([wellness], input);
  }

  for (const p of NAV_PHRASES) {
    if (p.test.test(input)) {
      const dest = NAV[p.nav];
      const line = pickRandom(NAV_FLAVOR[p.nav]);
      return { text: line, nav: dest };
    }
  }

  return {
    text:
      "Hmm, I don't have a clean answer for that one — I'm strongest on events, sections of the site, and nudges based on what you're into. Want to try one of these?",
    actions: actionsFromKeys(['events', 'about', 'join']),
  };
}
