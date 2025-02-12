export interface RPGState {
  level: number;
  experience: number;
  messages: RPGMessage[];
  equippedItems: string[];
  skills: {
    hacking: number;
    encryption: number;
    analysis: number;
    quantum: number;
  };
  inventory: InventoryItem[];
  completedQuests: string[];
  activeQuests: Quest[];
  reputation: number;
  lastSaved: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: 'tool' | 'data' | 'upgrade';
  rarity: 'common' | 'rare' | 'legendary';
  equipped?: boolean;
  effects: {
    [key: string]: number;
  };
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'failed';
  objectives: QuestObjective[];
  rewards: QuestReward;
}

export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
  type: 'hack' | 'analyze' | 'collect' | 'decrypt';
  target: string;
  progress: number;
  required: number;
}

export interface QuestReward {
  experience: number;
  reputation: number;
  items?: InventoryItem[];
  skills?: {
    [key: string]: number;
  };
}

export interface GameChoice {
  id: string;
  text: string;
  requirements?: {
    skills?: { [key: string]: number };
    items?: string[];
    reputation?: number;
  };
  consequences: {
    success: GameOutcome;
    failure?: GameOutcome;
  };
}

export interface GameOutcome {
  text: string;
  effects: {
    experience?: number;
    reputation?: number;
    items?: { add?: InventoryItem[]; remove?: string[] };
    skills?: { [key: string]: number };
    quests?: { add?: Quest[]; complete?: string[]; fail?: string[] };
  };
}

export interface RPGMessage {
  id: string;
  content: string;
  type: 'user' | 'system' | 'command';
  timestamp: Date;
  choices?: GameChoice[];
}

export interface StatInfoPopupProps {
  stat: string;
  level: number;
  isOpen: boolean;
  onClose: () => void;
}

export interface ItemDetailsPopupProps {
  item: InventoryItem | null;
  onClose: () => void;
}