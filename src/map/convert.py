"""Turn raw Overpass JSON into one compact JS data file for the prototype's own map renderer.
Coordinates are integers in units of 1e-5 degrees from an origin, shapes are simplified (Douglas-Peucker)."""
import json, os, sys, math

HERE = os.path.dirname(os.path.abspath(__file__))
LAT0, LON0, S = 10.93, 76.88, 100000

def load(name):
    p = os.path.join(HERE, name + '.json')
    try:
        with open(p) as f:
            t = f.read()
        return json.loads(t)['elements'] if t.lstrip().startswith('{') else []
    except Exception:
        return []

def dp(pts, tol):
    if len(pts) < 3: return pts
    keep = [False] * len(pts); keep[0] = keep[-1] = True
    st = [(0, len(pts) - 1)]
    while st:
        a, b = st.pop()
        (x1, y1), (x2, y2) = pts[a], pts[b]
        dx, dy = x2 - x1, y2 - y1
        L = math.hypot(dx, dy) or 1e-9
        dm, idx = 0, -1
        for i in range(a + 1, b):
            d = abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / L
            if d > dm: dm, idx = d, i
        if dm > tol and idx > 0:
            keep[idx] = True; st.append((a, idx)); st.append((idx, b))
    return [p for p, k in zip(pts, keep) if k]

def enc(geom, tol):
    pts = [(round((g['lon'] - LON0) * S), round((g['lat'] - LAT0) * S)) for g in geom]
    pts = dp(pts, tol)
    out, px, py = [], 0, 0
    for x, y in pts:                      # delta encode: small numbers, short file
        out.append(f"{x - px},{y - py}"); px, py = x, y
    return ' '.join(out)

CLASS = {'motorway': 'm', 'trunk': 'm', 'primary': 'p', 'secondary': 's', 'tertiary': 't',
         'residential': 'r', 'unclassified': 'r', 'living_street': 'r'}
roads, rail, water, green, minor = [], [], [], [], []
names = {}

for e in load('major'):
    if e.get('type') != 'way' or 'geometry' not in e: continue
    t = e.get('tags', {})
    if 'highway' in t:
        c = CLASS.get(t['highway'])
        if c: roads.append([c, t.get('name', ''), enc(e['geometry'], 8)])
    elif t.get('railway') == 'rail':
        rail.append(enc(e['geometry'], 12))

for e in load('minor'):
    if e.get('type') != 'way' or 'geometry' not in e: continue
    if 'highway' in e.get('tags', {}): minor.append(enc(e['geometry'], 10))

for e in load('water'):
    if e.get('type') != 'way' or 'geometry' not in e: continue
    t = e.get('tags', {})
    if t.get('natural') == 'water':
        if len(e['geometry']) >= 4: water.append(['a', enc(e['geometry'], 10)])
    elif 'waterway' in t:
        water.append(['l', enc(e['geometry'], 10)])
    elif t.get('leisure') in ('park', 'garden') or t.get('landuse') in ('forest', 'grass', 'recreation_ground'):
        if len(e['geometry']) >= 4: green.append(enc(e['geometry'], 10))

js = ("/* Coimbatore basemap data: roads, rail, water and green space from OpenStreetMap (© OpenStreetMap contributors, ODbL).\n"
      "   Fetched once via the Overpass API and simplified; the prototype draws it itself, so the map never depends on a tile server.\n"
      "   Coordinates: integers in 1e-5 degrees, delta-encoded from (lat0, lon0). Classes: m motorway/trunk, p primary, s secondary, t tertiary, r minor. */\n"
      "const MAPDATA = " + json.dumps({'o': [LAT0, LON0], 's': S, 'roads': roads, 'minor': minor, 'rail': rail, 'water': water, 'green': green}, separators=(',', ':')) + ";\n")
out = os.path.join(sys.argv[1] if len(sys.argv) > 1 else HERE, 'coimbatore.js')
with open(out, 'w') as f: f.write(js)
print(out, len(js), 'bytes', {k: len(v) for k, v in [('roads', roads), ('minor', minor), ('rail', rail), ('water', water), ('green', green)]})
