export type Lang = 'en' | 'hi' | 'pa';

export interface Strings {
  home: string;
  shop: string;
  rewards: string;
  ledger: string;
  more: string;
  hello: string;
  balance: string;
  worth: string;
  toGold: string;
  missions: string;
  scratchTitle: string;
  quick: string;
  order: string;
  scan: string;
  rank: string;
  viewBoard: string;
  addPO: string;
  sendOrder: string;
  payNudge: string;
  redeem: string;
  earnLine: string;
}

export const T: Record<Lang, Strings> = {
  en: {
    home: 'Home',
    shop: 'Catalogue',
    rewards: 'Rewards',
    ledger: 'Ledger',
    more: 'More',
    hello: 'Namaste, Rajesh ji',
    balance: 'Shakti Points',
    worth: 'value',
    toGold: 'to Shakti Gold',
    missions: 'Live missions',
    scratchTitle: 'Scratch & win',
    quick: 'Quick actions',
    order: 'Order',
    scan: 'Scan QR',
    rank: 'Your district rank',
    viewBoard: 'View',
    addPO: 'Add to PO',
    sendOrder: 'Send order request',
    payNudge: 'Pay before 10 Jul → +25% bonus SP',
    redeem: 'Redeem',
    earnLine: 'The more Shakti you sell, the more Shakti you earn.',
  },
  hi: {
    home: 'होम',
    shop: 'कैटलॉग',
    rewards: 'इनाम',
    ledger: 'खाता',
    more: 'और',
    hello: 'नमस्ते, राजेश जी',
    balance: 'शक्ति पॉइंट्स',
    worth: 'मूल्य',
    toGold: 'शक्ति गोल्ड तक',
    missions: 'चालू मिशन',
    scratchTitle: 'खरोंचो और जीतो',
    quick: 'क्विक एक्शन',
    order: 'ऑर्डर',
    scan: 'QR स्कैन',
    rank: 'आपकी ज़िला रैंक',
    viewBoard: 'देखें',
    addPO: 'PO में जोड़ें',
    sendOrder: 'ऑर्डर भेजें',
    payNudge: '10 जुलाई से पहले भुगतान → +25% बोनस SP',
    redeem: 'रिडीम करें',
    earnLine: 'जितना शक्ति बेचोगे, उतनी शक्ति कमाओगे।',
  },
  pa: {
    home: 'ਹੋਮ',
    shop: 'ਕੈਟਾਲਾਗ',
    rewards: 'ਇਨਾਮ',
    ledger: 'ਖਾਤਾ',
    more: 'ਹੋਰ',
    hello: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਰਾਜੇਸ਼ ਜੀ',
    balance: 'ਸ਼ਕਤੀ ਪੁਆਇੰਟ',
    worth: 'ਮੁੱਲ',
    toGold: 'ਸ਼ਕਤੀ ਗੋਲਡ ਤੱਕ',
    missions: 'ਚਾਲੂ ਮਿਸ਼ਨ',
    scratchTitle: 'ਖੁਰਚੋ ਤੇ ਜਿੱਤੋ',
    quick: 'ਤੁਰੰਤ ਐਕਸ਼ਨ',
    order: 'ਆਰਡਰ',
    scan: 'QR ਸਕੈਨ',
    rank: 'ਤੁਹਾਡਾ ਜ਼ਿਲ੍ਹਾ ਰੈਂਕ',
    viewBoard: 'ਵੇਖੋ',
    addPO: 'PO ਵਿੱਚ ਪਾਓ',
    sendOrder: 'ਆਰਡਰ ਭੇਜੋ',
    payNudge: '10 ਜੁਲਾਈ ਤੋਂ ਪਹਿਲਾਂ ਭੁਗਤਾਨ → +25% ਬੋਨਸ SP',
    redeem: 'ਰਿਡੀਮ',
    earnLine: 'ਜਿੰਨੀ ਸ਼ਕਤੀ ਵੇਚੋਗੇ, ਓਨੀ ਸ਼ਕਤੀ ਕਮਾਓਗੇ।',
  },
};

export const LANG_CHIPS: Record<Lang, string> = { en: 'EN', hi: 'हि', pa: 'ਪਾ' };
export const LANG_LABELS: Record<Lang, string> = { en: 'English', hi: 'हिन्दी', pa: 'ਪੰਜਾਬੀ' };
export const LANG_ORDER: Lang[] = ['en', 'hi', 'pa'];
