from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import cairosvg
import re

ROOT_URL = 'https://ptglaw.co.kr'
DEFAULT_DESC = '법률·세무·지식재산권·채권추심·등기를 하나의 해결 흐름으로 연결합니다.'
root = Path('.')
img_dir = root / 'assets' / 'images'
img_dir.mkdir(parents=True, exist_ok=True)

# Exact favicon symbol -> PNG + ICO.
svg = img_dir / 'favicon.svg'
png = img_dir / 'favicon-512.png'
ico = root / 'favicon.ico'
cairosvg.svg2png(url=str(svg), write_to=str(png), output_width=512, output_height=512)
icon = Image.open(png).convert('RGBA')
icon.save(ico, format='ICO', sizes=[(16,16),(32,32),(48,48),(64,64),(128,128),(256,256)])

# 1200x630 Open Graph card.
W, H = 1200, 630
canvas = Image.new('RGB', (W, H), '#f7f8fa')
d = ImageDraw.Draw(canvas)
d.rectangle([0, 0, W, 8], fill='#f58220')
symbol = icon.copy()
symbol.thumbnail((190, 190), Image.Resampling.LANCZOS)
canvas.paste(symbol, (112, 182), symbol)

def get_font(candidates, size):
    for p in candidates:
        if Path(p).exists():
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

bold = get_font(['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'], 72)
regular = get_font(['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'], 26)
small = get_font(['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'], 20)
x = 360
d.text((x, 190), 'PENTAGON', font=bold, fill='#181818')
d.text((x+4, 292), 'LEGAL · TAX · IP · RECOVERY · REGISTRY', font=regular, fill='#62676d')
d.line((x+4, 350, 1040, 350), fill='#d9dde2', width=2)
d.text((x+4, 382), 'ONE CONNECTED PROFESSIONAL SERVICE', font=small, fill='#f58220')
d.text((x+4, 427), 'PTG LAW OFFICE · SEOCHO, SEOUL', font=small, fill='#8a8f96')
canvas.save(img_dir / 'og-preview.png', 'PNG', optimize=True)

def capture(text, pattern, default=''):
    m = re.search(pattern, text, re.I | re.S)
    return m.group(1).strip() if m else default

def esc(value):
    return value.replace('&', '&amp;').replace('"', '&quot;')

for path in root.rglob('*.html'):
    if '.git' in path.parts:
        continue
    text = path.read_text(encoding='utf-8')
    if '</head>' not in text.lower():
        continue

    managed = [
        r'\s*<link[^>]+rel=["\'](?:icon|shortcut icon|apple-touch-icon)["\'][^>]*>',
        r'\s*<meta[^>]+property=["\']og:site_name["\'][^>]*>',
        r'\s*<meta[^>]+property=["\']og:image(?::width|:height|:alt)?["\'][^>]*>',
        r'\s*<meta[^>]+name=["\']twitter:(?:card|title|description|image)["\'][^>]*>',
        r'\s*<meta[^>]+name=["\']theme-color["\'][^>]*>',
    ]
    for pattern in managed:
        text = re.sub(pattern, '', text, flags=re.I)

    title = capture(text, r'<title>(.*?)</title>', '펜타곤 법률세무회계')
    desc = capture(text, r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']', DEFAULT_DESC)
    canonical = capture(text, r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\'](.*?)["\']', ROOT_URL + '/')

    tags = [
        f'<link rel="icon" type="image/svg+xml" href="{ROOT_URL}/assets/images/favicon.svg">',
        f'<link rel="shortcut icon" href="{ROOT_URL}/favicon.ico">',
        f'<link rel="apple-touch-icon" href="{ROOT_URL}/assets/images/favicon-512.png">',
        '<meta name="theme-color" content="#f58220">',
        '<meta property="og:site_name" content="펜타곤 법률세무회계">',
        f'<meta property="og:image" content="{ROOT_URL}/assets/images/og-preview.png">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        '<meta property="og:image:alt" content="펜타곤 법률세무회계">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{esc(title)}">',
        f'<meta name="twitter:description" content="{esc(desc)}">',
        f'<meta name="twitter:image" content="{ROOT_URL}/assets/images/og-preview.png">',
    ]
    if not re.search(r'property=["\']og:title["\']', text, re.I):
        tags.append(f'<meta property="og:title" content="{esc(title)}">')
    if not re.search(r'property=["\']og:description["\']', text, re.I):
        tags.append(f'<meta property="og:description" content="{esc(desc)}">')
    if not re.search(r'property=["\']og:type["\']', text, re.I):
        tags.append('<meta property="og:type" content="website">')
    if not re.search(r'property=["\']og:url["\']', text, re.I):
        tags.append(f'<meta property="og:url" content="{esc(canonical)}">')

    block = '\n  ' + '\n  '.join(tags) + '\n'
    text = re.sub(r'</head>', block + '</head>', text, count=1, flags=re.I)
    path.write_text(text, encoding='utf-8')
