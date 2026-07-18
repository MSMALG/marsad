# مرصاد (Marsad) — AI-Powered Personal Finance Dashboard

Marsad is a full-stack personal finance app built for the Saudi market. It combines expense tracking, AI-generated savings wallets, spending-behavior analysis, fraud/security logging, an AI financial-advisor chat, and a travel/currency planner into one Arabic RTL mobile banking dashboard.

- **Frontend:** React + TypeScript + Vite, Tailwind CSS, MUI, Radix UI, React Router, TanStack Query
- **Backend:** FastAPI (Python), SQLAlchemy + SQLite, JWT auth, CatBoost/scikit-learn ML model
- **AI features:** Server-side calls to the Anthropic API (Claude) for wallet generation and the "اسأل مرصاد" chat assistant

## Features

- **Auth** — JWT-based register/login (`/auth/register`, `/auth/login`)
- **Expenses** — log and categorize spending, with automatic suspicious-expense checks
- **Smart Wallets** — savings goals (travel, wedding, car, house, emergency fund, custom) with AI-generated budget allocations grounded in web search
- **Budget prediction** — a trained ML model (`ml/mersad_model.pkl`) predicts expected monthly expenses per category
- **Alerts** — flags spending spikes, a single category dominating the budget, or heavy spend at one merchant
- **Behavior analysis** — breaks predicted expenses into categories using real GASTAT-derived shares by nationality (`business_rules.json`)
- **Cheaper alternatives** — suggests cheaper local substitutes for known merchants (e.g. coffee shops)
- **Rewards** — points and tier system (Bronze → Silver → Gold → Platinum)
- **Security** — an append-only, per-user hash chain of security events (`/security/logs`, `/security/verify`)
- **Travel** — currency exchange insights and cost-of-living comparisons across countries
- **AI Chat ("اسأل مرصاد")** — streams answers from Claude, grounded in the user's real wallet data

## Project structure

```
marsad/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entrypoint, router registration
│   │   ├── database.py          # SQLite + SQLAlchemy session setup
│   │   ├── db_models.py         # User, Expense, Wallet, RewardAccount, SecurityLog
│   │   ├── auth.py / auth_routes.py   # password hashing, JWT, /auth endpoints
│   │   ├── expenses.py          # expense CRUD
│   │   ├── wallets.py           # smart wallets + AI wallet generation
│   │   ├── Budget.py            # ML-based expense prediction
│   │   ├── Alert.py             # spending alerts
│   │   ├── behavior_analysis.py # category breakdown by nationality
│   │   ├── cheaper_alternative.py
│   │   ├── rewards.py
│   │   ├── security.py          # hash-chain security log
│   │   ├── travel.py            # currency/cost-of-living insights
│   │   ├── AIChat.py            # streaming AI assistant
│   │   ├── model.py             # ML model loading/inference helpers
│   │   ├── business_rules.json  # category share data
│   │   └── marsad.db            # SQLite database (created on first run)
│   ├── ml/
│   │   └── mersad_model.pkl     # trained CatBoost/scikit-learn model
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api/client.ts        # Axios client, attaches JWT, handles 401s
    │   ├── pages/                # Login, Dashboard, Expenses, Wallets, Investment,
    │   │                         # Travel, Security, Rewards, CheaperAlternative, CountrySelect
    │   └── components/
    ├── package.json
    └── vite.config.ts
```

## Getting started

### Prerequisites

- Python 3.10+
- Node.js 18+
- An Anthropic API key (only required for the AI wallet-generation and chat features)

### Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside `backend/` with your Anthropic key:

```
ANTHROPIC_API_KEY=your_key_here
```

Run the API server (from `backend/app`, since modules use flat imports):

```bash
cd app
uvicorn main:app --reload --port 8001
```

The SQLite database (`marsad.db`) and all tables are created automatically on first run. The API will be available at `http://127.0.0.1:8001`, with interactive docs at `http://127.0.0.1:8001/docs`.

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

By default the frontend points to `http://127.0.0.1:8001`. To override this, set `VITE_API_BASE_URL` in a `.env` file inside `frontend/`.

## Testing

For quick testing/demo purposes, a test account is already seeded in the database:

- **Email:** `a@test.com`
- **Password:** `1234`

Just start the backend and log in with these credentials from the frontend's login page — no need to register a new user.

## Notes

- The JWT secret in `auth.py` is hardcoded for local development. **Do not use this in production** — move it to an environment variable.
- Blockchain/smart-contract based transaction verification (`blockchain.py`, `smart_contract.py`) has been superseded by the DB-backed hash chain in `security.py` (`/security/logs`, `/security/verify`).
- Category and merchant labels in parts of the backend (e.g. `cheaper_alternative.py`) are in Arabic to match the app's Arabic RTL UI.
