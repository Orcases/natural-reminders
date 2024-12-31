# Natural Reminder

## Requirement

I want to create a chrome extension for creating reminders in natural language. Here are some additional ways users might try to create reminders:

### Time-Based

#### Specific Date & Time
- "Remind me on February 24th at 10 AM about my doctor's appointment."
- "Set a reminder for tomorrow at 8 PM to call mom."

#### Day of the Week
- "Remind me on Monday to submit the report."
- "Every Saturday at 9 AM, remind me to take out the trash."

#### Recurring
- "Remind me every morning at 7 AM to take my medicine."
- "Set a weekly reminder for Thursday evening yoga."

#### Relative Time
- "In 2 hours, remind me to check the oven."
- "Remind me in 30 minutes to drink water."

### Event-Based

#### Linked to Other Events
- "Remind me 1 hour before my flight to pack snacks."
- "When the meeting ends, remind me to send a follow-up email."

#### Conditional
- "If it rains tomorrow, remind me to cancel the picnic."
- "Remind me to charge my laptop before I leave for work."

### Activity/Context-Based

#### Task-Oriented
- "Remind me to pick up groceries when I leave work."
- "Remind me to call Sarah after the meeting."

#### Location-Based
- "When I get to the office, remind me to talk to John."
- "Remind me to buy milk when I'm near a supermarket."

### Casual/Natural Language Variants

#### Short & Simple
- "Dinner with Alex tomorrow."
- "Dentist appointment at 3 PM."

#### Chatty Style
- "Hey, don't let me forget about my anniversary next week."
- "Please nudge me about the game tonight."

#### Misspelled/Slang
- "Rmndr for tmw 2pm mtg."
- "Remind @ 5 go gym."

### Use Case Scenarios to Consider

#### Urgent Tasks
- "Emergency call at noon tomorrow."
- "Ping me at 10 to prep slides."

#### Hobbies & Personal Time
- "Remind me to water plants every Sunday."
- "Don't let me miss my workout at 6 PM."

#### Family & Friends
- "Mom's birthday tomorrow. Don't forget!"

By supporting flexibility in phrasing, context (time, location, activity), and structure, your extension will appeal to a broader audience.

## Natural Language Processing

To convert natural language inputs into structured JSON data with fields for date, time, and description, you can use a Natural Language Processing (NLP) pipeline. Here's a breakdown of the best approach:

### Steps

#### Tokenize and Parse Input
- Use NLP libraries like Duckling, spaCy, or Chrono.js for parsing dates, times, and other context-sensitive entities from text.

#### Handle Missing Time/Date
- If the input doesn't specify a time (e.g., "tomorrow"), set a default (e.g., 12:00 PM or a user-configurable setting).
- If a relative time is given (e.g., "in 2 hours"), calculate the exact timestamp.

#### Output as JSON
After processing, create a JSON object with these fields:
- `date`: The resolved date in YYYY-MM-DD format.
- `time`: The resolved time in HH:MM 24-hour format.
- `description`: The parsed reminder text excluding the date/time information.

### Example Conversion

**Input:**
```markdown
"Remind me tomorrow at 10 AM to call John."
```

**JSON:**
```json
{
    "date": "2024-12-29",
    "time": "10:00",
    "description": "Call John"
}
```

### Implementation Idea

Using Chrono.js (JavaScript Example):

```javascript
const chrono = require('chrono-node');

function parseReminder(input) {
    const parsed = chrono.parseDate(input);
    const now = new Date();

    return {
        date: parsed.toISOString().split('T')[0],
        time: parsed.toISOString().split('T')[1].slice(0, 5),
        description: input.replace(chrono.parse(input)[0].text, '').trim()
    };
}

const input = "Remind me tomorrow at 10 AM to call John.";
console.log(parseReminder(input));
```

**Result:**
```json
{
    "date": "2024-12-29",
    "time": "10:00",
    "description": "Call John"
}
```

### Benefits
- Chrono.js and similar libraries handle relative dates (e.g., "tomorrow", "in 3 hours") and different formats automatically.
- You can extend it to handle custom keywords like "every day", "weekly", etc.

## Tech Stack

### Core Tech Stack

#### Frontend (UI/Popup/Options Page)
- HTML: For structuring the interface
- CSS (or TailwindCSS): For styling the extension interface
- JavaScript (or TypeScript): For interactive behaviors

#### Backend (Data Processing)
- Use in-browser APIs or a lightweight server if processing is required
- Node.js + Express (optional): For server-side tasks if you need external integrations or advanced processing

#### Storage
- Chrome Storage API: Native storage for saving reminders locally or syncing them with the user's account
- IndexedDB: For more complex local data management

#### NLP (Natural Language Processing)
- Chrono.js: For parsing dates and times directly in JavaScript
- Duckling (via API): For advanced NLP tasks like relative date parsing (requires a backend)
- OpenAI APIs (optional): For more natural language understanding

### Recommended Architecture

#### Manifest v3
- The latest version with enhanced security and performance for Chrome extensions
- Core files:
  - `manifest.json`: Extension configuration
  - `background.js`: Handles long-running tasks (event-driven in v3)
  - `content.js`: Injects scripts into webpages (if needed)
  - `popup.html`: Main UI users interact with

#### Event Handling
- Use service workers in Manifest v3 to manage background tasks (e.g., handling reminders)

#### APIs
- Notifications API: For creating reminders
- Alarms API: For triggering reminders at specific times
- Storage API: For persisting reminders

### Example Tech Choices

#### UI Frameworks
- React (with react-chrome-extension-boilerplate): If you prefer a dynamic and modern UI
- Vanilla JS: Lightweight and sufficient for basic extensions

#### NLP
- Chrono.js: Parse natural language dates/times in the browser
- Duckling (Python/Node.js): Advanced NLP parsing (requires backend hosting)
- OpenAI GPT API: For complex, conversational inputs (e.g., parsing "remind me next full moon")

#### Build Tools
- Vite: For bundling your extension efficiently

#### Testing
- Jest: For unit tests
- Selenium/Playwright: For end-to-end testing of UI workflows
