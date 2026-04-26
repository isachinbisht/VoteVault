import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SocialCard from '../components/MisinfoLab/SocialCard';
import type { MisinfoCard } from '../components/MisinfoLab/SocialCard';
import RedFlagOverlay from '../components/MisinfoLab/RedFlagOverlay';
import MisinfoScoreboard from '../components/MisinfoLab/MisinfoScoreboard';

// 5 levels × 3 cards = 15 cards total
const ALL_CARDS: MisinfoCard[] = [
  // ── LEVEL 1: OBVIOUS FAKE ──
  {
    id: 1,
    platform: 'facebook',
    username: 'BreakingIndiaNow',
    handle: '@breakingnow999',
    avatar: '📰',
    timeAgo: '2 hours ago',
    content:
      'BREAKING: EVM machines have been found to be PRE-PROGRAMMED to vote for BJP!! SHARE BEFORE IT\'S DELETED!! 1000s of votes being stolen RIGHT NOW!! Proof inside → bit.ly/evmhack2026 ⚠️⚠️⚠️',
    likes: '47.2K',
    comments: '12.3K',
    shares: '89.4K',
    isMisinfo: true,
    redFlags: [
      'No credible source cited — only a suspicious short link',
      'Emotional manipulation: "SHARE BEFORE IT\'S DELETED"',
      'Excessive use of ALL-CAPS and warning emojis',
      'Vague claim with no specific evidence or data',
      'Urgency tactics designed to bypass critical thinking',
    ],
    trustScore: 5,
    verdict: '🚨 DANGEROUS MISINFORMATION',
    explanation:
      'This post uses classic misinformation tactics: urgency, emotional triggers, and anonymous sources. EVMs in India go through multiple rounds of independent testing by engineers from different parties before every election.',
  },
  {
    id: 2,
    platform: 'whatsapp',
    username: 'Patriot Warriors Group',
    handle: 'Forwarded 2000+ times',
    avatar: '🇮🇳',
    timeAgo: '5 hours ago',
    content:
      'URGENT ALERT!! Government is planning to cancel elections in 3 states!! Opposition leaders arrested in secret!! Send to all your contacts immediately or India will become a dictatorship tonight!!',
    likes: '-',
    comments: '-',
    shares: '2000+ forwards',
    isMisinfo: true,
    redFlags: [
      '"Forwarded many times" — viral WhatsApp content has no editorial oversight',
      'No named sources, dates, or official statements',
      'Extreme catastrophizing language ("dictatorship tonight")',
      'Call to action designed to maximize spread',
      'No credible news outlet has reported any such event',
    ],
    trustScore: 3,
    verdict: '🚨 FABRICATED CONTENT',
    explanation:
      'WhatsApp forwards are a major source of political misinformation in India. This message contains zero verifiable facts and uses fear to go viral. Always check with at least two credible news sources.',
  },
  {
    id: 3,
    platform: 'twitter',
    username: 'Election Commission of India',
    handle: '@ECISVEEP',
    avatar: '🏛️',
    timeAgo: '1 hour ago',
    content:
      'Important Notice: Voting hours for the 2026 General Election have been extended by 2 hours in all constituencies. Polls will now close at 8 PM instead of 6 PM. Official gazette notification link: eci.gov.in/notices',
    likes: '18.4K',
    comments: '2.1K',
    shares: '9.3K',
    isMisinfo: false,
    redFlags: [],
    trustScore: 95,
    verdict: '✅ CREDIBLE — OFFICIAL SOURCE',
    explanation:
      'This is from a verified government account (@ECISVEEP is the official ECI handle) with a direct link to the official ECI website. Official notifications are always posted on eci.gov.in. This is a legitimate notice.',
  },

  // ── LEVEL 2: MISLEADING HEADLINES ──
  {
    id: 4,
    platform: 'facebook',
    username: 'IndiaNewsToday',
    handle: '@indianewstoday',
    avatar: '📺',
    timeAgo: '3 hours ago',
    content:
      'Rahul Gandhi "admits defeat" in press conference! Congress leader says "we accept whatever results come" hours before counting begins. Is this an admission they know they\'ve lost? Watch the clip →',
    likes: '31.2K',
    comments: '8.9K',
    shares: '22.1K',
    isMisinfo: true,
    redFlags: [
      'Deliberately misleading headline — "accepts results" ≠ "admits defeat"',
      'Selective quote taken out of context',
      'Rhetorical question added to plant a false conclusion',
      'No link to full unedited press conference',
      'Anonymous page with no editorial credentials',
    ],
    trustScore: 22,
    verdict: '⚠️ MISLEADING — OUT OF CONTEXT',
    explanation:
      'Accepting election results is standard democratic practice. The quote "we accept whatever results come" is a normal democratic statement, not an admission of defeat. This post deliberately frames it to mislead.',
  },
  {
    id: 5,
    platform: 'twitter',
    username: 'Priya Sharma',
    handle: '@priyareports',
    avatar: '👩',
    timeAgo: '6 hours ago',
    content:
      'Just interviewed 50 voters outside a polling booth in Delhi. Every single one said they faced issues with their name on the voter list. This is SYSTEMIC disenfranchisement. Thread → [1/8]',
    likes: '4.2K',
    comments: '1.8K',
    shares: '6.1K',
    isMisinfo: true,
    redFlags: [
      '"Every single one" is statistically implausible — likely sample bias',
      'Sample size of 50 cannot represent millions of voters',
      'No independent verification or corroborating reports',
      'Uses emotionally charged term "SYSTEMIC" without evidence',
      'Single-person anecdote presented as systemic fact',
    ],
    trustScore: 28,
    verdict: '⚠️ UNVERIFIED ANECDOTE — Misleading',
    explanation:
      'Voter list issues do occur occasionally, but a sample of 50 outside one booth cannot represent the entire election. This type of anecdotal reporting, without official data, often goes viral but lacks statistical validity.',
  },
  {
    id: 6,
    platform: 'twitter',
    username: 'PIB Fact Check',
    handle: '@PIBFactCheck',
    avatar: '✅',
    timeAgo: '2 hours ago',
    content:
      'FACT CHECK: A viral claim suggests that EVMs can be hacked via Bluetooth. This is FALSE. ✅ EVMs are standalone devices with no wireless connectivity. ✅ They are tested by all political parties before use. ✅ Source: ECI technical documentation. Full report: pib.gov.in/factcheck',
    likes: '22.1K',
    comments: '3.4K',
    shares: '15.7K',
    isMisinfo: false,
    redFlags: [],
    trustScore: 97,
    verdict: '✅ VERIFIED — Government Fact Check',
    explanation:
      'PIB (Press Information Bureau) Fact Check is an official Government of India initiative to combat misinformation. This post provides specific technical facts with citations, which is the hallmark of credible information.',
  },

  // ── LEVEL 3: PARTIALLY TRUE ──
  {
    id: 7,
    platform: 'facebook',
    username: 'Democracy Watch India',
    handle: '@democracywatch',
    avatar: '👁️',
    timeAgo: '8 hours ago',
    content:
      'EXPOSED: The ruling party spent ₹50,000 crore on ads during election season while opposition parties spent only ₹200 crore. This PROVES elections are being BOUGHT. Share the truth!',
    likes: '28.9K',
    comments: '7.2K',
    shares: '19.4K',
    isMisinfo: true,
    redFlags: [
      'Spending disparity is a real issue, but "proves" is a logical leap',
      'No source for the specific figures cited',
      'Government parties often have larger budgets — not proof of vote buying',
      'Conflates legal election spending with illegal vote buying',
      'Designed to outrage rather than inform',
    ],
    trustScore: 35,
    verdict: '⚠️ PARTIALLY TRUE — Misleading Conclusion',
    explanation:
      'Disparities in campaign spending are real and a legitimate concern. However, claiming it "proves" elections are "bought" is false. Legal campaign advertising is not the same as vote-buying, which is a criminal offense.',
  },
  {
    id: 8,
    platform: 'whatsapp',
    username: 'Sachcha Bharat Group',
    handle: 'Forwarded 500+ times',
    avatar: '📱',
    timeAgo: '12 hours ago',
    content:
      'IMPORTANT: The Supreme Court has struck down the current election law and ordered fresh elections immediately!! This is the END of the Modi government!! It\'s true, check news!!',
    likes: '-',
    comments: '-',
    shares: '500+ forwards',
    isMisinfo: true,
    redFlags: [
      'No case number, bench name, or SC order reference',
      'Major SC rulings are covered by ALL major news outlets simultaneously',
      'If this were true, it would be top story on every channel',
      '"Check news" without a specific link is a red flag',
      'Urgency and political language used to maximize forwards',
    ],
    trustScore: 8,
    verdict: '🚨 FABRICATED LEGAL CLAIM',
    explanation:
      'Supreme Court orders are public documents with case numbers, easily verifiable on sci.gov.in. If the Supreme Court had actually made such a ruling, it would be the top news story everywhere. Always check official sources.',
  },
  {
    id: 9,
    platform: 'twitter',
    username: 'Scroll.in',
    handle: '@scroll_in',
    avatar: '📄',
    timeAgo: '4 hours ago',
    content:
      'Analysis: Voter turnout in the 2026 election is 5% lower than 2024 in three northern states. Experts say multiple factors including extreme heat and migration patterns may explain the dip. Full analysis with data at scroll.in/elections2026',
    likes: '6.3K',
    comments: '1.2K',
    shares: '4.8K',
    isMisinfo: false,
    redFlags: [],
    trustScore: 88,
    verdict: '✅ CREDIBLE — Data-backed Journalism',
    explanation:
      'Scroll.in is a well-established digital news outlet. This post uses measured language ("may explain"), acknowledges multiple factors, cites specific data, and provides a link to a full analysis. These are signs of responsible journalism.',
  },

  // ── LEVEL 4: DEEPFAKES & VISUAL ──
  {
    id: 10,
    platform: 'facebook',
    username: 'Truth Seeker 2026',
    handle: '@truthseeker2026',
    avatar: '🎥',
    timeAgo: '1 hour ago',
    content:
      'LEAKED VIDEO: Modi seen accepting a suitcase of cash from a BJP businessman in a private meeting!! This is the PROOF we\'ve been waiting for!! Video shared by a whistleblower. Share NOW before it\'s taken down!! 🎬💰',
    likes: '91.2K',
    comments: '34.5K',
    shares: '1.2M',
    isMisinfo: true,
    redFlags: [
      'Anonymous "whistleblower" with no verifiable identity',
      '"Share before it\'s taken down" is a classic viral manipulation tactic',
      'Extraordinarily high share count for unverified content',
      'No established media outlet has covered this "leak"',
      'Video content can be fabricated or taken out of context',
      'Page has no credible journalistic history',
    ],
    trustScore: 4,
    verdict: '🚨 LIKELY DEEPFAKE / FABRICATED',
    explanation:
      'Videos shared this way are often manipulated, AI-generated, or completely out of context. If a real video of a PM accepting cash existed, every major newspaper would run it. Always look for the same story on multiple verified outlets.',
  },
  {
    id: 11,
    platform: 'twitter',
    username: 'AAP Official',
    handle: '@AamAadmiParty',
    avatar: '🧹',
    timeAgo: '30 minutes ago',
    content:
      'Official Statement: Our party condemns the arrest of our workers in Uttar Pradesh. We are seeking an urgent meeting with the Chief Election Commissioner. Full statement: aap.org.in/statement-26apr. #FreeTheVoters',
    likes: '28.1K',
    comments: '5.4K',
    shares: '12.7K',
    isMisinfo: false,
    redFlags: [],
    trustScore: 91,
    verdict: '✅ CREDIBLE — Official Party Statement',
    explanation:
      'This comes from a verified party account with a specific link to an official party website. It makes a clear, verifiable claim (arrest) without sensationalizing, and provides a way to read the full statement. This is how political parties legitimately communicate.',
  },
  {
    id: 12,
    platform: 'whatsapp',
    username: 'Army Officer Group',
    handle: 'Forwarded 10000+ times',
    avatar: '🪖',
    timeAgo: '2 days ago',
    content:
      'URGENT: A retired Army General has confirmed that 40% of Rajya Sabha members are Chinese agents!! The list has been submitted to RAW!! This information comes from inside sources. Do not ignore. Share to patriots only.',
    likes: '-',
    comments: '-',
    shares: '10000+ forwards',
    isMisinfo: true,
    redFlags: [
      '"Retired Army General" — no name, no credentials given',
      'Extraordinary claim with zero verifiable evidence',
      '"Inside sources" is not a citation',
      'Appeals to patriotism to suppress critical thinking',
      'Rajya Sabha members are publicly elected/nominated — easily verifiable',
      'RAW does not publicly share intelligence lists',
    ],
    trustScore: 2,
    verdict: '🚨 FABRICATED NATIONAL SECURITY CLAIM',
    explanation:
      'This is a classic "forwarded message" targeting national security anxieties. If 40% of Rajya Sabha members were Chinese agents, it would be the biggest national scandal in history, covered by every outlet worldwide. This is pure disinformation.',
  },

  // ── LEVEL 5: MASTER ──
  {
    id: 13,
    platform: 'facebook',
    username: 'India Data Institute',
    handle: '@indiadatainstitute',
    avatar: '📊',
    timeAgo: '5 hours ago',
    content:
      'Our latest survey shows 73% of voters believe EVMs cannot be trusted. This data, collected from 500 respondents in Delhi, shows a crisis of confidence in Indian democracy. Source: "Public Perception Report 2026, IDA."',
    likes: '14.2K',
    comments: '4.1K',
    shares: '9.8K',
    isMisinfo: true,
    redFlags: [
      '"India Data Institute" is not a recognized official body — verify the organization',
      '500 Delhi respondents cannot represent 970 million Indian voters',
      'Measures "belief", not actual EVM integrity — these are different things',
      '"Public Perception Report 2026" has not been published in any peer-reviewed outlet',
      'Page promotes a consistent anti-EVM narrative',
    ],
    trustScore: 31,
    verdict: '⚠️ MISLEADING PSEUDO-RESEARCH',
    explanation:
      'This appears credible because it cites a "survey" and uses percentages. However, the organization is unverified, the sample is far too small and geographically limited, and conflating public perception with technical reality is misleading.',
  },
  {
    id: 14,
    platform: 'twitter',
    username: 'The Wire India',
    handle: '@thewire_in',
    avatar: '🔌',
    timeAgo: '3 hours ago',
    content:
      'Investigation: We analyzed campaign finance disclosures and found ₹3,200 crore in "unknown" donations to political parties in 2025-26 via electoral bonds. These donations are legal but anonymous by design. Details: thewire.in/investigations',
    likes: '24.3K',
    comments: '6.7K',
    shares: '18.1K',
    isMisinfo: false,
    redFlags: [],
    trustScore: 84,
    verdict: '✅ CREDIBLE — Investigative Journalism',
    explanation:
      'The Wire is a well-known Indian independent media outlet. This report is based on public disclosures (verifiable), uses precise figures, acknowledges legal complexity, and links to a full investigation. Critical reporting on legal issues is not misinformation.',
  },
  {
    id: 15,
    platform: 'whatsapp',
    username: 'Civic Education Cell',
    handle: 'Government of India',
    avatar: '🏛️',
    timeAgo: '1 day ago',
    content:
      'REMINDER from Ministry of Home Affairs: Section 144 has been imposed in ALL states on election day. If you leave your house to vote, you may be arrested. Please stay home and use the online voting portal at gov-vote-online.in to cast your vote.',
    likes: '-',
    comments: '-',
    shares: '50000+ forwards',
    isMisinfo: true,
    redFlags: [
      'There is NO online voting portal in India — this is completely fabricated',
      'Section 144 is never imposed nationwide on election day — it enables voting, not prevents it',
      'Government of India does not communicate policy via WhatsApp forwards',
      'gov-vote-online.in is a FAKE domain — official sites end in .gov.in',
      'Designed to suppress voter turnout — a form of electoral interference',
    ],
    trustScore: 1,
    verdict: '🚨 VOTER SUPPRESSION DISINFORMATION',
    explanation:
      'This is one of the most dangerous types of election misinformation — it directly tries to stop people from voting by spreading false legal threats. India has no online voting. Official government sites always end in .gov.in. Report such messages to 1800-111-950.',
  },
];

// Group into levels of 3
const LEVELS = [
  { num: 1, label: 'Level 1: Obvious Fakes', difficulty: 'Easy', color: '#22c55e', cards: ALL_CARDS.slice(0, 3) },
  { num: 2, label: 'Level 2: Misleading Headlines', difficulty: 'Medium', color: '#eab308', cards: ALL_CARDS.slice(3, 6) },
  { num: 3, label: 'Level 3: Partially True', difficulty: 'Hard', color: '#f97316', cards: ALL_CARDS.slice(6, 9) },
  { num: 4, label: 'Level 4: Deepfakes & Visual', difficulty: 'Expert', color: '#ef4444', cards: ALL_CARDS.slice(9, 12) },
  { num: 5, label: 'Level 5: Master', difficulty: 'Master', color: '#a855f7', cards: ALL_CARDS.slice(12, 15) },
];

export default function MisinfoLab() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [scannedCards, setScannedCards] = useState<Set<number>>(new Set());
  const [userJudgments, setUserJudgments] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  const level = LEVELS[currentLevel];
  const currentCard = level?.cards[currentCardIdx];
  const isScanned = currentCard ? scannedCards.has(currentCard.id) : false;
  const userJudgment = currentCard ? userJudgments[currentCard.id] : undefined;

  const handleScan = () => {
    if (!currentCard) return;
    setScannedCards((prev) => new Set([...prev, currentCard.id]));
  };

  const handleJudge = (isMisinfo: boolean) => {
    if (!currentCard) return;
    setUserJudgments((prev) => ({ ...prev, [currentCard.id]: isMisinfo }));
    if (isMisinfo === currentCard.isMisinfo) {
      setScore((s) => s + 10);
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (currentCardIdx < level.cards.length - 1) {
      setCurrentCardIdx((i) => i + 1);
    } else if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel((l) => l + 1);
      setCurrentCardIdx(0);
    } else {
      setGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentLevel(0);
    setCurrentCardIdx(0);
    setScannedCards(new Set());
    setUserJudgments({});
    setScore(0);
    setCorrectCount(0);
    setShowIntro(true);
    setGameOver(false);
  };

  const isLastCard = currentLevel === LEVELS.length - 1 && currentCardIdx === level.cards.length - 1;

  // ── INTRO SCREEN ──
  if (showIntro) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="container mx-auto px-6 py-12 max-w-2xl">
          <div className="flex items-center gap-3 mb-8">
            <Link to="/" className="text-slate-500 hover:text-slate-800 text-sm transition-colors">
              ← Back to Home
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-500/20 border border-red-500/30 text-4xl mb-4">
              🔬
            </div>
            <p className="text-red-500 text-xs font-semibold tracking-widest uppercase mb-2">Module 4</p>
            <h1 className="text-4xl font-black tracking-tight mb-3 text-slate-900">Misinformation Lab</h1>
            <p className="text-slate-600 text-base max-w-md mx-auto">
              Can you tell real news from fake? Scan social media posts and detect red flags before
              misinformation spreads.
            </p>
          </motion.div>

          {/* Level preview */}
          <div className="space-y-3 mb-8">
            {LEVELS.map((lvl) => (
              <div
                key={lvl.num}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                  style={{ background: lvl.color }}
                >
                  {lvl.num}
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 text-sm font-semibold">{lvl.label}</p>
                </div>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ color: lvl.color, background: lvl.color + '20', border: `1px solid ${lvl.color}40` }}
                >
                  {lvl.difficulty}
                </span>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowIntro(false)}
            className="w-full py-4 rounded-2xl font-black text-base text-white shadow-md"
            style={{
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              boxShadow: '0 12px 40px rgba(239,68,68,0.4)',
            }}
          >
            🔬 Start Detecting →
          </motion.button>
        </div>
      </div>
    );
  }

  // ── GAME OVER SCREEN ──
  if (gameOver) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="container mx-auto px-6 py-10 max-w-2xl">
          <MisinfoScoreboard
            score={score}
            totalCards={15}
            correctCards={correctCount}
            level={5}
            onPlayAgain={handleRestart}
          />
        </div>
      </div>
    );
  }

  // ── GAME SCREEN ──
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Level indicator */}
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white"
                style={{ background: level.color }}
              >
                {level.num}
              </div>
              <div>
                <p className="text-slate-900 text-xs font-bold">{level.label}</p>
                <p className="text-slate-500 text-[10px]">
                  Card {currentCardIdx + 1} of {level.cards.length}
                </p>
              </div>
            </div>

            {/* Score + Progress */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-slate-900 font-black text-lg leading-none">{score}</p>
                <p className="text-slate-500 text-[10px]">points</p>
              </div>
              <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentLevel * 3 + currentCardIdx) / 15) * 100}%`,
                    background: level.color,
                  }}
                />
              </div>
              <span className="text-slate-500 text-xs">{currentLevel * 3 + currentCardIdx}/15</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-2xl space-y-5">
        {/* Instruction */}
        {!isScanned && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-2"
          >
            <p className="text-slate-600 text-sm">
              Read the post carefully, then{' '}
              <span className="text-red-500 font-semibold">click "Scan for Red Flags"</span>
            </p>
          </motion.div>
        )}

        {/* Social card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard?.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
          >
            {currentCard && (
              <SocialCard
                card={currentCard}
                onScan={handleScan}
                scanned={isScanned}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Red flag overlay */}
        {currentCard && (
          <RedFlagOverlay
            card={currentCard}
            visible={isScanned}
            userAnsweredMisinfo={userJudgment !== undefined ? userJudgment : null}
            onJudge={handleJudge}
            onNext={handleNext}
            isLastCard={isLastCard}
          />
        )}
      </div>
    </div>
  );
}
