# System Report - Folder Structure

This document provides a comprehensive overview of the **Kavach-ML Model** project folder structure.

## 📂 Root Directory Overview

| Name | Type | Description |
| :--- | :--- | :--- |
| `backend/` | Directory | holds the core API implementation (Python). |
| `frontend/` | Directory | Contains the Next.js application building the web app interface. |
| `services/` | Directory | Specialized microservices/workers (fraud, payout, risk, trigger engines). |
| `ml/` | Directory | Dedicated workspace for Machine Learning development and inference. |
| `pipelines/` | Directory | Automated monitoring and trigger scripts (AQI, Weather, etc.). |
| `infra/` | Directory | Infrastructure as Code configuration files & Docker setup. |
| `configs/` | Directory | Global or component-specific configuration files. |
| `scripts/` | Directory | Utility scripts (testing flows, database seeding, validation). |
| `docs/` | Directory | Project documentation files and resources. |
| `data/` | Directory | Local datasets, models, or storage outputs. |

---

## 🔍 Detailed Breakdown

### 🔧 **1. Backend (`backend/`)**
The backend houses a Python Application (likely powered by FastAPI).
- **`app/`**
  - `api/`: API endpoints and router configurations.
  - `models/`: Database models or ORM schemas.
  - `schemas/`: Data validation models (Pydantic models, etc.).
  - `services/`: Business logic implementations.
  - `database/`: DB connection handlers or setup scripts.
  - `utils/`: Reusable helpers or script accessories.
  - `main.py`: The application entry point.

### 🌐 **2. Frontend (`frontend/`)**
A Next.js standard installation containing modern interface components.
- **`src/`** Contains core functionality:
  - `app/`: Next.js App Router (Layouts and Pages routing).
  - `components/`: Modular, reusable UI building blocks.
  - `hooks/`: Global or page-specific custom React hooks.
  - `services/`: API integration services connecting setup with the backend.
  - `store/`: State management handlers.
  - `pages/`: Additional component/page structures.
- configuration files: `next.config.js`, `tsconfig.json`, global styling `style.css` & configurations.

### ⚙️ **3. Dedicated Engines (`services/`)**
Contains core analytical pipelines running detached jobs.
- **`fraud-engine/`**: Detects malicious triggers or discrepancies.
- **`payout-engine/`**: Manages backend payment systems triggers.
- **`risk-engine/`**: Scores incoming streams for validity/safety triggers.
- **`trigger-engine/`**: Handles event-driven orchestrations.

### 🧠 **4. Machine Learning Workspace (`ml/`)**
Processes data for advanced heuristics and scores.
- `datasets/`: Storage of raw or processed datasets.
- `inference/`: Scripts for live production evaluation.
- `models/`: Trained model binaries / checkpoints.
- `notebooks/`: Jupyter workbooks for experiments and iterations.
- `preprocessing/`: Scripts manipulating data streams into structures.
- `training/`: Orchestrates continuous learning pipelines.

### 🗺️ **5. Pipelines (`pipelines/`)**
Standalone monitors watching external variables:
- `weather_monitor.py`
- `aqi_monitor.py`
- `disruption_detector.py`
- `payout_trigger.py`

### 🏗️ **6. Infrastructure (`infra/`)**
Everything needed to deploy the application at scale:
- `docker/`: Dockerfiles and local composition profiles.
- `kubernetes/`: Deployments templates, services or ingress configs for K8s.
- `terraform/`: Automated Cloud Deployment files.

---

## 📄 Root Level Configs
- `docker-compose.yml`: Multi-container orchestration specification.
- `package.json`: Top-tier JavaScript requirements & builds scripts.
- `requirements.txt`: Master package configurations listing for Python elements.
- `.gitignore` & `LICENSE`: Normal version-control mechanics.
