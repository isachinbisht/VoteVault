import { motion } from 'framer-motion';

interface Candidate {
    id: string;
    name: string;
    party: string;
    bio: string;
    color_hex: string;
}

interface CandidateSelectorProps {
    candidates: Candidate[];
    selectedCandidates: Candidate[];
    onToggle: (candidate: Candidate) => void;
}

export default function CandidateSelector({ candidates, selectedCandidates, onToggle }: CandidateSelectorProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {candidates.map((candidate) => {
                const isSelected = selectedCandidates.some((c) => c.id === candidate.id);
                return (
                    <motion.div
                        key={candidate.id}
                        whileHover={{ y: -4 }}
                        onClick={() => onToggle(candidate)}
                        className={`group cursor-pointer p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden flex flex-col space-y-6 ${
                            isSelected 
                                ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' 
                                : 'border-transparent bg-muted/30 hover:bg-muted/50'
                        }`}
                    >
                        <div 
                            className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity translate-x-10 translate-y--10 rounded-full"
                            style={{ backgroundColor: candidate.color_hex }}
                        />

                        <div className="flex justify-between items-center relative z-10">
                            <div 
                                className="w-16 h-16 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform"
                                style={{ backgroundColor: candidate.color_hex }}
                            >
                                {candidate.name.charAt(0)}
                            </div>
                            
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30'
                            }`}>
                                {isSelected && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1 relative z-10">
                            <h3 className="text-2xl font-black tracking-tight">{candidate.name}</h3>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: candidate.color_hex }} />
                                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{candidate.party}</span>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-3 relative z-10">
                            {candidate.bio}
                        </p>
                    </motion.div>
                );
            })}
        </div>
    );
}
