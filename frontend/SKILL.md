---
name: llm-arena-frontend
description: React 19 + Vite frontend for LLM Arena game visualization. Use when working on UI components, game board rendering, state management with hooks, API integration, Tailwind CSS v4 styling, Framer Motion animations, or frontend build configuration.
compatibility: Node.js 20+, React 19, Vite 7, Tailwind CSS v4
metadata:
  author: llm-arena-team
  version: "1.0.0"
  tags: "react, vite, tailwind, frontend"
---

# LLM Arena Frontend Skill

## When to Use This Skill

Use this skill when:
- Building or modifying React components
- Managing game state with custom hooks
- Integrating with the backend API
- Styling with Tailwind CSS v4
- Adding animations with Framer Motion
- Debugging React rendering issues
- Configuring Vite build settings
- Optimizing frontend performance

## Directory Structure

```
frontend/
├── SKILL.md                       # This file
├── index.html                     # HTML entry point
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind configuration
├── postcss.config.js              # PostCSS plugins
└── src/
    ├── main.jsx                   # React entry point
    ├── App.jsx                    # Main app with scene routing
    ├── index.css                  # Tailwind imports
    ├── components/
    │   ├── SetupScene.jsx         # Player configuration UI
    │   ├── GameSelectionScene.jsx # Game type selection
    │   └── GameBoard.jsx          # Game board and logs
    ├── hooks/
    │   └── useGameLogic.js        # Game state management
    ├── services/
    │   └── api.js                 # Backend API calls
    └── lib/
        └── utils.js               # Utility functions (cn)
```

## MCP Server Integration

### Sequential Thinking MCP

Use for complex frontend reasoning:

**Component Architecture:**
```
Think step-by-step about the GameBoard component:
Step 1: What props does it receive? (players, gameType, onBack)
Step 2: What state does it need? (from useGameLogic hook)
Step 3: How should the grid be rendered? (conditional on gameType)
Step 4: How to handle winner overlay? (conditional rendering)
Step 5: How to display real-time logs? (scrollable list with auto-scroll)
```

**State Management Debugging:**
```
Analyze this state synchronization issue:
Step 1: What is the expected state flow?
Step 2: When does state get out of sync?
Step 3: Are there stale closures in useEffect?
Step 4: Should we use useRef for non-reactive values?
Step 5: How to prevent race conditions?
```

**Performance Optimization:**
```
Optimize rendering performance:
Step 1: What components re-render unnecessarily?
Step 2: Where should useMemo/useCallback be applied?
Step 3: Are there memory leaks in cleanup functions?
Step 4: How can we reduce bundle size?
Step 5: Should we implement code splitting?
```

### Qdrant MCP Server

Store and retrieve backend-specific knowledge:

**Storage Keys:**
```
llm-arena:backend:progress:{timestamp}         # Progress snapshots
```

- After the completion of every task store the progress in Qdrant vector store using **qdrant-store**
- Save the progress in the format progress.md
- The file needs to include: TODO TASK, IN PROGRESS TASK, COMPLETED TASK


### Context7 MCP

Pull live documentation for:
- **React:** New hooks, server components, use() hook, transitions
- **Vite:** Configuration, plugins, HMR, build optimization
- **Tailwind CSS:** New utilities, configuration changes, dark mode
- **Framer Motion:** Animation patterns, layout animations, gestures

**Example:**
```
Context7: Get React useEffect cleanup patterns
Context7: Get Tailwind CSS animate-in utilities
Context7: Get Framer Motion layout animation examples
```