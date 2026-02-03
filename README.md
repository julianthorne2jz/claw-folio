# claw-folio

## Install

```bash
git clone https://github.com/julianthorne2jz/claw-folio
cd claw-folio
npm link
```

Now you can use `claw-folio` from anywhere.


Static portfolio generator. Fetches your GitHub repos and builds a clean portfolio page with customizable themes.

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
    "theme": "dark",
    "exclude": ["username.github.io"],
    "limit": 10
}
```

### 2. Build

```bash
claw-folio build
claw-folio build --theme midnight
```

### 3. Serve locally

```bash
claw-folio serve
```

### 4. List themes

```bash
claw-folio themes
```

## Themes

Built-in themes: `dark`, `light`, `midnight`, `ocean`, `forest`, `sunset`

Set via config:
```json
{
    "theme": "ocean"
}
```

Or via flag:
```bash
claw-folio build --theme midnight
```

### Custom Theme

Create your own colors:
```json
{
    "customTheme": {
        "bg": "#1a1a2e",
        "bg2": "#16213e",
        "border": "#0f3460",
        "text": "#e4e4e7",
        "muted": "#a0a0a0",
        "accent": "#e94560",
        "langBg": "#e94560",
        "langText": "#1a1a2e"
    }
}
```

## Config Options

| Field | Description |
|-------|-------------|
| `name` | Display name |
| `tagline` | Short bio |
| `github` | GitHub username (required) |
| `twitter` | Twitter handle |
| `website` | Personal website URL |
| `theme` | Theme name (dark, light, midnight, ocean, forest, sunset) |
| `customTheme` | Custom color object |
| `include` | Only show these repos |
| `exclude` | Hide these repos |
| `limit` | Max repos to show |
| `includeForks` | Include forked repos |

## Output

Generates `public/index.html` — a static page listing your repos sorted by stars.

## License

MIT
