# VinaUp Mobile — Component Diagram

## High-Level

Data flows top-to-bottom; user interactions bubble upward.

```mermaid
graph TD
    subgraph Routes["🗺️ Routes (src/app/)"]
        R1["Public"] ~~~ R2["Personal Tabs"] ~~~ R3["Organization Tabs"] ~~~ R4["Detail Screens"]
    end

    subgraph Components["🎨 Components (src/components/)"]
        C1["Primitives"] ~~~ C2["Commons"] ~~~ C3["Feature Components"]
    end

    subgraph State["🗃️ State (src/hooks/ + src/providers/)"]
        S1["Zustand Stores"] ~~~ S2["React Context Providers"]
    end

    subgraph Network["🌐 Network (src/apis/)"]
        N1["API Modules"] ~~~ N2["Fetchwire"]
    end

    Backend["☁️ REST API — apiup.vinaup.com"]

    Routes --> Components
    Components --> State
    State --> Network
    Network --> Backend
```

---

## Features

```mermaid
graph TD
    AUTH["Auth"]

    subgraph Personal["Personal Mode"]
        P_HOME["Home Dashboard"]
        P_RP["Receipt / Payment"]
        P_PROJ["Projects"]
    end

    subgraph Organization["Organization Mode"]
        O_HOME["Home Dashboard"]
        O_TOUR["Tours"]
        O_BOOK["Bookings"]
        O_INV["Invoices"]
        O_PROJ["Projects"]
        O_RP["Receipt / Payment"]
        O_MEM["Members & Roles"]
        O_CUST["Customers"]
    end

    AUTH --> Personal
    AUTH --> Organization
```

---

## React Component Layer

| Layer | Directory | Purpose |
|-------|-----------|---------|
| **Primitives** | `src/components/primitives/` | Base UI atoms — Button, Input, Select, DateTimePicker, SlideSheet, Skeleton, Carousel, Popover, Avatar |
| **Commons** | `src/components/commons/` | Cross-feature components — modals, headers, cards, selectors, skeletons, signature canvas, grids |
| **Feature** | `src/components/organization/` `src/components/personal/` | Domain-specific components scoped to Personal or Organization mode |
| **Icons** | `src/components/icons/` | 36+ custom SVG icon components |

---

## State Management Layer

| Layer | Directory | Purpose |
|-------|-----------|---------|
| **Zustand** | `src/hooks/` | Pure client-side state: modal open/close, form fields, navigation loading indicator, per-org utility preferences |
| **React Context** | `src/providers/` | Server-derived data: current user (auth), organization list, entity currently being viewed (tour, project, invoice, booking) |

---

## Key Directories

| Directory | Role |
|-----------|------|
| `src/app/` | File-based navigation via Expo Router |
| `src/apis/` | One file per business domain, Fetchwire-based |
| `src/components/` | UI component library |
| `src/providers/` | React Context providers for server state |
| `src/hooks/` | Zustand stores for client state |
| `src/interfaces/` | TypeScript type definitions per domain |
| `src/constants/` | App-wide enums, colors, and configuration |
| `src/utils/calculator/` | Business calculation helpers — pure functions |
| `src/utils/generator/string-generator/` | String formatting utilities — pure functions |
| `src/utils/generator/file-generator/html/` | HTML template generators — pure functions |
| `src/utils/generator/file-generator/pdf/` | PDF creation and sharing — uses Expo file system |
| `src/utils/generator/file-generator/excel/` | Excel export — placeholder |

---