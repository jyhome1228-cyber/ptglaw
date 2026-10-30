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

# 1200x630 brand-only Open Graph card: true Pentagon symbol in white.
# Extract the existing vector symbol instead of redrawing it.
import io
import xml.etree.ElementTree as ET

W, H = 1200, 630
orange = '#f58220'
canvas = Image.new('RGB', (W, H), orange)
logo_tree = ET.parse(img_dir / 'logo.svg')
logo_root = logo_tree.getroot()
namespace = {'svg': 'http://www.w3.org/2000/svg'}
symbol_group = logo_root.find('svg:g', namespace)
if symbol_group is None:
    raise RuntimeError('Pentagon logo symbol was not found')

symbol_paths = []
for path_el in symbol_group.findall('svg:path', namespace):
    d_path = path_el.attrib.get('d', '')
    if d_path:
        symbol_paths.append(f'<path fill="#ffffff" d="{d_path}"/>')

symbol_svg = (
    '<svg xmlns="http://www.w3.org/2000/svg" width="154" height="145" '
    'viewBox="0 0 154 145">'
    + ''.join(symbol_paths) + '</svg>'
)
symbol_buffer = io.BytesIO()
cairosvg.svg2png(
    bytestring=symbol_svg.encode('utf-8'),
    write_to=symbol_buffer,
    output_width=340,
    output_height=320,
)
symbol = Image.open(io.BytesIO(symbol_buffer.getvalue())).convert('RGBA')
canvas.paste(symbol, ((W - symbol.width) // 2, (H - symbol.height) // 2), symbol)

SOCIAL_NAME = 'social-orange-symbol-20261030.png'
canvas.save(img_dir / SOCIAL_NAME, 'PNG', optimize=True)
# Keep legacy path correct as well, in case a social crawler has it cached.
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
        f'<meta property="og:image" content="{ROOT_URL}/assets/images/social-orange-symbol-20261030.png">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        '<meta property="og:image:alt" content="펜타곤 법률세무회계">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{esc(title)}">',
        f'<meta name="twitter:description" content="{esc(desc)}">',
        f'<meta name="twitter:image" content="{ROOT_URL}/assets/images/social-orange-symbol-20261030.png">',
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
