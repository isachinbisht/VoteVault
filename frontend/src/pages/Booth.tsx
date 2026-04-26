import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import { setStep, resetBooth } from '../store/boothSlice';
import { fetchElections, fetchCandidates, setSelectedElection } from '../store/policySlice';
import BoothScene from '../components/Booth/BoothScene';
import html2canvas from 'html2canvas';


export default function Booth() {
  const dispatch = useDispatch<AppDispatch>();
  const { elections, candidates, selectedElection } = useSelector((s: RootState) => s.policy);
  const { currentStep } = useSelector((s: RootState) => s.booth);
  const { user } = useSelector((s: RootState) => s.user);

  const [confidence, setConfidence] = useState(50);
  const [confidenceAfter, setConfidenceAfter] = useState(75);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [voteCast, setVoteCast] = useState(false);
  const [vvpatVisible, setVvpatVisible] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    try {
      const canvas = await html2canvas(certificateRef.current, { scale: 2 });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `VoteVault_Certificate_${user?.display_name || 'Simulation'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download certificate', err);
    }
  };

  useEffect(() => { dispatch(fetchElections()); }, [dispatch]);
  useEffect(() => {
    if (selectedElection) dispatch(fetchCandidates(selectedElection.id));
  }, [dispatch, selectedElection]);

  const handleElectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const el = elections.find(x => x.id === e.target.value);
    dispatch(setSelectedElection(el || null));
    setShowResults(false);
  };

  const handleVote = () => {
    if (!selectedCandidateId) return;
    setVoteCast(true);
    setTimeout(() => { setVvpatVisible(true); }, 800);
    setTimeout(() => { setVvpatVisible(false); dispatch(setStep('complete')); }, 3500);
  };

  const votedCandidate = candidates.find(c => c.id === selectedCandidateId);
  const isPastElection = selectedElection?.year && selectedElection.year < 2026;
  const nonNotaCandidates = candidates.filter(c => c.name !== 'NOTA');
  const notaCandidate = candidates.find(c => c.name === 'NOTA');

  // ── CERTIFICATE ──
  if (showCertificate) {
    if (!user) {
      return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-8">
           <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white p-8 rounded-[2rem] border border-slate-200 text-center shadow-xl">
             <div className="text-4xl mb-4">🔒</div>
             <h2 className="text-2xl font-black mb-2 text-slate-900">Registration Required</h2>
             <p className="text-slate-500 text-sm mb-6">You must be logged in to claim your personalized voting certificate.</p>
             <div className="flex gap-3">
               <button onClick={() => setShowCertificate(false)} className="flex-1 py-3 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 text-slate-900 text-sm">Cancel</button>
               <Link to="/login" className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 text-sm">Login / Register</Link>
             </div>
           </motion.div>
        </div>
      );
    }

    const userName = user.display_name || user.email.split('@')[0];

    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 sm:p-8">
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }} className="max-w-4xl w-full">
          <div ref={certificateRef} className="print-certificate relative p-12 sm:p-20 bg-[#fdfdf0] rounded-sm border-[3px] border-[#a855f7] text-center space-y-6 shadow-xl print:shadow-none overflow-hidden min-h-[500px] flex flex-col justify-center items-center">
            
            <div className="w-12 h-12 mb-2 text-[#166534]">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-[#166534] tracking-widest">CERTIFICATE OF VOTING SIMULATION</h1>
            <p className="text-sm font-bold text-slate-600 tracking-[0.2em] uppercase mt-4">THIS CERTIFICATE GOES TO</p>
            
            <div className="w-3/4 max-w-xl mx-auto py-8">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-800">{userName}</h2>
            </div>
            
            <p className="text-sm text-slate-500 tracking-wide">in appreciation of your awarness for voting</p>

            <div className="w-full flex justify-between px-4 sm:px-16 mt-16 pb-4">
              <div className="text-center w-32 sm:w-48">
                <div className="border-b-2 border-slate-700 pb-1 mb-2"></div>
                <p className="text-[#166534] font-bold text-sm">Vote Vault</p>
                <p className="text-[10px] sm:text-xs text-slate-500 uppercase mt-1">POWERD BY</p>
              </div>
              <div className="text-center w-32 sm:w-48">
                <div className="border-b-2 border-slate-700 pb-1 mb-2"></div>
                <p className="text-[#166534] font-bold text-sm">Sachin Bisht</p>
                <p className="text-[10px] sm:text-xs text-slate-500 uppercase mt-1">PRODUCER</p>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 flex gap-3 print:hidden" data-html2canvas-ignore="true">
              <button onClick={()=>{dispatch(resetBooth());setShowCertificate(false);setSelectedCandidateId(null);setVoteCast(false);}} className="py-2 px-4 border border-slate-300 bg-white/50 rounded-lg font-bold hover:bg-white text-slate-900 text-xs transition-colors">Practice Again</button>
              <button onClick={handleDownload} className="py-2 px-4 bg-[#166534] text-white rounded-lg font-bold hover:bg-[#14532d] text-xs transition-colors shadow-md">⬇️ Download</button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 text-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0"><BoothScene currentStep={currentStep} onStationClick={()=>{}} /></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-white/70 via-transparent to-white/20 pointer-events-none" />

      <div className="relative z-10 flex-1 flex items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">

          {/* ── INTRO ── */}
          {currentStep === 'intro' && (
            <motion.div key="intro" initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:1.05}}
              className="p-8 bg-white/85 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 max-w-2xl w-full space-y-5 pointer-events-auto shadow-xl mx-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">🗳️</div>
                <div>
                  <h1 className="text-2xl font-black">The Booth — EVM Simulator</h1>
                  <p className="text-slate-500 text-sm">Practice with real Indian election data</p>
                </div>
              </div>

              {/* Election selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Select Election</label>
                <select className="w-full bg-slate-50 rounded-xl p-3.5 text-slate-900 outline-none border border-slate-200 focus:border-orange-500/50 transition-colors text-sm"
                  onChange={handleElectionChange} value={selectedElection?.id || ''}>
                  <option value="">Choose an election...</option>
                  {[...elections].sort((a,b)=>(b.year||0)-(a.year||0)).map(e=>(
                    <option key={e.id} value={e.id}>{e.name} {e.year && e.year < 2026 ? `— ${e.winning_party?.split('(')[0].trim().substring(0,15)} won ${e.winning_seats} seats` : '(Practice)'}</option>
                  ))}
                </select>
              </div>

              {/* Past election results panel */}
              {selectedElection && isPastElection && candidates.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden">
                  <button onClick={()=>setShowResults(v=>!v)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-100 transition-colors text-sm">
                    <span className="font-bold">📊 {showResults?'Hide':'Show'} Actual Results</span>
                    <span className="text-slate-500">{selectedElection.winning_pm}</span>
                  </button>
                  {showResults && (
                    <div className="px-4 pb-4 space-y-2">
                      <p className="text-slate-500 text-xs mb-2">{selectedElection.description}</p>
                      {nonNotaCandidates.map(c => {
                        const pct = selectedElection.total_seats ? ((c.seats_won||0)/selectedElection.total_seats)*100 : 0;
                        return (
                          <div key={c.id}>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="flex items-center gap-1.5 font-medium">
                                <span>{c.symbol_emoji}</span>
                                <span>{c.party.split('(')[0].trim().substring(0,25)}</span>
                                {c.alliance && <span className="px-1 py-0.5 rounded text-[9px]" style={{background:`${c.color_hex}25`,color:c.color_hex,border:`1px solid ${c.color_hex}40`}}>{c.alliance}</span>}
                              </span>
                              <span className="font-bold" style={{color:c.color_hex}}>{c.seats_won} seats · {c.vote_share}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <motion.div className="h-full rounded-full" style={{background:c.color_hex}}
                                initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.8,ease:'easeOut'}} />
                            </div>
                          </div>
                        );
                      })}
                      <p className="text-slate-500 text-[10px] pt-1">Total seats: {selectedElection.total_seats} · Simple majority: {Math.floor((selectedElection.total_seats||543)/2)+1}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Confidence slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Pre-voting confidence</span>
                  <span className="font-black text-orange-500">{confidence}%</span>
                </div>
                <input type="range" min={0} max={100} className="w-full accent-orange-500 cursor-pointer"
                  value={confidence} onChange={e=>setConfidence(parseInt(e.target.value))} />
              </div>

              <button onClick={()=>selectedElection && dispatch(setStep('id_check'))} disabled={!selectedElection}
                className="w-full py-3.5 bg-orange-500 text-white rounded-2xl font-black text-base hover:bg-orange-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20">
                {selectedElection ? 'Enter Polling Station →' : 'Select an election first'}
              </button>
            </motion.div>
          )}

          {/* ── ID CHECK ── */}
          {currentStep === 'id_check' && (
            <motion.div key="id" initial={{opacity:0,x:80}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-80}}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-6 bg-white/90 backdrop-blur-xl rounded-[2rem] border border-slate-200 max-w-xs w-full space-y-5 pointer-events-auto shadow-xl">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-blue-500 mb-1">Station 1 of 3</div>
                <h2 className="text-xl font-bold">Identity Verification</h2>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">A Presiding Officer checks your Voter ID (EPIC card). Your name is marked in the electoral roll. You receive a voter slip.</p>

              {/* Voter ID card mock */}
              <div className="relative p-4 bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl border border-blue-500/30 overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,white 0,white 1px,transparent 0,transparent 50%)',backgroundSize:'8px 8px'}} />
                <div className="flex items-start gap-3">
                  <div className="w-12 h-14 bg-blue-700 rounded-lg border border-blue-400/20 flex items-center justify-center text-xl">👤</div>
                  <div className="text-xs space-y-0.5">
                    <div className="font-bold text-white text-sm">VOTER IDENTIFICATION</div>
                    <div className="text-blue-300">भारत निर्वाचन आयोग</div>
                    <div className="text-blue-200 font-mono mt-1">EPIC: DL/04/042/XXXXXX</div>
                    <div className="text-blue-200">Name: <span className="text-white">Voter (Practice)</span></div>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-blue-500/20 text-[10px] text-blue-300 text-center">Election Commission of India</div>
              </div>

              <button onClick={()=>dispatch(setStep('evm'))}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors text-sm">
                ✓ Identity Verified — Proceed to EVM
              </button>
            </motion.div>
          )}

          {/* ── EVM ── */}
          {currentStep === 'evm' && (
            <motion.div key="evm" initial={{opacity:0,x:200}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-200}} transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="p-6 bg-white/95 backdrop-blur-2xl rounded-[2rem] border border-slate-200 max-w-md w-full space-y-4 pointer-events-auto shadow-xl mx-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-orange-500 mb-0.5">Station 2 of 3</div>
                  <h2 className="text-xl font-black text-slate-900">Electronic Voting Machine</h2>
                </div>
                <span className="px-2 py-1 bg-red-500/15 text-red-400 rounded-full text-[9px] font-black uppercase tracking-wide animate-pulse border border-red-500/20">SIMULATION</span>
              </div>
              {/* EVM Image */}
              <div className="w-full h-32 rounded-xl overflow-hidden mb-2 border border-slate-200 shadow-inner">
                <img src="/indian_evm_machine.png" alt="Indian EVM Machine" className="w-full h-full object-cover" />
              </div>

              {/* Physical EVM body */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-300 bg-slate-50 shadow-sm">
                {/* ECI header strip */}
                <div className="bg-gradient-to-r from-orange-500 via-white to-green-500 h-2" />
                <div className="px-4 py-2 border-b border-slate-300">
                  <p className="text-center text-xs text-slate-700 font-semibold tracking-wide">BHARAT NIRVACHAN AAYOG · भारत निर्वाचन आयोग</p>
                  <p className="text-center text-[9px] text-slate-500 mt-0.5">Constituency: DEMO-001 · {selectedElection?.name}</p>
                </div>

                {/* Candidate rows */}
                <div className="divide-y divide-slate-200">
                  {nonNotaCandidates.map((c, i) => {
                    const isSelected = selectedCandidateId === c.id;
                    return (
                      <motion.button key={c.id} onClick={()=>!voteCast && setSelectedCandidateId(c.id)} disabled={voteCast}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                        whileTap={!voteCast ? {scale:0.98}:{}}>
                        {/* Serial number */}
                        <span className="text-slate-500 text-xs w-4 font-mono">{i+1}.</span>
                        {/* Party symbol */}
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg shrink-0 border" style={{background:`${c.color_hex}20`,borderColor:`${c.color_hex}50`}}>
                          {c.symbol_emoji || c.name.charAt(0)}
                        </div>
                        {/* Name + party */}
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-slate-900 truncate">{c.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{c.party.split('(')[0].trim()}</div>
                        </div>
                        {/* EVM tactile button */}
                        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'border-blue-400 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'border-slate-300 bg-slate-200'}`}>
                          {isSelected && <motion.div initial={{scale:0}} animate={{scale:1}} className="w-3 h-3 rounded-full bg-white" />}
                        </div>
                      </motion.button>
                    );
                  })}

                  {/* NOTA row */}
                  {notaCandidate && (
                    <motion.button onClick={()=>!voteCast && setSelectedCandidateId(notaCandidate.id)} disabled={voteCast}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${selectedCandidateId===notaCandidate.id ? 'bg-slate-200/50' : 'hover:bg-slate-50'}`}
                      whileTap={!voteCast?{scale:0.98}:{}}>
                      <span className="text-slate-500 text-xs w-4 font-mono">{nonNotaCandidates.length+1}.</span>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg shrink-0 bg-slate-200 border border-slate-300">🚫</div>
                      <div className="flex-1"><div className="font-bold text-xs text-slate-700">NOTA — None of the Above</div></div>
                      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selectedCandidateId===notaCandidate.id ? 'border-slate-400 bg-slate-500' : 'border-slate-300 bg-slate-200'}`}>
                        {selectedCandidateId===notaCandidate.id && <motion.div initial={{scale:0}} animate={{scale:1}} className="w-3 h-3 rounded-full bg-white" />}
                      </div>
                    </motion.button>
                  )}
                </div>

                {/* CAST VOTE blue button */}
                <div className="p-4 border-t border-slate-300 flex justify-center">
                  <motion.button onClick={handleVote} disabled={!selectedCandidateId || voteCast}
                    whileTap={{scale:0.93}}
                    className="px-10 py-3 rounded-xl font-black text-white text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    style={{background: selectedCandidateId && !voteCast ? 'linear-gradient(135deg,#1e40af,#2563eb)' : '#1e3a5f', boxShadow: selectedCandidateId && !voteCast ? '0 6px 20px rgba(37,99,235,0.6), 0 3px 0 #1e3a8a' : 'none'}}>
                    {voteCast ? '✓ Vote Recorded' : '● VOTE'}
                  </motion.button>
                </div>

                {/* VVPAT slip animation */}
                <AnimatePresence>
                  {vvpatVisible && votedCandidate && (
                    <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
                      className="border-t border-slate-200 bg-amber-50 overflow-hidden">
                      <div className="p-3 text-center space-y-1">
                        <p className="text-amber-600 text-[10px] font-black uppercase tracking-widest">VVPAT — Voter Verified Paper Audit Trail</p>
                        <div className="inline-block bg-white text-black rounded px-4 py-2 font-mono text-xs shadow-md border border-slate-200">
                          <p className="font-black text-sm">{votedCandidate.symbol_emoji} {votedCandidate.name}</p>
                          <p className="text-gray-600">{votedCandidate.party.split('(')[0].trim()}</p>
                          <p className="text-gray-400 text-[9px] mt-1">Slip valid for 7 seconds · Not a receipt</p>
                        </div>
                        <p className="text-amber-600 text-[9px]">This slip confirms your vote was recorded. Keep it private.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ── COMPLETE ── */}
          {currentStep === 'complete' && (
            <motion.div key="done" initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}}
              className="p-8 bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 max-w-sm w-full text-center space-y-5 pointer-events-auto mx-4 shadow-xl">
              <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2,type:'spring',stiffness:200}} className="w-16 h-16 bg-green-100 rounded-2xl mx-auto flex items-center justify-center text-3xl">✅</motion.div>
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-green-600 mb-1">Station 3 — Complete!</div>
                <h2 className="text-2xl font-black text-slate-900">Voted Successfully!</h2>
                {votedCandidate && <p className="text-slate-600 text-sm mt-1">You practiced voting for <span className="text-slate-900 font-bold">{votedCandidate.symbol_emoji} {votedCandidate.name}</span></p>}
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 text-left border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">How confident do you feel now?</p>
                <div className="flex justify-between text-sm"><span className="text-slate-600">Post-simulation confidence</span><span className="font-black text-green-600">{confidenceAfter}%</span></div>
                <input type="range" min={0} max={100} className="w-full accent-green-500" value={confidenceAfter} onChange={e=>setConfidenceAfter(parseInt(e.target.value))} />
              </div>

              <div className="flex gap-3">
                <button onClick={()=>{dispatch(resetBooth());setSelectedCandidateId(null);setVoteCast(false);}}
                  className="flex-1 py-3 border border-slate-200 rounded-2xl font-bold hover:bg-slate-100 text-slate-900 text-sm">Restart</button>
                <button onClick={()=>setShowCertificate(true)}
                  className="flex-1 py-3 bg-yellow-400 text-slate-900 rounded-2xl font-bold hover:bg-yellow-500 text-sm">🏆 Get Certificate</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Step progress dots */}
      {currentStep !== 'intro' && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 pointer-events-none">
          {(['id_check','evm','complete'] as const).map((s,i)=>{
            const steps = ['id_check','evm','complete'];
            const cur = steps.indexOf(currentStep);
            return (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${i<cur?'bg-orange-500 border-orange-500 text-white':i===cur?'bg-orange-100 border-orange-500 text-orange-600':'bg-white border-slate-300 text-slate-400'}`}>
                  {i<cur?'✓':i+1}
                </div>
                {i<2 && <div className={`w-10 h-0.5 transition-colors ${i<cur?'bg-orange-500':'bg-slate-300'}`}/>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
