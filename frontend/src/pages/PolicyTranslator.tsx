import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { 
    fetchElections, 
    fetchCandidates, 
    toggleCandidateSelection, 
    setSelectedElection,
    fetchComparison,
    analyzeManifesto
} from '../store/policySlice';
import type { Candidate } from '../store/policySlice';
import CandidateSelector from '../components/PolicyTranslator/CandidateSelector';
import PolicyBentoGrid from '../components/PolicyTranslator/PolicyBentoGrid';
import { motion, AnimatePresence } from 'framer-motion';

export default function PolicyTranslator() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.user);
    const { 
        elections, 
        candidates, 
        selectedElection, 
        selectedCandidates, 
        analyzedPolicies, 
        comparisonSummary,
        isLoading 
    } = useSelector((state: RootState) => state.policy);
    
    const [view, setView] = useState<'selector' | 'grid'>('selector');
    const [activeManifestoId, setActiveManifestoId] = useState<string | null>(null);
    const [manifestoText, setManifestoText] = useState('');

    useEffect(() => {
        dispatch(fetchElections());
    }, [dispatch]);

    useEffect(() => {
        if (selectedElection) {
            dispatch(fetchCandidates(selectedElection.id));
        }
    }, [dispatch, selectedElection]);

    const handleToggleCandidate = (candidate: Candidate) => {
        dispatch(toggleCandidateSelection(candidate));
    };

    const handleElectionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const election = elections.find((el) => el.id === e.target.value);
        dispatch(setSelectedElection(election || null));
    };

    const handleCompare = () => {
        setView('grid');
        if (selectedCandidates.length >= 2) {
            dispatch(fetchComparison({ 
                candidateIds: selectedCandidates.map(c => c.id), 
                userId: user?.id 
            }));
        }
    };

    const handleAnalyzeManifesto = () => {
        if (activeManifestoId && manifestoText) {
            dispatch(analyzeManifesto({ 
                candidateId: activeManifestoId, 
                manifestoText, 
                userId: user?.id 
            }));
            setManifestoText('');
            setActiveManifestoId(null);
        }
    };

    // Mock issues - in a real app, these would come from user profile
    const issues = ['Infrastructure', 'Economy', 'Welfare', 'Education', 'Healthcare', 'Corruption'];

    return (
        <div className="container mx-auto p-8 space-y-12 max-w-7xl">
            <header className="space-y-4">
                <div className="flex justify-between items-end">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">Policy Translator</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl">
                            Compare candidates and understand how their policies impact the issues you care about.
                        </p>
                    </div>
                </div>
            </header>

            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 bg-card p-6 rounded-3xl border shadow-sm">
                <div className="space-y-1 flex-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Election</label>
                    <select 
                        onChange={handleElectionSelect}
                        className="w-full bg-transparent text-xl font-bold outline-none cursor-pointer border-none p-0 focus:ring-0"
                    >
                        <option value="">Choose an upcoming election...</option>
                        {elections.map((election) => (
                            <option key={election.id} value={election.id}>
                                {election.name} — {election.region}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-4">
                    {selectedCandidates.length > 0 && (
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => setView(view === 'selector' ? 'grid' : 'selector')}
                            className="px-6 py-3 rounded-full font-bold border-2 border-primary text-primary hover:bg-primary/5 transition-colors"
                        >
                            {view === 'selector' ? `Selected (${selectedCandidates.length})` : 'Edit Selection'}
                        </motion.button>
                    )}
                    
                    {selectedCandidates.length >= 2 && view === 'selector' && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={handleCompare}
                            className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-2px] transition-all"
                        >
                            Generate Comparison
                        </motion.button>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {view === 'selector' ? (
                    <motion.div
                        key="selector"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-12"
                    >
                        {isLoading ? (
                            <div className="py-20 text-center text-muted-foreground animate-pulse">Gathering election data...</div>
                        ) : selectedElection ? (
                            <>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-2xl font-bold">Candidates</h3>
                                        <p className="text-sm text-muted-foreground">Select up to 3 for comparison</p>
                                    </div>
                                    <CandidateSelector 
                                        candidates={candidates} 
                                        selectedCandidates={selectedCandidates} 
                                        onToggle={handleToggleCandidate}
                                    />
                                </div>

                                {/* Manifesto Upload Placeholder */}
                                <div className="p-8 border-2 border-dashed rounded-3xl bg-muted/20 space-y-6">
                                    <div className="text-center space-y-2">
                                        <h3 className="text-xl font-bold">Analyze New Manifesto</h3>
                                        <p className="text-muted-foreground">Have a candidate's latest statement? Paste it here for AI analysis.</p>
                                    </div>
                                    
                                    <div className="max-w-2xl mx-auto space-y-4">
                                        <select 
                                            value={activeManifestoId || ''} 
                                            onChange={(e) => setActiveManifestoId(e.target.value)}
                                            className="w-full p-3 rounded-xl border bg-background"
                                        >
                                            <option value="">Select candidate to attribute manifesto to...</option>
                                            {candidates.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                        <textarea 
                                            className="w-full h-32 p-4 rounded-2xl border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                                            placeholder="Paste manifesto text here..."
                                            value={manifestoText}
                                            onChange={(e) => setManifestoText(e.target.value)}
                                        />
                                        <button 
                                            disabled={!activeManifestoId || !manifestoText || isLoading}
                                            onClick={handleAnalyzeManifesto}
                                            className="w-full py-3 bg-secondary text-secondary-foreground rounded-xl font-bold hover:bg-secondary/90 disabled:opacity-50 transition-all"
                                        >
                                            Analyze with Gemini
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="py-32 text-center border-2 border-dashed rounded-[3rem] bg-muted/5">
                                <div className="max-w-xs mx-auto space-y-4">
                                    <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
                                        <span className="text-2xl">🗳️</span>
                                    </div>
                                    <h3 className="text-xl font-bold">Ready to start?</h3>
                                    <p className="text-muted-foreground">Select an election from the menu above to see participating candidates.</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-12"
                    >
                        {comparisonSummary && (
                            <section className="bg-primary/5 border border-primary/20 p-8 rounded-[2rem] space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <span className="text-xl">✨</span>
                                    <h3 className="text-xl font-bold">AI Comparison Summary</h3>
                                </div>
                                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                                    {comparisonSummary.split('\n').map((para, i) => (
                                        <p key={i}>{para}</p>
                                    ))}
                                </div>
                            </section>
                        )}

                        <PolicyBentoGrid 
                            candidates={selectedCandidates} 
                            policies={analyzedPolicies} 
                            issues={issues}
                        />
                        
                        <div className="flex justify-center pt-8">
                            <button 
                                onClick={() => setView('selector')}
                                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                            >
                                ← Back to Candidate Selection
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
