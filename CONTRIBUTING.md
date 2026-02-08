# Contributing Guide

Thank you for your interest in contributing to the Restaurant Reservation Chatbot! This guide will help you get started.

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.

## How to Contribute

### Reporting Issues

Found a bug? Have a feature request?

1. Check if the issue already exists
2. Provide:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots if applicable
   - Browser/device information

**Example Issue:**
```
Title: Chat input not responsive on iPhone

Description:
When using the chatbot on iPhone 12, the text input field becomes unresponsive
after sending 3-4 messages.

Steps to reproduce:
1. Open chatbot on iPhone
2. Send 3-4 messages
3. Try to type in input field
4. Field is not responding to touch

Expected: Input should be responsive throughout conversation
Actual: Input becomes unresponsive after a few messages

Device: iPhone 12, iOS 17.2
Browser: Safari
```

### Suggesting Features

Have an idea? Share it!

1. Describe the feature clearly
2. Explain the use case
3. Show how it benefits users
4. Provide mockups if helpful

**Example Feature Request:**
```
Title: Add user accounts and booking history

Description:
Allow users to create accounts so they can view and manage their past
and upcoming reservations.

Use Case:
Users often forget their booking reference numbers and can't modify
their reservations without calling the restaurant.

Benefits:
- Improved user experience
- Reduced customer service inquiries
- Better data for analytics

Mockup: [Screenshot of proposed UI]
```

### Submitting Pull Requests

#### Prerequisites
- Fork the repository
- Clone your fork locally
- Create a feature branch: `git checkout -b feature/my-feature`

#### Development Process

1. **Make your changes**
   ```bash
   # Edit files as needed
   npm run dev  # Test locally
   npm run build  # Check for errors
   ```

2. **Follow code style**
   - Use TypeScript for type safety
   - Follow existing code patterns
   - Use meaningful variable names
   - Add comments for complex logic

3. **Commit messages**
   ```bash
   git commit -m "feat: add booking history feature"
   git commit -m "fix: resolve chat input freezing issue"
   git commit -m "docs: update setup instructions"
   git commit -m "test: add availability checking tests"
   ```

   **Format:** `type: description`
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation
   - `style:` Formatting
   - `refactor:` Code restructuring
   - `test:` Tests
   - `perf:` Performance improvement

4. **Push and create PR**
   ```bash
   git push origin feature/my-feature
   ```
   Then open a Pull Request on GitHub

#### PR Requirements

Your PR should include:

- [ ] Clear title and description
- [ ] Reference related issues
- [ ] Updated documentation
- [ ] Tests for new features
- [ ] No breaking changes (unless major version)

**PR Template:**
```markdown
## Description
Brief description of changes

## Related Issue
Fixes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Breaking change

## Testing
How to test these changes?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] Build passes locally
```

## Development Guidelines

### Component Structure

```tsx
// components/MyComponent.tsx

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface MyComponentProps {
  title: string;
  children?: ReactNode;
  onAction?: () => void;
}

/**
 * Description of what this component does
 * 
 * @example
 * <MyComponent title="Hello" onAction={() => console.log('clicked')} />
 */
export function MyComponent({ 
  title, 
  children, 
  onAction 
}: MyComponentProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
      {onAction && (
        <Button onClick={onAction} variant="outline">
          Action
        </Button>
      )}
    </div>
  );
}
```

**Guidelines:**
- Type all props with interfaces
- Add JSDoc comments for public APIs
- Export default or named exports (prefer named)
- Keep components focused and single-purpose

### State Management

```tsx
// Good: Clear state purposes
const [messages, setMessages] = useState<Message[]>([]);
const [currentStep, setCurrentStep] = useState<ReservationStep>('greeting');
const [isLoading, setIsLoading] = useState(false);

// Avoid: Unclear state names
const [data, setData] = useState([]);
const [x, setX] = useState('');
const [flag, setFlag] = useState(false);
```

### Styling Guidelines

```tsx
// Use Tailwind classes in order
<div className="
  flex items-center justify-between
  gap-4 px-4 py-2
  bg-card text-foreground
  rounded-lg border border-border
  md:px-6 md:py-4
">
  {content}
</div>

// For complex styles, use CSS modules or globals.css
/* app/globals.css */
.chatMessage {
  @apply px-4 py-3 rounded-lg mb-3 animate-fade-in;
}
```

### Function Documentation

```typescript
/**
 * Generates a bot response based on the current conversation step
 * 
 * @param step - The current stage of the reservation flow
 * @param userInput - The user's message
 * @param reservationData - The accumulated booking data
 * @param availability - Available time slots by date
 * @returns BotResponse with message, next step, and updated data
 * 
 * @example
 * const response = generateBotResponse(
 *   'date',
 *   'I want to book for tomorrow',
 *   reservationData,
 *   availability
 * );
 */
export function generateBotResponse(
  step: ReservationStep,
  userInput: string,
  reservationData: ReservationData,
  availability: Record<string, string[]>
): BotResponse {
  // Implementation
}
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test ChatBubble.test.tsx
```

### Writing Tests

```typescript
// components/__tests__/ChatBubble.test.tsx
import { render, screen } from '@testing-library/react';
import { ChatBubble } from '@/components/ChatBubble';

describe('ChatBubble', () => {
  it('renders user message correctly', () => {
    const message = {
      id: '1',
      sender: 'user' as const,
      content: 'Hello bot',
      timestamp: new Date()
    };

    render(<ChatBubble message={message} />);
    
    expect(screen.getByText('Hello bot')).toBeInTheDocument();
  });

  it('renders bot message with different styling', () => {
    const message = {
      id: '2',
      sender: 'bot' as const,
      content: 'Hello user',
      timestamp: new Date()
    };

    render(<ChatBubble message={message} />);
    
    const bubble = screen.getByText('Hello user').closest('div');
    expect(bubble).toHaveClass('bg-secondary');
  });
});
```

## Documentation

### Updating README

When adding features, update the relevant section:

```markdown
## Features

✨ **My New Feature**
- Detailed description
- How it works
- Example usage
```

### Updating Docs

For significant changes, add documentation in `docs/`:

- **ARCHITECTURE.md** - System design changes
- **API.md** - API/data structure changes
- **SETUP.md** - Setup/installation changes
- **DEPLOYMENT.md** - Deployment changes

## Performance Considerations

### Before Optimizing

```typescript
// Measure first
console.time('messageProcessing');
// ... code
console.timeEnd('messageProcessing');

// Check bundle size
npm run build
```

### Common Optimizations

```typescript
// Memoize expensive computations
const cachedAvailability = useMemo(() => {
  return generateAvailability();
}, []);

// Callback optimization
const handleSendMessage = useCallback((message: string) => {
  // Process message
}, [dependencies]);

// Lazy load components
const AdminDashboard = lazy(() => import('@/components/AdminDashboard'));
```

## Accessibility

### Checklist

- [ ] All interactive elements keyboard accessible
- [ ] Color not the only indicator (add text labels)
- [ ] Images have alt text
- [ ] Form labels properly associated
- [ ] Sufficient color contrast (WCAG AA minimum)
- [ ] Focus indicators visible
- [ ] ARIA labels for screen readers

### Example

```tsx
// Good
<button 
  onClick={handleReset}
  aria-label="Start new conversation"
  className="focus:ring-2 focus:ring-primary"
>
  <RotateCcw size={20} />
  <span className="ml-2">Reset</span>
</button>

// Avoid
<div 
  onClick={handleReset}
  style={{ cursor: 'pointer' }}
>
  🔄
</div>
```

## Browser Compatibility

Test on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Chrome (Android)
- Mobile Safari (iOS)

Use [Can I Use](https://caniuse.com) to check feature support.

## Commit History Management

```bash
# Before submitting PR, clean up commits
git rebase -i HEAD~5  # Rebase last 5 commits

# Make meaningful commits
git commit -m "feat: add booking history"
git commit -m "test: add booking tests"
git commit -m "docs: update README"

# Keep history clean
# Avoid: "fix typo", "work in progress", "debug"
```

## Continuous Integration

All PRs run through:
- TypeScript type checking
- ESLint linting
- Build verification
- Test suite (when implemented)

Ensure your code passes all checks before requesting review.

## Review Process

### For Maintainers

1. Check code quality and style
2. Verify tests are included
3. Ensure documentation is updated
4. Test functionality locally
5. Merge once approved

### For Contributors

- Address all feedback
- Push updates to the same PR branch
- Thank reviewers for their time

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes (1.0.0)
- **MINOR**: New features (1.1.0)
- **PATCH**: Bug fixes (1.1.1)

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag: `git tag v1.1.0`
4. Push tag: `git push origin v1.1.0`
5. GitHub automatically creates release

## License

By contributing, you agree your code is licensed under the MIT License.

## Questions?

- Check existing issues/PRs
- Review documentation in `docs/` folder
- Create a new discussion on GitHub
- Contact maintainers

## Areas We're Looking For Help

- [ ] Backend API integration
- [ ] Database schema design
- [ ] Payment processing
- [ ] Email notifications
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Admin dashboard
- [ ] Analytics integration
- [ ] Testing suite
- [ ] Documentation improvements

## Thank You!

Every contribution, no matter how small, helps make this project better. Thank you for being part of the community! 🙌

---

**Created by Rachit** | Made with ❤️ for developers
