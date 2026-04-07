# Coffee Chat Shuffler

A simple tool for organising monthly coffee chats. Add your team members, shuffle them into groups, and track past groupings to avoid the same people being paired up month after month.

Hosted on GitHub Pages — no backend, no accounts. Everything is stored in your browser's local storage.

## Features

- **People management** — paste a list of names (one per line) to quickly add team members
- **Archiving** — archive people who are temporarily out (e.g. on leave) so they are excluded from shuffles but their history is preserved
- **Smart shuffling** — groups are formed to minimise repeat pairings based on past history
- **Configurable group size** — pick any size per shuffle
- **History** — past shuffles are saved so repeat pairings can be avoided over time
- **Copy as Markdown** — copy any shuffle result in a format ready to paste into a chat:
  ```
  ☕ Group 1
  Alice, Bob, Carol

  ☕ Group 2
  Dave, Eve, Frank
  ```

## Usage

1. Go to the **People** tab and paste your team members, one name per line
2. Go to the **Shuffle** tab, set a group size, and hit **Shuffle**
3. Happy with the result? Hit **Save** — it gets added to history and repeat pairings will be avoided in future shuffles
4. Use **Copy as Markdown** to paste the groups directly into Slack, Teams, or wherever your team hangs out

When someone leaves the team, prefer **archiving** them over removing them. Removing a person permanently erases their pairing history, which may cause the algorithm to form previously seen groups. Archived people are excluded from future shuffles but their history is still taken into account.

## How shuffling works

Every saved shuffle is stored in history. From that history, the app builds a **pair frequency map** — a count of how many times each pair of people has ended up in the same group.

When you hit Shuffle, it generates 500 random arrangements and scores each one by summing the pair frequencies of everyone within each group. The arrangement with the lowest total score wins, meaning the one that repeats the fewest past pairings.

If no history exists yet, any random arrangement is equally valid. If the team is small enough that some overlap is unavoidable, the algorithm still picks the least-repeated option — repeats are preferred over deadlocks.

## Development

```bash
npm install
npm run dev
```

## Deployment

The app deploys automatically to GitHub Pages on every push to `main` via the included GitHub Actions workflow.

To enable it on a new repo: go to **Settings → Pages** and set the source to **GitHub Actions**.
