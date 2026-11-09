# HealthFourUs: AgentFoundry front end

**The Next.js front end for AgentFoundry, a multi-agent healthcare platform, with multilingual chat, voice
output, document analysis and a live view of the agents talking to each other.**

> **Companion repository.** The multi-agent backend, the BioMistral-7B fine tune and the Solidity audit-log
> contracts live in [**Agentfoundry**](https://github.com/Aryan-lomte05/Agentfoundry). Read that first for the
> architecture.

Built by team **HealthFourUs** for Periscope 2025: Aryan Lomte, Shivam Verma, Aditya Yadav, Sujal Thakkar.

## What is here

| Route | Purpose |
|---|---|
| `app/agents/` | Live view of the agent roster and the messages passing between them |
| `api/chat/` | Conversation with the agent system |
| `api/speak/`, `api/tts/` | Voice output |
| `api/translate/` | Multilingual support |
| `api/upload/analyze/`, `api/upload/list/` | Document and report upload with analysis |
| `api/timeline/chats/` | Conversation history |
| `api/login/`, `api/signup/` | Authentication |

The agents view is the part worth looking at: because the backend routes every agent-to-agent message through a
central bus and keeps the last 100, the front end can show the negotiation between agents as it happens rather
than only the final answer.

## Running it

```bash
cd agent-foundry
npm install
cp .env.example .env.local      # backend URL, auth secret, TTS and translation keys
npm run dev
```

The AgentFoundry backend must be running for anything beyond the static pages.

## Limits

- Front end only, and dependent on the backend for all behaviour.
- A hackathon prototype. Not a medical product, not clinically validated, and not for real clinical use.
- **Repository hygiene:** a `.next/` build cache was committed, which is why the clone is large. It should be
  removed from tracking and added to `.gitignore`.
