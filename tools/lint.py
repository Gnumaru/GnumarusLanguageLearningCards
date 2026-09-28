#!/usr/bin/env python3
"""Lints for the SVG shape vocabulary used by the art files.

The vocabulary is positional:

    c(cx, cy, r, fill, extra)                 5
    e(cx, cy, rx, ry, fill, extra)            6
    rc(x, y, w, h, fill, radius, extra)       7
    box(x, y, w, h, fill, r, edge)            7   (art-kinds.js)
    p(d, fill, extra)                         3
    ps(d, stroke, width, extra)               4
    pl(points, fill, extra)                   3
    ln(x1, y1, x2, y2, stroke, width, extra)  7

Nothing here throws. Every mistake renders *something*, and a card quietly
missing a limb looks exactly like a card drawn that way, so the lints exist
because the failures are invisible rather than because the code is unsafe.

    arity     too many arguments for a helper
    numeric   a quoted string in a slot that has to hold a number
    extra     a bare number, or an unbalanced quote, in the attribute slot
    path      a computed path with no moveto, which every renderer drops
    points    a polygon point list carrying a command letter
    dupattr   an attribute the helper already emits, which is not valid XML
    shadowed  two branches on the same condition, where the first has no body

Run:  python3 tools/lint.py [files...]
"""
import io
import os
import re
import sys

ARITY = {'c': 5, 'e': 6, 'rc': 7, 'box': 7, 'p': 3, 'ps': 4, 'pl': 3, 'ln': 7}

# A branch header: `} else if (<cond>) {` or `if (<cond>) {`, alone on its line.
BRANCH = re.compile(r'^\s*\}?\s*(?:else\s+)?if\s*\((.*)\)\s*\{\s*$')

# Slots that must hold a number. A quoted string here renders as a coordinate of
# zero or is ignored, and the card comes out wrong rather than broken.
NUMERIC = {
    'c':   {0, 1, 2},
    'e':   {0, 1, 2, 3},
    'rc':  {0, 1, 2, 3, 5},
    'box': {0, 1, 2, 3, 5},
    'ln':  {0, 1, 2, 3, 5},
    'ps':  {2},
}

# Attributes a helper already emits. Passing one again in the attribute slot
# produces a duplicate attribute, and duplicate attributes are not valid XML —
# the card renders in a lenient parser and vanishes in a strict one.
EMITTED = {
    'c':   {'fill'},
    'e':   {'fill'},
    'rc':  {'fill', 'rx', 'ry'},
    'box': {'fill', 'rx', 'ry'},
    'p':   {'fill'},
    'ps':  {'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'},
    'pl':  {'fill'},
    'ln':  {'stroke', 'stroke-width', 'stroke-linecap'},
}

# Helpers that return complete path data. A call to one of these is a finished
# path, not a fragment that still needs its moveto, so the path check below
# would otherwise flag it.
PATH_BUILDERS = ('polygon',)

NAME = '|'.join(ARITY)


def split_args(src):
    """Split a call's argument text on top-level commas."""
    out, depth, cur, quote = [], 0, '', None
    i = 0
    while i < len(src):
        ch = src[i]
        if quote:
            cur += ch
            if ch == '\\':
                cur += src[i + 1]
                i += 2
                continue
            if ch == quote:
                quote = None
        elif ch in '"\'':
            quote = ch
            cur += ch
        elif ch in '([{':
            depth += 1
            cur += ch
        elif ch in ')]}':
            depth -= 1
            cur += ch
        elif ch == ',' and depth == 0:
            out.append(cur.strip())
            cur = ''
        else:
            cur += ch
        i += 1
    if cur.strip():
        out.append(cur.strip())
    return out


def calls(src):
    """Yield (name, argtext, offset) for every helper call in the file."""
    for m in re.finditer(r'(?<![\w.$])(' + NAME + r')\s*\(', src):
        i, depth, quote = m.end(), 1, None
        while i < len(src):
            ch = src[i]
            if quote:
                if ch == '\\':
                    i += 2
                    continue
                if ch == quote:
                    quote = None
            elif ch in '"\'':
                quote = ch
            elif ch in '([{':
                depth += 1
            elif ch in ')]}':
                depth -= 1
                if depth == 0:
                    break
            i += 1
        yield m.group(1), src[m.end():i], m.start()


def first_literal(arg):
    m = re.match(r"^\s*'([^']*)'", arg)
    if m:
        return m.group(1)
    lits = re.findall(r"'([^']*)'", arg)
    return lits[0] if lits else None


def check(path):
    src = io.open(path, encoding='utf-8').read()
    problems = []

    def at(offset):
        return src.count('\n', 0, offset) + 1

    for name, argtext, offset in calls(src):
        args = split_args(argtext)
        line = at(offset)
        if len(args) > ARITY[name]:
            problems.append('%s:%d  %s() got %d args, takes %d'
                            % (path, line, name, len(args), ARITY[name]))
            continue

        for slot in sorted(NUMERIC.get(name, ())):
            if slot < len(args) and re.match(r"^\s*['\"]", args[slot]):
                problems.append('%s:%d  %s() slot %d must be a number: %s'
                                % (path, line, name, slot, args[slot][:44]))

        if len(args) == ARITY[name]:
            extra = args[-1]
            if re.fullmatch(r'[\d.]+', extra):
                problems.append('%s:%d  %s() attribute slot holds a number: %s'
                                % (path, line, name, extra))
            elif extra.count('"') % 2:
                problems.append('%s:%d  %s() attribute slot has an unbalanced quote: %s'
                                % (path, line, name, extra[:44]))
            else:
                for attr in re.findall(r'([\w-]+)=', extra):
                    if attr in EMITTED.get(name, ()):
                        problems.append('%s:%d  %s() already emits %s: %s'
                                        % (path, line, name, attr, extra[:40]))

        if name in ('p', 'ps') and args:
            head = first_literal(args[0])
            if head is not None and not re.match(r'\s*[Mm]', head):
                problems.append('%s:%d  %s() path has no command: %r'
                                % (path, line, name, head[:40]))
            elif head is None:
                # A bare identifier, or a call to a helper that returns whole
                # path data, already holds a complete path. Prefixing it would
                # give d="MM..." and draw nothing at all.
                bare = re.match(r"^\s*[A-Za-z_$][\w.$]*\s*$", args[0])
                built = any(re.match(r"^\s*(?:'M'\s*\+\s*)?%s\s*\(" % h, args[0])
                            for h in PATH_BUILDERS)
                if not bare and not built:
                    problems.append('%s:%d  %s() computed path may be missing M: %s'
                                    % (path, line, name, args[0].replace('\n', ' ')[:52]))

    for m in re.finditer(r"pl\('([^']*)'", src):
        pts = m.group(1)
        if re.match(r'^\s*[MmZz]', pts):
            problems.append('%s:%d  polygon point list starts with a command: %r'
                            % (path, at(m.start()), pts[:40]))

    problems += shadowed_branches(src, path, at)
    problems += pinned_points(src, path)

    return problems


# A table entry that draws a shape from a list of numbers typed out by hand, at a
# fixed spot, instead of from the centre it was handed.
HARDCODED_POINTS = re.compile(r"""return pl\('[\d., ]+'""")
def pinned_points(src, path):
    """A shape table entry that ignores the centre it was given.

    Four of them did. `SHAPE.star` was a hand-written point list that was a
    **lightning bolt** and ignored x and y, so every star in the deck was the same
    bolt in the same place; `BADGE.hourglass` was a five-point list with two
    vertices repeated, which is not an hourglass.

    Nothing else could have caught it. The point list was syntactically valid —
    an even number of numeric coordinates — so `validate.py` passed it, and it
    was the only shape in the deck, so no duplicate check fired. A polygon being
    *well formed* is not the same as being the *right shape*, and the gap between
    those two is where this lived.
    """
    problems = []
    for table in re.finditer(r'^  var ([A-Z][A-Z0-9_]*) = \{', src, re.M):
        name = table.group(1)
        end = src.find('\n  };', table.end())
        if end == -1:
            continue
        body = src[table.end():end]
        for entry in re.split(r'^    (?=\w+: function)', body, flags=re.M)[1:]:
            head = entry.split('\n')[0]
            m = re.match(r'(\w+): function \(([^)]*)\)', head)
            if not m:
                continue
            coords = [p.strip() for p in m.group(2).split(',') if p.strip() in ('x', 'y')]
            if not coords:
                continue
            body_text = entry[len(head):]
            if HARDCODED_POINTS.search(body_text):
                line = src.count('\n', 0, table.end() + body.find(entry)) + 1
                problems.append('%s:%d  %s.%s draws a fixed point list and ignores %s'
                                % (path, line, name, m.group(1), ' and '.join(coords)))
    return problems


def shadowed_branches(src, path, at):
    """Branches that can never run.

    Two `else if` headers on the same condition, back to back. The first one is
    taken whenever the condition holds, so the second — the one with the actual
    drawing in it — never runs. It parses, every other check passes, and the card
    comes out blank.

    This was in the tree twice, both times as a copy-paste accident, both times
    producing a card that drew nothing but its shadow: `emergency` (medical) and
    `lightswitch` (household). Nothing else in the harness can see it, because
    from the outside the shape *is* a known one — the branch list is satisfied.
    """
    problems = []
    lines = src.split('\n')
    for i in range(len(lines) - 1):
        a, b = BRANCH.match(lines[i]), BRANCH.match(lines[i + 1])
        if a and b and a.group(1).strip() == b.group(1).strip():
            problems.append('%s:%d  branch on %r is immediately repeated, so the second never runs'
                            % (path, i + 2, a.group(1).strip()[:60]))
    return problems


def main(paths):
    if not paths:
        here = os.path.dirname(os.path.abspath(__file__))
        js = os.path.join(here, '..', 'assets', 'js')
        paths = [os.path.join(js, f) for f in sorted(os.listdir(js)) if f.startswith('art') and f.endswith('.js')]

    problems = []
    for p in paths:
        problems += check(p)
    for pr in problems:
        print(pr)
    print('lint problems: %d' % len(problems))
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
