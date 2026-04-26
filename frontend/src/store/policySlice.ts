import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface Candidate {
    id: string;
    name: string;
    party: string;
    bio: string;
    color_hex: string;
    manifesto_text: string;
    seats_won?: number;
    vote_share?: number;
    symbol_emoji?: string;
    alliance?: string;
}

export interface Election {
    id: string;
    name: string;
    region: string;
    election_date: string;
    description: string;
    total_seats?: number;
    year?: number;
    election_type?: string;
    winning_party?: string;
    winning_seats?: number;
    winning_pm?: string;
}

export interface Policy {
    id: string;
    candidate_id: string;
    category: string;
    title: string;
    description: string;
    impact_score: number;
}

export interface UserPreference {
    id: string;
    user_id: string;
    election_id: string;
    candidate_id: string;
    bookmarked: boolean;
    notes?: string;
    rating?: number;
    category?: string;
}

interface PolicyState {
    elections: Election[];
    candidates: Candidate[];
    selectedElection: Election | null;
    selectedCandidates: Candidate[];
    analyzedPolicies: Policy[];
    comparisonSummary: string | null;
    userPreferences: UserPreference[];
    isLoading: boolean;
    error: string | null;
}

const initialState: PolicyState = {
    elections: [],
    candidates: [],
    selectedElection: null,
    selectedCandidates: [],
    analyzedPolicies: [],
    comparisonSummary: null,
    userPreferences: [],
    isLoading: false,
    error: null,
};

export const fetchElections = createAsyncThunk('policy/fetchElections', async () => {
    const response = await axios.get(`${API_URL}/elections`);
    return response.data;
});

export const fetchCandidates = createAsyncThunk('policy/fetchCandidates', async (electionId: string) => {
    const response = await axios.get(`${API_URL}/elections/${electionId}/candidates`);
    return response.data;
});

export const analyzeManifesto = createAsyncThunk(
    'policy/analyzeManifesto',
    async ({ candidateId, manifestoText, userId }: { candidateId: string; manifestoText: string; userId?: string }) => {
        const response = await axios.post(`${API_URL}/policies/analyze`, { candidateId, manifestoText, userId });
        return response.data;
    }
);

export const fetchComparison = createAsyncThunk(
    'policy/fetchComparison',
    async ({ candidateIds, userId }: { candidateIds: string[]; userId?: string }) => {
        const response = await axios.post(`${API_URL}/policies/compare`, { candidateIds, userId });
        return response.data.comparisonSummary;
    }
);

export const savePreference = createAsyncThunk(
    'policy/savePreference',
    async (prefData: Omit<UserPreference, 'id'>) => {
        const response = await axios.post(`${API_URL}/users/preferences`, prefData);
        return response.data;
    }
);

const policySlice = createSlice({
    name: 'policy',
    initialState,
    reducers: {
        setSelectedElection: (state, action: PayloadAction<Election | null>) => {
            state.selectedElection = action.payload;
            state.selectedCandidates = [];
            state.analyzedPolicies = [];
            state.comparisonSummary = null;
        },
        toggleCandidateSelection: (state, action: PayloadAction<Candidate>) => {
            const index = state.selectedCandidates.findIndex(c => c.id === action.payload.id);
            if (index >= 0) {
                state.selectedCandidates.splice(index, 1);
            } else {
                if (state.selectedCandidates.length < 3) {
                    state.selectedCandidates.push(action.payload);
                }
            }
            state.comparisonSummary = null; // Reset summary if selection changes
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchElections.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchElections.fulfilled, (state, action) => {
                state.isLoading = false;
                state.elections = action.payload;
            })
            .addCase(fetchCandidates.fulfilled, (state, action) => {
                state.candidates = action.payload;
            })
            .addCase(analyzeManifesto.fulfilled, (state, action) => {
                state.analyzedPolicies = [...state.analyzedPolicies, ...action.payload];
            })
            .addCase(fetchComparison.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchComparison.fulfilled, (state, action) => {
                state.isLoading = false;
                state.comparisonSummary = action.payload;
            })
            .addCase(fetchComparison.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch comparison';
            })
            .addCase(savePreference.fulfilled, (state, action) => {
                const index = state.userPreferences.findIndex(p => p.id === action.payload.id);
                if (index >= 0) {
                    state.userPreferences[index] = action.payload;
                } else {
                    state.userPreferences.push(action.payload);
                }
            });
    },
});

export const { setSelectedElection, toggleCandidateSelection } = policySlice.actions;
export default policySlice.reducer;
