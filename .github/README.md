# GitHub Repository Information

## Quick Start Links

- 📖 [Main README](../README.md) - Project overview and features
- 🚀 [Setup Guide](../docs/SETUP.md) - Get started locally
- 🚢 [Deployment Guide](../docs/DEPLOYMENT.md) - Deploy to production
- 🏗️ [Architecture Docs](../docs/ARCHITECTURE.md) - System design
- 📚 [API Reference](../docs/API.md) - Data structures and functions
- 🤝 [Contributing Guide](../CONTRIBUTING.md) - How to contribute
- 📑 [Docs Index](../docs/README.md) - All documentation organized

## Project Quick Facts

- **Project Name:** Restaurant Reservation Chatbot
- **Creator:** Rachit
- **Version:** 0.1.0
- **License:** MIT
- **Status:** Active Development

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **State Management:** React Hooks

## Key Features

✨ Conversational AI chatbot
📱 Mobile & desktop responsive
📊 Real-time availability checking
🎯 Booking confirmation with reference
🔄 Reset functionality
📋 Menu information queries

## Getting Started (30 seconds)

```bash
# Clone the repository
git clone https://github.com/rachts/restaurant-reservation-bot.git
cd restaurant-reservation-bot

# Install and run
npm install
npm run dev

# Visit http://localhost:3000
```

## Directory Structure

```
├── app/                  # Next.js app directory
├── components/           # React components
├── lib/                  # Core logic
├── docs/                 # Documentation
├── public/               # Static assets
├── README.md             # Main documentation
├── CONTRIBUTING.md       # Contribution guidelines
└── .github/              # GitHub specific files
```

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm start        # Run production server
npm run lint     # Run linter
```

## Documentation Structure

| Document | Purpose | Audience |
|----------|---------|----------|
| README.md | Project overview | Everyone |
| docs/SETUP.md | Local development | Developers |
| docs/ARCHITECTURE.md | System design | Developers |
| docs/DEPLOYMENT.md | Production deployment | DevOps/Developers |
| docs/API.md | API reference | Developers |
| docs/README.md | Documentation index | Everyone |
| CONTRIBUTING.md | Contribution process | Contributors |

## Repository Settings

### Branch Protection
- Main branch: Require PRs before merge
- Require status checks to pass
- Require code reviews

### Issue Templates
- Bug Report
- Feature Request
- Question

### PR Template
- Description
- Related Issue
- Type of Change
- Testing
- Checklist

## CI/CD Setup (Recommended)

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - run: npm run lint
```

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for:
- How to report issues
- Feature request process
- Pull request guidelines
- Code style standards
- Development workflow

## Security

- No sensitive data in repo
- Environment variables in .env.local (not committed)
- See CONTRIBUTING.md for security considerations

## Support & Questions

1. **Check Documentation** - Answers to most questions in docs/
2. **Search Issues** - Your question might already be answered
3. **Create Issue** - For bugs or feature requests
4. **Create Discussion** - For general questions

## Roadmap

See [README.md](../README.md) for:
- [x] Core chat functionality
- [x] Booking system
- [ ] Database integration
- [ ] User authentication
- [ ] Email notifications
- [ ] Payment processing
- [ ] Admin dashboard

## License

MIT License - See LICENSE file

## Recognition

**Created by Rachit**

Made with ❤️ and good intentions

---

## GitHub Features

### Issues
- Use for bugs and feature requests
- Follow issue templates
- Reference with #123 in PRs

### Discussions
- Use for questions and discussions
- Good for feature brainstorming
- Ideas become issues if validated

### Pull Requests
- Follow PR template
- Link related issues
- Request review from maintainers

### Projects
- Kanban board for tracking
- Issues organized by milestone
- Visibility into progress

### Releases
- Tags for versions (v0.1.0, v0.2.0)
- Release notes with changes
- Download source code and binaries

### Wiki
- Can be used for guides
- Community contributions welcome

## Maintainer Notes

### Merging PRs
1. Ensure all checks pass
2. At least one review
3. Update related docs
4. Merge with squash commits
5. Delete feature branch

### Creating Releases
1. Update version in package.json
2. Create CHANGELOG entry
3. Tag commit with version
4. Create GitHub release

### Monitoring
- Watch for issues daily
- Respond to questions
- Accept PRs for improvements
- Keep dependencies updated

---

**Last Updated:** February 2026
**Version:** 1.0
