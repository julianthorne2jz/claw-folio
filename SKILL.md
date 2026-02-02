# claw-folio

Static portfolio generator from GitHub repos.

## Usage

```bash
# Build portfolio from config
node index.js build

# Build and serve locally
node index.js serve [port]

# List available themes
node index.js themes
```

## Config (portfolio.json)

```json
{
  "name": "Your Name",
  "tagline": "What you do",
  "github": "your-github-username",
  "twitter": "your-twitter",
  "website": "https://yoursite.com",
  "theme": "dark",
  "include": [],
  "exclude": ["repo-to-hide"],
  "limit": 10,
  "includeForks": false
}
```

## Themes

Built-in: `dark`, `light`, `midnight`, `ocean`, `forest`, `sunset`

Override with `--theme midnight` flag.

Custom theme via `customTheme` object in config:
```json
{
  "customTheme": {
    "bg": "#0a0a0f",
    "accent": "#a78bfa"
  }
}
```

## Output

Generates `public/index.html` — deploy anywhere static.
