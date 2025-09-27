'use client';
import { useState, useEffect } from 'react';
import type { Campaign, Move } from "@/app/(app)/dashboard/page";

let campaigns: Campaign[] = [];
let listeners: ((campaigns: Campaign[]) => void)[] = [];

export const campaignStore = {
  addCampaign(campaign: Campaign) {
    campaigns = [...campaigns, campaign];
    emitChange();
  },

  updateMoveStatus(campaignId: string, moveId: string, status: Move['status']) {
    campaigns = campaigns.map(campaign => {
      if (campaign.id === campaignId) {
        return {
          ...campaign,
          moves: campaign.moves.map(move => 
            move.id === moveId ? { ...move, status } : move
          )
        };
      }
      return campaign;
    });
    emitChange();
  },

  subscribe(listener: (campaigns: Campaign[]) => void) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },

  getSnapshot() {
    return campaigns;
  }
};

function emitChange() {
  for (let listener of listeners) {
    listener(campaigns);
  }
}

export function useCampaigns() {
    const [campaigns, setCampaigns] = useState(campaignStore.getSnapshot());

    useEffect(() => {
        const unsubscribe = campaignStore.subscribe(setCampaigns);
        return () => unsubscribe();
    }, []);

    return campaigns;
}
