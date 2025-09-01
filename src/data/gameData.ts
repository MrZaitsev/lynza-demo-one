import type { Level, Badge, Achievement } from '../types/game';

export const badges: Badge[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Completed your first lesson',
    icon: '🎯',
    rarity: 'common'
  },
  {
    id: 'money-historian',
    name: 'Money Historian',
    description: 'Learned about the history of money',
    icon: '📚',
    rarity: 'common'
  },
  {
    id: 'block-builder',
    name: 'First Block Builder',
    description: 'Built your first blockchain block',
    icon: '🧱',
    rarity: 'rare'
  },
  {
    id: 'crypto-collector',
    name: 'Crypto Collector',
    description: 'Collected all basic cryptocurrency cards',
    icon: '💎',
    rarity: 'epic'
  },
  {
    id: 'guardian-of-keys',
    name: 'Guardian of Keys',
    description: 'Mastered wallet security practices',
    icon: '🛡️',
    rarity: 'epic'
  },
  {
    id: 'defi-master',
    name: 'DeFi Master',
    description: 'Completed advanced DeFi simulation',
    icon: '⚡',
    rarity: 'legendary'
  }
];

export const levels: Level[] = [
  {
    id: 1,
    title: "The Basics",
    description: "Unlock the treasure chest of money history",
    requiredLevel: 0,
    isUnlocked: true,
    isCompleted: false,
    reward: {
      coins: 100,
      experience: 50,
      badges: [badges[0], badges[1]]
    },
    lessons: [
      {
        id: 'what-is-money',
        title: 'What is Money?',
        description: 'Discover the fascinating history of money',
        estimatedTime: 2,
        isCompleted: false,
        isUnlocked: true,
        reward: {
          coins: 25,
          experience: 15
        },
        content: {
          type: 'interactive',
          sections: [
            {
              id: 'money-intro',
              type: 'metaphor',
              title: 'The Great Trade Mystery',
              content: 'Imagine you live in a world where everyone trades by exchanging goods...',
              metaphor: {
                title: 'From Barter to Gold',
                description: 'Watch how trade evolved from simple exchanges to complex monetary systems',
                visual: '🏺➡️🐄➡️🥇➡️💰',
                explanation: 'Money solved the problem of "coincidence of wants" - you no longer needed to find someone who had what you wanted AND wanted what you had!'
              }
            },
            {
              id: 'money-properties',
              type: 'interactive',
              title: 'What Makes Good Money?',
              content: 'Money needs special properties to work well...',
              interactive: {
                type: 'drag-drop',
                data: {
                  properties: ['Durable', 'Portable', 'Divisible', 'Uniform', 'Limited Supply', 'Acceptable'],
                  examples: ['Gold', 'Seashells', 'Paper Bills', 'Digital Numbers']
                }
              }
            }
          ]
        },
        quiz: {
          id: 'money-quiz-1',
          questions: [
            {
              id: 'q1',
              question: 'What problem did money solve in early trade?',
              options: [
                'People were too lazy to work',
                'The coincidence of wants problem',
                'There were no goods to trade',
                'People didn\'t like each other'
              ],
              correctAnswer: 1,
              explanation: 'Money solved the coincidence of wants - the problem of finding someone who both had what you wanted AND wanted what you had!'
            }
          ]
        }
      },
      {
        id: 'digital-money',
        title: 'What is Digital Money?',
        description: 'From physical coins to digital transactions',
        estimatedTime: 3,
        isCompleted: false,
        isUnlocked: false,
        reward: {
          coins: 30,
          experience: 20
        },
        content: {
          type: 'interactive',
          sections: [
            {
              id: 'digital-evolution',
              type: 'text',
              title: 'The Digital Revolution',
              content: 'When computers arrived, money began its digital transformation...'
            },
            {
              id: 'digital-problems',
              type: 'interactive',
              title: 'The Double-Spending Problem',
              content: 'Digital money faced a unique challenge...',
              interactive: {
                type: 'simulation',
                data: {
                  scenario: 'double-spending',
                  description: 'Try to spend the same digital coin twice and see what happens!'
                }
              }
            }
          ]
        }
      },
      {
        id: 'what-is-blockchain',
        title: 'What is Blockchain?',
        description: 'The revolutionary solution to digital trust',
        estimatedTime: 3,
        isCompleted: false,
        isUnlocked: false,
        reward: {
          coins: 35,
          experience: 25
        },
        content: {
          type: 'interactive',
          sections: [
            {
              id: 'blockchain-metaphor',
              type: 'metaphor',
              title: 'The Digital Ledger',
              content: 'Imagine a magical ledger book that copies itself to everyone in the village...',
              metaphor: {
                title: 'The Village Ledger',
                description: 'A ledger that everyone can see but no one can cheat',
                visual: '📖➡️📖📖📖➡️🌐',
                explanation: 'Blockchain is like a ledger that copies itself to thousands of computers, making it impossible to fake transactions!'
              }
            }
          ]
        }
      }
    ]
  },
  {
    id: 2,
    title: "Core Concepts",
    description: "Build the foundation of blockchain knowledge",
    requiredLevel: 1,
    isUnlocked: false,
    isCompleted: false,
    reward: {
      coins: 200,
      experience: 100,
      badges: [badges[2]]
    },
    lessons: [
      {
        id: 'blocks-and-chains',
        title: 'How Blocks Form Chains',
        description: 'Understanding the blockchain structure',
        estimatedTime: 4,
        isCompleted: false,
        isUnlocked: false,
        reward: {
          coins: 40,
          experience: 30
        },
        content: {
          type: 'interactive',
          sections: [
            {
              id: 'block-structure',
              type: 'interactive',
              title: 'Anatomy of a Block',
              content: 'Every block contains important information...',
              interactive: {
                type: 'click-sequence',
                data: {
                  blockParts: ['Previous Hash', 'Transactions', 'Timestamp', 'Nonce', 'Current Hash']
                }
              }
            }
          ]
        },
        miniGame: {
          id: 'block-builder-1',
          type: 'block-builder',
          title: 'Build Your First Block',
          description: 'Drag transactions into the correct order to build a valid block',
          data: {
            transactions: [
              { from: 'Alice', to: 'Bob', amount: 10 },
              { from: 'Charlie', to: 'Alice', amount: 5 },
              { from: 'Bob', to: 'Charlie', amount: 3 }
            ]
          }
        }
      },
      {
        id: 'consensus',
        title: 'Consensus Mechanisms',
        description: 'How the network agrees on truth',
        estimatedTime: 4,
        isCompleted: false,
        isUnlocked: false,
        reward: {
          coins: 45,
          experience: 35
        },
        content: {
          type: 'interactive',
          sections: [
            {
              id: 'consensus-metaphor',
              type: 'metaphor',
              title: 'The Village Council',
              content: 'Imagine a village where decisions are made by consensus...',
              metaphor: {
                title: 'Democratic Decision Making',
                description: 'How a decentralized network makes decisions',
                visual: '👥➡️🗳️➡️✅',
                explanation: 'Consensus mechanisms ensure everyone agrees on the state of the blockchain!'
              }
            }
          ]
        }
      },
      {
        id: 'decentralization',
        title: 'Decentralization',
        description: 'Why distributed systems matter',
        estimatedTime: 3,
        isCompleted: false,
        isUnlocked: false,
        reward: {
          coins: 40,
          experience: 30
        },
        content: {
          type: 'interactive',
          sections: [
            {
              id: 'centralized-vs-decentralized',
              type: 'interactive',
              title: 'Central vs Distributed',
              content: 'Compare different network structures...',
              interactive: {
                type: 'choice',
                data: {
                  scenarios: ['Bank System', 'Blockchain Network'],
                  comparison: ['Single Point of Failure', 'Distributed Trust']
                }
              }
            }
          ]
        }
      }
    ]
  },
  {
    id: 3,
    title: "Cryptocurrencies & Tokens",
    description: "Explore the world of digital currencies",
    requiredLevel: 2,
    isUnlocked: false,
    isCompleted: false,
    reward: {
      coins: 300,
      experience: 150,
      badges: [badges[3]]
    },
    lessons: [
      {
        id: 'bitcoin-basics',
        title: 'Bitcoin: Digital Gold',
        description: 'The first and most famous cryptocurrency',
        estimatedTime: 4,
        isCompleted: false,
        isUnlocked: false,
        reward: {
          coins: 50,
          experience: 40
        },
        content: {
          type: 'interactive',
          sections: [
            {
              id: 'bitcoin-story',
              type: 'text',
              title: 'The Birth of Bitcoin',
              content: 'In 2008, a mysterious figure named Satoshi Nakamoto...'
            },
            {
              id: 'bitcoin-properties',
              type: 'interactive',
              title: 'Bitcoin Properties',
              content: 'What makes Bitcoin special?',
              interactive: {
                type: 'drag-drop',
                data: {
                  properties: ['Limited Supply (21M)', 'Decentralized', 'Peer-to-Peer', 'Immutable'],
                  benefits: ['Store of Value', 'Censorship Resistant', 'Global Access', 'Transparent']
                }
              }
            }
          ]
        }
      },
      {
        id: 'ethereum-smart-contracts',
        title: 'Ethereum: The World Computer',
        description: 'Programmable blockchain platform',
        estimatedTime: 5,
        isCompleted: false,
        isUnlocked: false,
        reward: {
          coins: 55,
          experience: 45
        },
        content: {
          type: 'interactive',
          sections: [
            {
              id: 'smart-contracts',
              type: 'metaphor',
              title: 'Smart Contracts',
              content: 'Imagine a vending machine that executes agreements automatically...',
              metaphor: {
                title: 'The Digital Vending Machine',
                description: 'Self-executing contracts with terms directly written into code',
                visual: '🏪➡️💻➡️⚡',
                explanation: 'Smart contracts automatically execute when conditions are met, just like a vending machine gives you a snack when you insert coins!'
              }
            }
          ]
        }
      },
      {
        id: 'stablecoins',
        title: 'Stablecoins: Digital Stability',
        description: 'Cryptocurrencies pegged to stable assets',
        estimatedTime: 3,
        isCompleted: false,
        isUnlocked: false,
        reward: {
          coins: 45,
          experience: 35
        },
        content: {
          type: 'interactive',
          sections: [
            {
              id: 'stability-mechanisms',
              type: 'interactive',
              title: 'How Stablecoins Stay Stable',
              content: 'Different approaches to maintaining stable value...',
              interactive: {
                type: 'choice',
                data: {
                  types: ['Fiat-Collateralized', 'Crypto-Collateralized', 'Algorithmic'],
                  examples: ['USDC', 'DAI', 'UST (historical)']
                }
              }
            }
          ]
        }
      }
    ]
  },
  {
    id: 4,
    title: "Wallets & Safety",
    description: "Master the art of secure crypto storage",
    requiredLevel: 3,
    isUnlocked: false,
    isCompleted: false,
    reward: {
      coins: 400,
      experience: 200,
      badges: [badges[4]]
    },
    lessons: [
      {
        id: 'keys-and-addresses',
        title: 'Keys and Addresses',
        description: 'Your digital identity and security',
        estimatedTime: 4,
        isCompleted: false,
        isUnlocked: false,
        reward: {
          coins: 60,
          experience: 50
        },
        content: {
          type: 'interactive',
          sections: [
            {
              id: 'key-pairs',
              type: 'metaphor',
              title: 'The Magic Key Pair',
              content: 'Imagine you have a magical mailbox with two special keys...',
              metaphor: {
                title: 'Public and Private Keys',
                description: 'One key locks (public), one key unlocks (private)',
                visual: '🔐➡️📬➡️🗝️',
                explanation: 'Your public key is like your address - everyone can see it. Your private key is like your house key - keep it secret!'
              }
            }
          ]
        }
      },
      {
        id: 'wallet-types',
        title: 'Types of Wallets',
        description: 'Hot, cold, and everything in between',
        estimatedTime: 4,
        isCompleted: false,
        isUnlocked: false,
        reward: {
          coins: 55,
          experience: 45
        },
        content: {
          type: 'interactive',
          sections: [
            {
              id: 'wallet-comparison',
              type: 'interactive',
              title: 'Choose Your Wallet',
              content: 'Different wallets for different needs...',
              interactive: {
                type: 'choice',
                data: {
                  walletTypes: ['Mobile Wallet', 'Hardware Wallet', 'Paper Wallet', 'Exchange Wallet'],
                  scenarios: ['Daily Spending', 'Long-term Storage', 'Emergency Backup', 'Trading']
                }
              }
            }
          ]
        }
      },
      {
        id: 'security-practices',
        title: 'Security Best Practices',
        description: 'Protect yourself from scams and attacks',
        estimatedTime: 5,
        isCompleted: false,
        isUnlocked: false,
        reward: {
          coins: 65,
          experience: 55
        },
        content: {
          type: 'interactive',
          sections: [
            {
              id: 'scam-scenarios',
              type: 'interactive',
              title: 'Spot the Scam',
              content: 'Can you identify safe vs unsafe actions?',
              interactive: {
                type: 'choice',
                data: {
                  scenarios: [
                    'Someone asks for your private key to "help" you',
                    'A website offers 1000% returns guaranteed',
                    'You receive an email asking to verify your wallet',
                    'A friend recommends a hardware wallet from the official store'
                  ],
                  answers: ['UNSAFE', 'UNSAFE', 'UNSAFE', 'SAFE']
                }
              }
            }
          ]
        },
        miniGame: {
          id: 'security-checker',
          type: 'security-checker',
          title: 'Security Challenge',
          description: 'Navigate through various security scenarios and make the right choices',
          data: {
            scenarios: [
              {
                situation: 'You lost your phone with your wallet app. What should you do first?',
                options: [
                  'Panic and do nothing',
                  'Immediately use your seed phrase to recover the wallet',
                  'Buy a new phone and hope the app still works'
                ],
                correct: 1,
                explanation: 'Your seed phrase is your backup key. It allows you to recover your wallet on any device. This is why you should always write it down and store it safely!'
              },
              {
                situation: 'Someone sends you a link claiming you won free crypto. What do you do?',
                options: [
                  'Click the link immediately to claim your prize',
                  'Ignore it completely - it\'s likely a scam',
                  'Forward it to friends so they can win too'
                ],
                correct: 1,
                explanation: 'Free crypto offers are almost always scams designed to steal your wallet information. Legitimate projects don\'t randomly give away crypto via suspicious links.'
              },
              {
                situation: 'A friend asks for your seed phrase to "help you backup your wallet". What do you do?',
                options: [
                  'Share it since they\'re trying to help',
                  'Never share your seed phrase with anyone',
                  'Give them half the words for security'
                ],
                correct: 1,
                explanation: 'Never share your seed phrase with ANYONE. It\'s like giving someone the master key to your bank account. Even well-meaning friends shouldn\'t have access.'
              },
              {
                situation: 'You want to connect your wallet to a new DeFi app. What should you check first?',
                options: [
                  'Nothing - just connect and start using it',
                  'Verify the website URL and check for security audits',
                  'Ask on social media if it\'s safe'
                ],
                correct: 1,
                explanation: 'Always verify the official website URL (check for typos!) and look for security audit reports. Fake DeFi sites are common and can drain your wallet instantly.'
              },
              {
                situation: 'Your wallet shows a transaction you didn\'t make. What happened?',
                options: [
                  'The blockchain made an error',
                  'Your private key may be compromised',
                  'It\'s probably just a visual bug'
                ],
                correct: 1,
                explanation: 'Unauthorized transactions mean someone has access to your private key or seed phrase. You should immediately move funds to a new wallet with a new seed phrase.'
              }
            ]
          }
        }
      }
    ]
  },
  {
    id: 5,
    title: "Advanced Topics",
    description: "Explore the cutting edge of blockchain technology",
    requiredLevel: 4,
    isUnlocked: false,
    isCompleted: false,
    reward: {
      coins: 500,
      experience: 300,
      badges: [badges[5]]
    },
    lessons: [
      {
        id: 'defi-basics',
        title: 'Decentralized Finance (DeFi)',
        description: 'Banking without banks',
        estimatedTime: 6,
        isCompleted: false,
        isUnlocked: false,
        reward: {
          coins: 80,
          experience: 70
        },
        content: {
          type: 'interactive',
          sections: [
            {
              id: 'defi-metaphor',
              type: 'metaphor',
              title: 'The Decentralized Bank',
              content: 'Imagine a bank that runs itself with no employees...',
              metaphor: {
                title: 'Automated Financial Services',
                description: 'Smart contracts providing financial services 24/7',
                visual: '🏦➡️🤖➡️⚡',
                explanation: 'DeFi uses smart contracts to provide banking services without traditional banks!'
              }
            }
          ]
        },
        miniGame: {
          id: 'defi-simulator',
          type: 'investment-simulator',
          title: 'DeFi vs Traditional Investment',
          description: 'Simulate investing $100 in DeFi vs holding Bitcoin',
          data: {
            scenarios: [
              { 
                name: 'Hold Bitcoin', 
                risk: 'medium', 
                expectedReturn: '8-25%',
                description: 'Buy and hold Bitcoin for long-term growth',
                pros: ['Proven track record', 'High liquidity', 'Widely accepted'],
                cons: ['Price volatility', 'No passive income', 'Regulatory risks']
              },
              { 
                name: 'DeFi Liquidity Pool', 
                risk: 'high', 
                expectedReturn: '15-80%',
                description: 'Provide liquidity to decentralized exchanges',
                pros: ['High potential returns', 'Earn trading fees', 'Compound rewards'],
                cons: ['Impermanent loss risk', 'Smart contract bugs', 'High gas fees']
              },
              { 
                name: 'DeFi Lending', 
                risk: 'low', 
                expectedReturn: '3-12%',
                description: 'Lend your crypto to earn steady interest',
                pros: ['Predictable returns', 'Lower risk', 'Flexible terms'],
                cons: ['Lower yields', 'Platform risk', 'Liquidation risk']
              },
              {
                name: 'Staking ETH',
                risk: 'medium',
                expectedReturn: '4-8%',
                description: 'Stake Ethereum to secure the network',
                pros: ['Network rewards', 'Helps decentralization', 'Relatively stable'],
                cons: ['Lock-up periods', 'Slashing risk', 'Technical complexity']
              },
              {
                name: 'Yield Farming',
                risk: 'high',
                expectedReturn: '20-200%',
                description: 'Maximize returns through complex DeFi strategies',
                pros: ['Highest potential returns', 'Multiple reward tokens', 'Innovation exposure'],
                cons: ['Extremely high risk', 'Rug pull potential', 'Requires expertise']
              }
            ]
          }
        }
      },
      {
        id: 'staking',
        title: 'Staking: Earn While You Hold',
        description: 'Participate in network consensus and earn rewards',
        estimatedTime: 4,
        isCompleted: false,
        isUnlocked: false,
        reward: {
          coins: 70,
          experience: 60
        },
        content: {
          type: 'interactive',
          sections: [
            {
              id: 'staking-concept',
              type: 'text',
              title: 'What is Staking?',
              content: 'Staking is like earning interest on your crypto while helping secure the network...'
            }
          ]
        }
      },
      {
        id: 'daos-nfts',
        title: 'DAOs and NFTs',
        description: 'Decentralized organizations and digital ownership',
        estimatedTime: 5,
        isCompleted: false,
        isUnlocked: false,
        reward: {
          coins: 75,
          experience: 65
        },
        content: {
          type: 'interactive',
          sections: [
            {
              id: 'dao-concept',
              type: 'metaphor',
              title: 'The Digital Democracy',
              content: 'Imagine a company where every decision is voted on by token holders...',
              metaphor: {
                title: 'Decentralized Autonomous Organization',
                description: 'Organizations governed by smart contracts and community votes',
                visual: '🏢➡️🗳️➡️🤝',
                explanation: 'DAOs are like digital cooperatives where everyone has a say in decisions!'
              }
            },
            {
              id: 'nft-concept',
              type: 'text',
              title: 'Non-Fungible Tokens (NFTs)',
              content: 'Digital certificates of ownership for unique items...'
            }
          ]
        }
      }
    ]
  }
];

export const achievements: Achievement[] = [
  {
    id: 'speed-learner',
    name: 'Speed Learner',
    description: 'Complete 3 lessons in one day',
    icon: '⚡',
    condition: (user) => {
      // This would need to check lesson completion timestamps
      return user.completedLessons.length >= 3;
    },
    reward: {
      coins: 100,
      experience: 50
    }
  },
  {
    id: 'perfect-score',
    name: 'Perfect Score',
    description: 'Get 100% on 5 quizzes in a row',
    icon: '🎯',
    condition: (user) => {
      // This would need to track quiz scores
      return user.experience > 500;
    },
    reward: {
      coins: 200,
      experience: 100
    }
  }
];
