#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const args = process.argv.slice(2);
const command = args[0];

// Parse flags
function getFlag(name) {
    const idx = args.findIndex(a => a === `--${name}` || a === `-${name[0]}`);
    if (idx !== -1 && args[idx + 1]) return args[idx + 1];
    return null;
}

// Parse --config flag
let configPath = getFlag('config') || 'portfolio.json';
const CONFIG_PATH = path.resolve(process.cwd(), configPath);
const OUTPUT_DIR = path.join(process.cwd(), 'public');

// Built-in themes
const THEMES = {
    dark: {
        bg: '#0d1117',
        bg2: '#161b22',
        border: '#30363d',
        text: '#c9d1d9',
        muted: '#8b949e',
        accent: '#58a6ff',
        langBg: '#58a6ff',
        langText: '#0d1117'
    },
    light: {
        bg: '#ffffff',
        bg2: '#f6f8fa',
        border: '#d0d7de',
        text: '#24292f',
        muted: '#57606a',
        accent: '#0969da',
        langBg: '#0969da',
        langText: '#ffffff'
    },
    midnight: {
        bg: '#0a0a0f',
        bg2: '#12121a',
        border: '#2a2a3a',
        text: '#e4e4e7',
        muted: '#71717a',
        accent: '#a78bfa',
        langBg: '#a78bfa',
        langText: '#0a0a0f'
    },
    ocean: {
        bg: '#0c1929',
        bg2: '#132337',
        border: '#1e3a5f',
        text: '#e2e8f0',
        muted: '#94a3b8',
        accent: '#38bdf8',
        langBg: '#38bdf8',
        langText: '#0c1929'
    },
    forest: {
        bg: '#0f1a0f',
        bg2: '#162016',
        border: '#2d4a2d',
        text: '#d4e7d4',
        muted: '#8fbc8f',
        accent: '#4ade80',
        langBg: '#4ade80',
        langText: '#0f1a0f'
    },
    sunset: {
        bg: '#1a0f0f',
        bg2: '#261414',
        border: '#4a2d2d',
        text: '#f5e6e6',
        muted: '#d4a5a5',
        accent: '#fb923c',
        langBg: '#fb923c',
        langText: '#1a0f0f'
    }
};

// Fetch JSON from URL
function fetchJson(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, { headers: { 'User-Agent': 'claw-folio/1.0' } }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
}

// Fetch GitHub repos for a user
async function fetchRepos(username) {
    const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;
    return fetchJson(url);
}

// Get theme from config or flag
function getTheme(config, themeFlag) {
    const themeName = themeFlag || config.theme || 'dark';
    
    // Check if it's a built-in theme
    if (THEMES[themeName]) {
        return THEMES[themeName];
    }
    
    // Check if config has custom theme object
    if (config.customTheme && typeof config.customTheme === 'object') {
        return { ...THEMES.dark, ...config.customTheme };
    }
    
    // Default to dark
    console.log(`Theme '${themeName}' not found. Using 'dark'.`);
    return THEMES.dark;
}

// Template
function template(config, projects, theme) {
    const projectsHtml = projects.map(p => `
        <div class="project">
            <h3><a href="${p.html_url}">${p.name}</a></h3>
            <p>${p.description || 'No description'}</p>
            <div class="meta">
                ${p.language ? `<span class="lang">${p.language}</span>` : ''}
                <span>⭐ ${p.stargazers_count}</span>
                <span>🍴 ${p.forks_count}</span>
            </div>
        </div>
    `).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.name || 'Portfolio'}</title>
    <style>
        :root{--bg:${theme.bg};--bg2:${theme.bg2};--border:${theme.border};--text:${theme.text};--muted:${theme.muted};--accent:${theme.accent};--lang-bg:${theme.langBg};--lang-text:${theme.langText}}
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--text);max-width:900px;margin:0 auto;padding:2rem 1.5rem;line-height:1.6}
        a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}
        header{text-align:center;margin-bottom:3rem}
        header h1{font-size:2rem;margin-bottom:.5rem}
        header p{color:var(--muted)}
        .links{margin-top:1rem}
        .links a{margin:0 .75rem;font-size:.9rem}
        .projects{display:grid;gap:1.5rem}
        .project{background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:1.5rem}
        .project h3{margin-bottom:.5rem}
        .project p{color:var(--muted);font-size:.9rem;margin-bottom:.75rem}
        .meta{font-size:.8rem;color:var(--muted)}
        .meta span{margin-right:1rem}
        .lang{background:var(--lang-bg);color:var(--lang-text);padding:.1rem .4rem;border-radius:3px}
        footer{margin-top:3rem;text-align:center;color:var(--muted);font-size:.8rem}
    </style>
</head>
<body>
    <header>
        <h1>${config.name || 'Portfolio'}</h1>
        <p>${config.tagline || ''}</p>
        <div class="links">
            ${config.github ? `<a href="https://github.com/${config.github}">GitHub</a>` : ''}
            ${config.twitter ? `<a href="https://x.com/${config.twitter}">Twitter</a>` : ''}
            ${config.website ? `<a href="${config.website}">Website</a>` : ''}
        </div>
    </header>
    <section class="projects">
        ${projectsHtml}
    </section>
    <footer>
        Generated by <a href="https://github.com/julianthorne2jz/claw-folio">claw-folio</a>
    </footer>
</body>
</html>`;
}

async function build() {
    const themeFlag = getFlag('theme');
    console.log('Building portfolio...');

    // Load config
    if (!fs.existsSync(CONFIG_PATH)) {
        console.log('Creating example portfolio.json...');
        const example = {
            name: "My Portfolio",
            tagline: "Building things.",
            github: "username",
            twitter: "",
            website: "",
            theme: "dark",
            include: [],
            exclude: ["username.github.io"]
        };
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(example, null, 2));
        console.log('Edit portfolio.json and run again.');
        return;
    }

    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    
    if (!config.github) {
        console.error('Error: github username required in portfolio.json');
        process.exit(1);
    }

    // Get theme
    const theme = getTheme(config, themeFlag);
    const themeName = themeFlag || config.theme || 'dark';
    console.log(`Using theme: ${themeName}`);

    console.log(`Fetching repos for ${config.github}...`);
    let repos = await fetchRepos(config.github);

    // Filter
    if (config.include && config.include.length > 0) {
        repos = repos.filter(r => config.include.includes(r.name));
    }
    if (config.exclude && config.exclude.length > 0) {
        repos = repos.filter(r => !config.exclude.includes(r.name));
    }

    // Remove forks unless specified
    if (!config.includeForks) {
        repos = repos.filter(r => !r.fork);
    }

    // Sort by stars
    repos.sort((a, b) => b.stargazers_count - a.stargazers_count);

    // Limit
    if (config.limit) {
        repos = repos.slice(0, config.limit);
    }

    console.log(`Found ${repos.length} projects.`);

    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const html = template(config, repos, theme);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html);
    console.log('✅ Built -> public/index.html');
}

function serve(port = 3000) {
    const server = http.createServer((req, res) => {
        const file = req.url === '/' ? '/index.html' : req.url;
        const filePath = path.join(OUTPUT_DIR, file);
        
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end('Not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    });
    
    server.listen(port, () => {
        console.log(`Serving at http://localhost:${port}`);
    });
}

function listThemes() {
    console.log('Available themes:\n');
    Object.keys(THEMES).forEach(name => {
        const t = THEMES[name];
        console.log(`  ${name.padEnd(10)} bg:${t.bg}  accent:${t.accent}`);
    });
    console.log('\nSet in portfolio.json: "theme": "midnight"');
    console.log('Or use flag: node index.js build --theme ocean');
    console.log('\nCustom theme: add "customTheme" object to portfolio.json');
}

if (command === 'build') {
    build().catch(e => { console.error('Build failed:', e.message); process.exit(1); });
} else if (command === 'serve') {
    build().then(() => serve(parseInt(args[1]) || 3000)).catch(e => console.error(e));
} else if (command === 'themes') {
    listThemes();
} else {
    console.log(`claw-folio - Static portfolio generator

Usage:
  node index.js build [--theme NAME]    Fetch repos and build site
  node index.js serve [port]            Build and serve locally
  node index.js themes                  List available themes

Options:
  --config, -c   Custom config file path (default: portfolio.json)
  --theme, -t    Theme name (dark, light, midnight, ocean, forest, sunset)

Config: portfolio.json in workspace root
  - theme: "dark"           Built-in theme name
  - customTheme: {...}      Custom colors (bg, bg2, border, text, muted, accent)
`);
}
