export type QuickActionType = 'chat' | 'docs';

export type QuickActionItem = {
    id: string;
    title: string;
    subtitle: string;
    type: QuickActionType;
};

export type FaqItem = {
    id: string;
    question: string;
    answer: string;
};
