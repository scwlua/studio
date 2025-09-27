'use client';
import { useState, useEffect } from 'react';
import type { Move } from "@/app/(app)/dashboard/page";
import { generateAchievement } from '@/ai/flows/generate-achievement';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  date: string;
  trigger: string;
};

export type PotentialAchievement = {
  id: string;
  title: string;
  description: string;
}

let achievements: Achievement[] = [];
let listeners: ((data: { achievements: Achievement[], potentialAchievements: PotentialAchievement[] }) => void)[] = [];

let movesCompletedCount = 0;

const potentialAchievements: PotentialAchievement[] = [
    { id: 'first-move', title: 'Pawn\'s First Promotion', description: 'Complete your first move.' },
    { id: 'five-moves', title: 'Knight\'s Tour', description: 'Complete five moves.' },
    { id: 'critical-move', title: 'Critical Capture', description: 'Complete a critical-priority move.' },
];

let state = {
    achievements: [] as Achievement[],
    potentialAchievements: potentialAchievements,
};

const emitChange = () => {
  for (let listener of listeners) {
    listener(state);
  }
};

export const achievementsStore = {
  async notifyMoveCompleted(move: Move) {
    movesCompletedCount++;

    // Check for "First Move"
    if (movesCompletedCount === 1 && !state.achievements.some(a => a.trigger === 'first-move')) {
        await this.createAchievement('first-move', `Completed the first task: "${move.title}"`);
    } 
    // Check for "Five Moves"
    else if (movesCompletedCount === 5 && !state.achievements.some(a => a.trigger === 'five-moves')) {
        await this.createAchievement('five-moves', `Completed five tasks, the latest being: "${move.title}"`);
    }
    
    // Check for "Critical Move"
    if (move.priority === 'Critical' && !state.achievements.some(a => a.trigger === `critical-move-${move.id}`)) {
        await this.createAchievement(
            `critical-move-${move.id}`, // Make trigger unique to this move
            `Completed a CRITICAL task: "${move.title}"`
        );
    }
    
    this.updatePotentialAchievements();
    emitChange();
  },

  async createAchievement(triggerId: string, context: string) {
    const existing = state.achievements.find(a => a.trigger === triggerId);
    if (existing) return;

    try {
        const result = await generateAchievement({ context });
        const newAchievement: Achievement = {
            id: `ach-${Date.now()}`,
            title: result.title,
            description: result.description,
            trigger: triggerId,
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        };
        state.achievements = [newAchievement, ...state.achievements];
    } catch (e) {
        console.error("Failed to generate achievement:", e);
        // Fallback to a non-AI achievement
         const fallbackTitle = triggerId.startsWith('critical') 
            ? 'Critical Objective Secured!'
            : (triggerId === 'first-move' ? 'First Move Complete!' : 'Five Moves Done!');

         const newAchievement: Achievement = {
            id: `ach-${Date.now()}`,
            title: fallbackTitle,
            description: context,
            trigger: triggerId,
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        };
        state.achievements = [newAchievement, ...state.achievements];
    }
  },

  updatePotentialAchievements() {
    state.potentialAchievements = potentialAchievements.filter(pa => 
        !state.achievements.some(a => a.trigger === pa.id)
    );
  },

  subscribe(listener: (data: { achievements: Achievement[], potentialAchievements: PotentialAchievement[] }) => void) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },

  getSnapshot() {
    return state;
  }
};

export function useAchievements() {
    const [data, setData] = useState(achievementsStore.getSnapshot());

    useEffect(() => {
        const unsubscribe = achievementsStore.subscribe(setData);
        // Initial check in case achievements were loaded from storage later
        achievementsStore.updatePotentialAchievements();
        emitChange();
        return () => unsubscribe();
    }, []);

    return data;
}

// Initialize
achievementsStore.updatePotentialAchievements();
