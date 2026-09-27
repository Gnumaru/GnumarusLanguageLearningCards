#!/usr/bin/env python3
"""Contact sheets: one page per category, so a category can be judged at a glance.

    python3 tools/sheet.py [cards.json] [outdir]

A run of cards that all look the same is a bug in the recipes, not a style, and
it is much easier to see side by side than one card at a time. This is how the
six-identical-fish problem was found, and how the last batch was reviewed: five
garden tools all drawn as the same hammer, four kinds of fog as the same three
white bars, and every room in the house drawn as the same television. None of
those are duplicate *markup*, so no automated check could see them.

Read the first sheet, then sheet.py --groups to get the worst offenders in one
image.
"""
import json
import os
import sys
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_CARDS = os.path.join(HERE, '.out', 'cards.json')

COLS = 8
CELL = 116
PAD = 8
LABEL = 16


def sheet(rows, path, title):
    cw = CELL + PAD
    head = 34
    h = head + ((len(rows) + COLS - 1) // COLS) * (CELL + PAD + LABEL)
    out = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d">'
        % (COLS * cw + PAD, h, COLS * cw + PAD, h),
        '<rect width="100%%" height="100%%" fill="#0b1020"/>',
        '<text x="%d" y="22" font-family="ui-sans-serif,system-ui" font-size="15" fill="#e2e8f0">'
        '%s &#183; %d cards</text>' % (PAD, escape(title), len(rows)),
    ]
    for i, (word, svg) in enumerate(rows):
        x = PAD + (i % COLS) * cw
        y = head + (i // COLS) * (CELL + PAD + LABEL)
        out.append('<rect x="%d" y="%d" width="%d" height="%d" rx="6" fill="#f8fafc"/>'
                   % (x, y, CELL, CELL))
        # A nested <svg> needs an explicit size. With only a viewBox it fills
        # the whole page and the card is lost behind it.
        sized = svg.replace('<svg ', '<svg width="120" height="120" ', 1)
        out.append('<g transform="translate(%d %d) scale(%.4f)">%s</g>'
                   % (x, y, CELL / 120.0, sized))
        out.append('<text x="%d" y="%d" font-family="ui-monospace,monospace" font-size="10" '
                   'fill="#94a3b8">%s</text>' % (x + 2, y + CELL + 12, escape(word[:18])))
    out.append('</svg>')
    with open(path, 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(out))
    return path


def main(argv):
    # Flags are not positional arguments; taking argv[0] blindly meant
    # `sheet.py --groups` tried to open a file called "--groups".
    positional = [a for a in argv if not a.startswith('--')]
    cards_path = positional[0] if positional else DEFAULT_CARDS
    if not os.path.exists(cards_path):
        print('%s: missing — run: node tools/snapshot.js' % cards_path)
        return 1
    outdir = positional[1] if len(positional) > 1 else os.path.join(HERE, '.out', 'sheets')
    os.makedirs(outdir, exist_ok=True)
    for f in os.listdir(outdir):
        if f.endswith('.svg'):
            os.remove(os.path.join(outdir, f))

    data = json.load(open(cards_path, encoding='utf-8'))
    by_cat = {}
    for o in data:
        by_cat.setdefault(o['cat'], []).append((o['id'], o['svg']))

    if '--groups' in argv:
        # the categories holding the most cards, which is where a shared shape
        # is most likely to have gone unnoticed
        worst = sorted(by_cat.items(), key=lambda kv: -len(kv[1]))[:8]
        rows = []
        for cat, cards in worst:
            rows += cards
        path = sheet(rows, os.path.join(outdir, 'largest-groups.svg'),
                     'the eight largest categories')
        print('one sheet: ' + path.replace(os.path.dirname(os.path.abspath(__file__)) + '/', ''))
        return 0

    names = []
    for cat in sorted(by_cat):
        names.append(sheet(by_cat[cat], os.path.join(outdir, cat + '.svg'), cat))
    print('%d contact sheets in %s' % (len(names), outdir.replace(os.path.dirname(os.path.abspath(__file__)) + '/', '')))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
