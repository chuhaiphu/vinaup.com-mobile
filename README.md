<div align="center">
  <img src="src/assets/images/logo-vinaup.png" alt="VinaUp Logo" width="120" />
  <h1>VinaUp Mobile</h1>
  <p>Income & expense management app for individuals and organizations.</p>

  ![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-blue)
  ![Expo](https://img.shields.io/badge/Expo-55.0.0-000020?logo=expo)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
  ![React Native](https://img.shields.io/badge/React%20Native-0.83.2-61DAFB?logo=react)
</div>

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Patterns](#patterns)
- [Principles](#principles)
- [Setup](#setup)

---

## Overview

VinaUp Mobile is an income and expense management app for a wide range of users — from individuals such as office workers and laborers, to organizations including small retail businesses.

The app currently includes specialized support for **Travel Companies and Tour Guides**, with plans to expand to additional business types in the future.

The app operates in two modes:

- **Personal Mode** — income/expense tracking and project management for individual users
- **Organization Mode** — full workspace per organization with tours, bookings, invoices, projects, and team management

A single account can belong to multiple organizations and switch between them seamlessly.

---

## Architecture

For system context, component structure, and how the app is organized internally, see:

**[docs/architecture/SYSTEM-CONTEXT.md](docs/architecture/SYSTEM-CONTEXT.md)** — User types, external systems, and app boundaries.

**[docs/architecture/COMPONENT.md](docs/architecture/COMPONENT.md)** — Layer diagram, key directories, and internal structure.

---

## Patterns

Design patterns used consistently throughout the codebase.

**[docs/pattern/REPOSITORY-PATTERN.md](docs/pattern/REPOSITORY-PATTERN.md)** — API layer: one file per domain, api fetching abstraction, naming convention for API functions.

**[docs/pattern/PROVIDER-PATTERN.md](docs/pattern/PROVIDER-PATTERN.md)** — React Context providers: server-state fetch/mutation lifecycle, typed consumer hooks, provider co-location.

**[docs/pattern/OBSERVER-PATTERN.md](docs/pattern/OBSERVER-PATTERN.md)** — Zustand stores: simple, persisted, and cross-field variants; when to use Zustand vs Context.

**[docs/pattern/COMPOSITE-PATTERN.md](docs/pattern/COMPOSITE-PATTERN.md)** — Modal shell/content split, primitive extension, folder conventions for modal components.

---

## Principles

Engineering principles that guide decisions across the codebase.

**[docs/principles/SOC.md](docs/principles/SOC.md)** — Separation of Concerns: four-layer architecture, import direction rules, concern boundaries within each layer.

**[docs/principles/DRY.md](docs/principles/DRY.md)** — Don't Repeat Yourself: shared constants, utility functions, parameterised templates, interface-driven typing.

**[docs/principles/KISS.md](docs/principles/KISS.md)** — Keep It Simple: simplest state mechanism that works, no premature abstractions, fetch lifecycle in two lines.

---

## Setup

For installation, environment variables, local development build, USB debugging, wireless debugging, and EAS build instructions, see:

**[docs/setup/SETUP.md](docs/setup/SETUP.md)**

If you cannot connect wirelessly during development, see:

**[docs/setup/TROUBLESHOOTING.md](docs/setup/TROUBLESHOOTING.md)**
