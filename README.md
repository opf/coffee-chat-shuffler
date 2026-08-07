# Coffee Chat Shuffler

A simple tool for organising monthly coffee chats. Add your team members, shuffle them into groups, and track past groupings to avoid the same people being paired up month after month.

Hosted on GitHub Pages — no backend, no accounts. Everything is stored in your browser's local storage.

## Features

- **People management** — paste a list of names (one per line) to quickly add team members
- **Archiving** — archive people who are temporarily out (e.g. on leave) so they are excluded from shuffles but their history is preserved
- **Smart shuffling** — groups are formed to minimise repeat pairings based on past history
- **Configurable group size** — pick any size per shuffle
- **History** — past shuffles are saved so repeat pairings can be avoided over time
- **Matrix IDs** — each person gets a Matrix ID, guessed from their name using OpenProject's convention (`@f.lastname:openproject.org`) and overridable per person. Domain name is currently hardcoded in file `src/matrix.ts` as `MATRIX_DOMAIN`.
- **Copy for Element** — copy a saved shuffle with Matrix mentions when pasted into Element or other matrix client that supports it, or as plain markdown anywhere else:
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
4. On the **History** tab, use **Copy for Element** to paste a saved shuffle into Element as clickable mentions (plain markdown elsewhere)

> **Note:** the Matrix mentions only paste as pills in **Chromium-based browsers** (Chromium, Vivaldi, [etc.](https://en.wikipedia.org/wiki/Chromium_(web_browser)#Browsers_based_on_Chromium)). This is a browser limitation with no known workaround.

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
