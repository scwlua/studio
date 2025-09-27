'use client';
import { useState, useEffect } from 'react';
import type { Campaign } from "@/app/(app)/dashboard/page";

let campaigns: Campaign[] = [];
let listeners: ((campaigns: Campaign[]) => void)[] = [];

export const campaignStore = {
  addCampaign(campaign: Campaign) {
    campaigns = [...campaigns, campaign];
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
