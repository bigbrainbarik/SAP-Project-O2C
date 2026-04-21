# SAP SD Order-to-Cash (O2C) Simulator

An interactive, high-fidelity web simulator that replicates the **SAP Sales & Distribution (SD)** Order-to-Cash process. Built for SAP learners, consultants, and trainers who want to practice the full O2C lifecycle — from inquiry to payment — without access to a live SAP system.

> **Live Demo:** [https://bigbrainbarik.github.io/SAP-Project-O2C](https://bigbrainbarik.github.io/SAP-Project-O2C) *(coming soon)*

---

## Features

### 🔄 Full O2C Process Simulation

Walk through all 7 steps of the Order-to-Cash cycle with realistic SAP transaction screens:

| Step | T-Code | Description |
|------|--------|-------------|
| 1 | **VA11** | Create Customer Inquiry |
| 2 | **VA21** | Create Quotation |
| 3 | **VA01** | Create Sales Order |
| 4 | **VL01N** | Create Outbound Delivery |
| 5 | **VL02N** | Post Goods Issue |
| 6 | **VF01** | Create Billing Document |
| 7 | **F-28** | Post Incoming Payment |

### 🚨 Scenario-Based Learning

Three simulation modes with branching error handling:

- **Normal Flow** — Complete O2C without exceptions
- **Credit Limit Exception** — Order blocked at VA01; resolve via manager override or quantity reduction
- **Stock Unavailability** — ATP check fails at VL01N; resolve via delivery delay or partial shipment

### 📊 SAP Reference Tools

- **Document Flow** — Interactive graph showing the complete transaction chain
- **T-Code Reference** — Searchable table of 25+ SAP SD/FI/MM transaction codes
- **SPRO Configuration** — Expandable implementation guide with 19 config steps across 5 categories
- **Org Structure** — Animated enterprise hierarchy (Client → Company Code → Sales Org → Plant)
- **Master Data** — Customer master (XD01), Material master (MM01), Customer-Material info (VD51)

### 🎨 Enterprise-Grade UI

- Hybrid **SAP Fiori / SAP GUI** design language — dense, structured, functional
- **Material Design 3** color system with light/dark mode
- **Framer Motion** animated page transitions and micro-interactions
- Web Audio API sound feedback for enterprise interaction cues
- Keyboard accessible with `:focus-visible` outlines

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 3.4 (Material Design 3 tokens) |
| Animation | Framer Motion 12 |
| Routing | React Router 7 |
| Icons | Lucide React |
| State | React Context + `useReducer` with `localStorage` persistence |
| Audio | Web Audio API (custom `SoundManager`) |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/bigbrainbarik/SAP-Project-O2C.git
cd SAP-Project-O2C

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── common/           # Reusable UI — SapField, SapTable, StatusBadge, PageTransition
│   ├── layout/           # AppShell, Sidebar, TopBar, FooterBar
│   └── simulation/       # SimulationWorkspace, StepNavigator, TransactionActions
├── context/
│   └── SimulatorContext.tsx   # Global state (scenario, steps, documents, messages)
├── data/
│   ├── navigation.ts     # Sidebar + routing config
│   └── sapData.ts        # SAP domain data (customers, materials, T-codes, SPRO, org)
├── pages/
│   ├── LoginPage.tsx      # SAP-style login screen
│   ├── LoaderPage.tsx     # Animated system initialization
│   ├── DashboardPage.tsx  # Fiori Launchpad with tile grid
│   ├── InquiryPage.tsx    # VA11 — Customer Inquiry
│   ├── QuotationPage.tsx  # VA21 — Quotation with pricing
│   ├── SalesOrderPage.tsx # VA01 — Sales Order + credit block
│   ├── DeliveryPage.tsx   # VL01N — Delivery + stock block
│   ├── GoodsIssuePage.tsx # VL02N — Goods Issue + FI posting
│   ├── BillingPage.tsx    # VF01 — Invoice creation
│   ├── PaymentPage.tsx    # F-28 — Payment clearing
│   ├── DocumentFlowPage.tsx   # Interactive transaction graph
│   ├── TCodesPage.tsx     # Searchable T-Code reference
│   ├── SproPage.tsx       # SPRO config accordion
│   ├── OrgStructurePage.tsx   # Enterprise hierarchy tree
│   ├── MasterDataPage.tsx # Tabbed master data views
│   └── SummaryPage.tsx    # KPI cards + lifecycle flow
├── utils/
│   ├── documentIds.ts     # SAP-style document number generator
│   ├── sound.ts           # Web Audio API interaction feedback
│   └── steps.ts           # O2C step ordering + navigation helpers
├── types.ts               # Core TypeScript interfaces
├── App.tsx                # Route definitions
├── main.tsx               # Entry point with providers
└── index.css              # Global styles + custom scrollbar
```

---

## How It Works

### Simulation Flow

1. **Login** → SAP-themed login screen (Client 800 / User SD_EXPERT)
2. **Loader** → Animated 5-stage system initialization
3. **Setup** → Choose scenario (Normal / Credit Block / Stock Issue)
4. **Execute** → Step through 7 O2C transactions with SAP-dense forms
5. **Summary** → Review document chain, KPIs, and module integration

### Branching Logic

**Credit Block Scenario (VA01):**
- Order value exceeds customer credit limit → red alert panel
- **Option A:** Override with manager authorization → order unblocked
- **Option B:** Reduce quantity by 50% → order value within limit

**Stock Issue Scenario (VL01N):**
- ATP check fails — insufficient inventory → amber warning panel
- **Option A:** Delay delivery by 5 business days → rescheduled
- **Option B:** Partial delivery at 60% → backorder created

### State Management

All simulation state is managed via `SimulatorContext` with `useReducer`:
- Scenario selection persists across navigation
- Document IDs generated in SAP numeric format
- Step completion tracked and validated
- System messages queued with auto-dismiss
- Preferences (theme, sound) saved to `localStorage`

---

## SAP Concepts Covered

| Area | Concepts |
|------|----------|
| **Enterprise Structure** | Client, Company Code, Sales Org, Distribution Channel, Division, Plant, Shipping Point, Storage Location |
| **Master Data** | Customer Master (General + Sales Area), Material Master (Basic + Sales + Plant), Customer-Material Info Record, Partner Functions |
| **Sales Documents** | Inquiry (AF), Quotation (AG), Standard Order (OR), Returns (RE), Rush Order (SO) |
| **Pricing** | Condition Types (PR00, K004, K007, MWST), Pricing Procedure (RVAA01), Condition Records |
| **Shipping** | Delivery Type (LF), Shipping Point determination, Picking, Packing |
| **Billing** | Invoice (F2), Credit Memo (G2), Revenue Account Determination |
| **FI Integration** | Goods Issue posting (Mvt 601), COGS/Inventory GL entries, Receivable clearing |
| **Credit Management** | Automatic credit control, Risk categories, Credit groups |

---

## Screenshots

| Dashboard | Sales Order (VA01) | Document Flow |
|-----------|-------------------|---------------|
| Fiori-style tile launchpad | Dense pricing + credit block UI | Interactive 7-node graph |

---

## Author

**Aditya Kumar Barik**

- GitHub: [@bigbrainbarik](https://github.com/bigbrainbarik)

---

## License

This project is for **educational purposes only**. SAP, SAP GUI, SAP Fiori, and all related trademarks are the property of SAP SE. This simulator is not affiliated with or endorsed by SAP SE.
