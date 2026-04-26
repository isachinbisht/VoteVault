import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { savePreference } from '../../store/policySlice';
import type { AppDispatch, RootState } from '../../store';
import { useState } from 'react';

import type { Policy, Candidate } from '../../store/policySlice';

interface PolicyBentoGridProps {
    candidates: Candidate[];
    policies: Policy[];
    issues: string[];
}

export default function PolicyBentoGrid({ candidates, policies, issues }: PolicyBentoGridProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.user);
    const { selectedElection, userPreferences } = useSelector((state: RootState) => state.policy);
    const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(
        new Set(userPreferences.filter(p => p.bookmarked).map(p => `${p.candidate_id}-${p.category}`))
    );

    const handleBookmark = (candidateId: string, category: string, policy: Policy) => {
        if (!user || !selectedElection) return;

        const key = `${candidateId}-${category}`;
        const isBookmarked = bookmarkedIds.has(key);
        
        dispatch(savePreference({
            user_id: user.id,
            election_id: selectedElection.id,
            candidate_id: candidateId,
            bookmarked: !isBookmarked,
            notes: policy.title,
            category: category
        }));

        const newBookmarks = new Set(bookmarkedIds);
        if (isBookmarked) newBookmarks.delete(key);
        else newBookmarks.add(key);
        setBookmarkedIds(newBookmarks);
    };

    return (
        <div className="space-y-16">
            {issues.map((issue, issueIndex) => (
                <div key={issue} className="space-y-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold">{issue}</h2>
                        <div className="h-px bg-muted flex-1" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {candidates.map((candidate, candIndex) => {
                            const candidatePolicy = policies.find(
                                (p) => p.candidate_id === candidate.id && p.category === issue
                            );

                            const isBookmarked = bookmarkedIds.has(`${candidate.id}-${issue}`);

                            return (
                                <motion.div
                                    key={`${issue}-${candidate.id}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (issueIndex * 0.1) + (candIndex * 0.05) }}
                                    className="group p-8 border rounded-[2rem] bg-card shadow-sm hover:shadow-xl hover:border-primary/20 transition-all relative overflow-hidden flex flex-col justify-between"
                                >
                                    <div 
                                        className="absolute top-0 left-0 w-2 h-full opacity-20 group-hover:opacity-100 transition-opacity"
                                        style={{ backgroundColor: candidate.color_hex }}
                                    />
                                    
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                                    {candidate.name}
                                                </span>
                                                {candidatePolicy && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg font-black">{candidatePolicy.impact_score}</span>
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Impact</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <button 
                                                onClick={() => candidatePolicy && handleBookmark(candidate.id, issue, candidatePolicy)}
                                                className={`p-2 rounded-full transition-all ${
                                                    isBookmarked 
                                                        ? 'bg-primary text-primary-foreground' 
                                                        : 'bg-muted hover:bg-primary/10 hover:text-primary'
                                                }`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                                                </svg>
                                            </button>
                                        </div>

                                        {candidatePolicy ? (
                                            <div className="space-y-3">
                                                <h4 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors">
                                                    {candidatePolicy.title}
                                                </h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                                                    {candidatePolicy.description}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="py-12 text-center">
                                                <div className="text-3xl mb-2 opacity-20">😶</div>
                                                <p className="text-xs text-muted-foreground italic">No specific stance found</p>
                                            </div>
                                        )}
                                    </div>

                                    {candidatePolicy && (
                                        <div className="pt-6 mt-6 border-t border-muted/50">
                                            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${candidatePolicy.impact_score * 10}%` }}
                                                    className="h-full bg-primary"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
