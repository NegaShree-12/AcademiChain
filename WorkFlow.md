📌 Overview

This document describes the GitHub workflow followed during the development of AcademiChain.
The workflow ensures clean collaboration, version control, code quality, and traceability throughout the project lifecycle.

The repository follows industry-standard Git practices suitable for academic projects, hackathons, and production-ready systems.

🧩 Repository Structure
academichain/
├── frontend/          # React + TypeScript + Tailwind CSS
├── backend/           # Node.js + Express APIs
├── blockchain/        # Solidity smart contracts
├── docs/              # Project documentation (SRS, diagrams)
├── .github/
│   └── workflows/     # GitHub Actions (CI/CD)
├── README.md
├── package.json
└── .env.example

🌿 Branching Strategy

The project uses a feature-based branching model.

Main Branches

main

Stable, production-ready code

Final evaluated version

Only merged via Pull Requests

develop

Active development branch

All feature branches merge here first

Feature Branches

Feature branches are created from develop using the format:

feature/<feature-name>


Examples:

feature/student-dashboard

feature/wallet-integration

feature/credential-verification

feature/institution-portal

🔄 Development Workflow
Step 1: Clone Repository
git clone https://github.com/username/academichain.git
cd academichain

Step 2: Create Feature Branch
git checkout develop
git pull origin develop
git checkout -b feature/<feature-name>

Step 3: Code Development

Implement feature

Follow project coding standards

Use meaningful variable and commit names

Ensure TypeScript typing and error handling

Step 4: Commit Changes
git add .
git commit -m "feat: add credential sharing modal"


Commit Message Convention:

feat: New feature

fix: Bug fix

refactor: Code restructuring

docs: Documentation changes

style: UI or formatting changes

Step 5: Push Feature Branch
git push origin feature/<feature-name>

Step 6: Create Pull Request (PR)

Base branch: develop

Compare branch: feature/<feature-name>

Add description:

Feature summary

Screenshots (if UI)

Related issues

Step 7: Code Review & Merge

Review code for:

Functionality

Security

Code quality

Resolve conflicts if any

Merge into develop

Step 8: Release to Main

Once all features are stable:

git checkout main
git merge develop
git push origin main

⚙️ GitHub Actions (CI/CD Workflow)

The project uses GitHub Actions for continuous integration.

CI Pipeline Includes:

Dependency installation

TypeScript build check

Linting

Unit test execution (if applicable)

Workflow File:
.github/workflows/ci.yml

Trigger Conditions:

Push to develop

Pull request to main

🔐 Environment & Secrets Management

Sensitive keys are stored in GitHub Secrets

.env files are never committed

Example config provided in .env.example

🧪 Testing Workflow

Local testing before commit

Manual UI testing for frontend

Smart contract tested on Sepolia / Ganache

Verification tested using hash-based validation
