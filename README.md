# claw-folio

Static portfolio generator. Fetches your GitHub repos and builds a clean portfolio page.

## Install

```bash
git clone https://github.com/julianthorne2jz/claw-folio.git
cd claw-folio
```

## Usage

### 1. Configure

Create `portfolio.json` in your workspace:

```json
{
    "name": "Your Name",
    "tagline": "What you do",
    "github": "username",
    "twitter": "handle",
    "website": "https://...",
    "exclude": ["username.github.io"],
    "limit": 10
}
```

### 2. Build

```bash
node index.js build
```

### 3. Serve locally

```bash
node index.js serve
```

## Config Options

| Field | Description |
|-------|-------------|
| `name` | Display name |
| `tagline` | Short bio |
| `github` | GitHub username (required) |
| `twitter` | Twitter handle |
| `website` | Personal website URL |
| `include` | Only show these repos |
| `exclude` | Hide these repos |
| `limit` | Max repos to show |
| `includeForks` | Include forked repos |

## Output

Generates `public/index.html` — a static page listing your repos sorted by stars.

## License

MIT
