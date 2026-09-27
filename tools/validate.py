#!/usr/bin/env python3
"""Re-parse every rendered card and check it for the things a renderer forgives.

The lints in lint.py read the source. This reads the *output*, which is the only
place three of the failures are visible at all:

  duplicate attribute   a helper emitted an attribute and the recipe asked for
                        it again. Lenient parsers accept it and a strict one
                        refuses, so the card works in the browser you tested and
                        not in the one a reader has.
  numeric paint         a parameter meant to be a colour arrived as a number, and
                        `fill="1"` is a colour nobody can see.
  bad point list        a polygon carrying a command letter, or an odd number of
                        coordinates.

Run:  python3 tools/validate.py [tools/.out/cards.json]
"""
import json
import os
import re
import sys
import xml.etree.ElementTree as ET

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT = os.path.join(HERE, '.out', 'cards.json')

NUMERIC_PAINT = re.compile(r'\s(?:fill|stroke)="(?:[0-9.]+)"')
POINT_LIST = re.compile(r'<polygon points="([^"]*)"')


def check(cards, label):
    bad = []
    for c in cards:
        svg = c['svg']
        try:
            ET.fromstring(svg)
        except Exception as exc:
            bad.append((c['id'], 'malformed XML: ' + str(exc)[:70]))
        for m in NUMERIC_PAINT.finditer(svg):
            bad.append((c['id'], 'numeric paint: ' + svg[max(0, m.start() - 34):m.end() + 14]))
        for m in POINT_LIST.finditer(svg):
            nums = re.split(r'[\s,]+', m.group(1).strip())
            if len(nums) % 2 or not all(re.match(r'^-?\d+(\.\d+)?$', v or '') for v in nums):
                bad.append((c['id'], 'bad point list: ' + m.group(1)[:60]))

    print('%s: %d cards' % (label, len(cards)))
    print('  problems: %d' % len(bad))
    for b in bad[:14]:
        print('    - %s  %s' % b)
    return len(bad)


def main(paths):
    if not paths:
        paths = [DEFAULT]
    total = 0
    for p in paths:
        if not os.path.exists(p):
            print('%s: missing — run: node tools/snapshot.js' % p)
            return 1
        total += check(json.load(open(p, encoding='utf-8')), os.path.basename(p))
    return 1 if total else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
