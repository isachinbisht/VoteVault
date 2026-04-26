import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

interface BoothSession {
    id: string;
    steps_completed: string[];
    confidence_before: number;
    confidence_after?: number;
    test_vote_candidate_id?: string;
}

interface BoothState {
    currentSession: BoothSession | null;
    currentStep: 'intro' | 'id_check' | 'evm' | 'complete';
    isLoading: boolean;
    error: string | null;
}

const initialState: BoothState = {
    currentSession: null,
    currentStep: 'intro',
    isLoading: false,
    error: null,
};

export const startSession = createAsyncThunk(
    'booth/startSession',
    async ({ userId, electionId, confidenceBefore }: { userId: string; electionId: string; confidenceBefore: number }) => {
        const response = await axios.post(`${API_URL}/booth/start`, { userId, electionId, confidenceBefore });
        return response.data;
    }
);

export const updateSession = createAsyncThunk(
    'booth/updateSession',
    async ({ sessionId, step, candidateId, confidenceAfter, duration }: { 
        sessionId: string; 
        step?: string; 
        candidateId?: string; 
        confidenceAfter?: number;
        duration?: number;
    }) => {
        const response = await axios.post(`${API_URL}/booth/update/${sessionId}`, { step, candidateId, confidenceAfter, duration });
        return response.data;
    }
);

const boothSlice = createSlice({
    name: 'booth',
    initialState,
    reducers: {
        setStep: (state, action: PayloadAction<BoothState['currentStep']>) => {
            state.currentStep = action.payload;
        },
        resetBooth: (state) => {
            state.currentSession = null;
            state.currentStep = 'intro';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(startSession.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(startSession.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentSession = action.payload;
                state.currentStep = 'id_check';
            })
            .addCase(updateSession.fulfilled, (state, action) => {
                state.currentSession = action.payload;
            });
    },
});

export const { setStep, resetBooth } = boothSlice.actions;
export default boothSlice.reducer;
