/**
 * The skeleton of a card: everything that says *where* a mark is, and nothing
 * that says what colour it is.
 *
 * This is the metric behind the recolour check. Two cards that draw the same
 * marks in the same places are the same picture in different paint, and a
 * learner cannot tell them apart — but their markup differs, so a duplicate
 * check that compares markup says nothing.
 *
 * Numbers are rounded to one decimal place. A recomputed coordinate is a
 * string, sometimes `60` and sometimes `60.0`; without rounding the comparison
 * is stricter than the thing it is trying to measure.
 */

/** Attributes that place a mark. Everything else on an element is paint. */
const GEOMETRY = {
  rect: ['x', 'y', 'width', 'height', 'rx', 'ry'],
  circle: ['cx', 'cy', 'r'],
  ellipse: ['cx', 'cy', 'rx', 'ry'],
  line: ['x1', 'y1', 'x2', 'y2'],
  path: ['d'],
  polygon: ['points'],
  polyline: ['points'],
  text: ['x', 'y'],
  g: ['transform']
};

function skeletonOf(svg) {
  const out = [];
  for (const m of svg.matchAll(/<(\w+)\b([^>]*)\/?>/g)) {
    const tag = m[1];
    if (tag === 'svg') continue;
    const keys = GEOMETRY[tag];
    if (!keys) continue;
    const attrs = {};
    for (const a of m[2].matchAll(/([\w:-]+)="([^"]*)"/g)) attrs[a[1]] = a[2];
    const parts = keys.map((k) => {
      if (attrs[k] === undefined) return '';
      const v = attrs[k];
      if (k === 'd' || k === 'points' || k === 'transform') return k + '=' + v;
      const num = Number(v);
      return k + '=' + (Number.isFinite(num) ? Math.round(num * 10) / 10 : v);
    });
    out.push(tag + '{' + parts.join(',') + '}');
  }
  return out.join(' ');
}

/** The skeleton as a set, for the similarity measure in similarity.js. */
function marksOf(svg) {
  return new Set(skeletonOf(svg).split(' ').filter(Boolean));
}

/**
 * How alike two skeletons are, 0 to 1.
 *
 * Equality is the special case that matters most, but equality is not the whole
 * problem: two tables differing by one drawer are not equal and are still
 * indistinguishable. Jaccard over the mark sets finds the near-misses that an
 * equality test cannot see.
 */
function similarity(a, b) {
  if (a === b) return 1;
  const A = a instanceof Set ? a : marksOf(a);
  const B = b instanceof Set ? b : marksOf(b);
  if (!A.size || !B.size) return 0;
  let shared = 0;
  const [small, large] = A.size < B.size ? [A, B] : [B, A];
  for (const m of small) if (large.has(m)) shared++;
  return shared / (A.size + B.size - shared);
}

module.exports = { skeletonOf, marksOf, similarity, GEOMETRY };
