// Static bug-check script for index.html
// Each check is red-capable: exits non-zero if the bug is present

const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

let bugs = [];

// BUG-1: Parallax JS sets heroMock.style.transform, which overwrites the
// CSS keyframe animation on .floaty. Any scroll event kills the animation.
if (/heroMock\.style\.transform/.test(html) && /\.floaty/.test(html)) {
  bugs.push({
    id: 'BUG-1',
    severity: 'HIGH',
    title: 'Parallax JS kills floaty CSS animation on scroll',
    detail: 'heroMock.style.transform (inline) overrides @keyframes floaty transform. ' +
            'Animation freezes on first scroll.',
    line: html.split('\n').findIndex(l => l.includes('heroMock.style.transform')) + 1,
    fix: 'Use translateY offset on a wrapper, or apply the parallax via CSS --parallax-offset variable + calc() so both transforms can coexist.'
  });
}

// BUG-2: <picture> is display:inline by default. The <img> inside has
// h-full (height:100%), which resolves against its parent (<picture>).
// Since <picture> has no defined height, h-full on <img> may collapse to 0
// in strict percentage-height resolution contexts.
const pictureLine = html.split('\n').findIndex(l => l.includes('<picture>')) + 1;
const imgAfterPicture = html.split('\n').slice(pictureLine).findIndex(l => l.includes('h-full')) + 1;
if (pictureLine > 0 && imgAfterPicture > 0) {
  // Check <picture> has no block/w-full/h-full classes
  const pictureTag = html.match(/<picture[^>]*>/)?.[0] || '';
  if (!pictureTag.includes('class')) {
    bugs.push({
      id: 'BUG-2',
      severity: 'MEDIUM',
      title: '<picture> is display:inline — img h-full may not resolve against floaty div',
      detail: 'CSS spec: % height resolves against parent height. picture has no height defined. ' +
              'Chrome handles this OK today but it is fragile.',
      line: pictureLine,
      fix: 'Add class="block w-full h-full" to <picture> element.'
    });
  }
}

// BUG-3: Nav wordmark div has flex items-center but is missing gap-2.
// Logo image and text are adjacent with no spacing.
const navDiv = html.match(/flex items-center font-display[^""]*/)?.[0] || '';
if (navDiv && !navDiv.includes('gap-')) {
  bugs.push({
    id: 'BUG-3',
    severity: 'LOW',
    title: 'Nav wordmark missing gap — logo and text flush',
    detail: `Found: "${navDiv}"`,
    line: html.split('\n').findIndex(l => l.includes('flex items-center font-display')) + 1,
    fix: 'Add gap-2 to the flex container.'
  });
}

// BUG-4: <link> element is inside <body> (checkout section).
// Invalid HTML per spec; link rel=stylesheet must be in <head>.
const bodyContent = html.slice(html.indexOf('<body'));
if (/<link[^>]+stylesheet[^>]*>/.test(bodyContent)) {
  const badLinkLine = html.split('\n').findIndex((l, i) => {
    return i > html.split('\n').findIndex(l2 => l2.includes('<body')) &&
           l.includes('rel="stylesheet"') && l.includes('form.id');
  }) + 1;
  bugs.push({
    id: 'BUG-4',
    severity: 'LOW',
    title: '<link rel="stylesheet"> inside <body>',
    detail: 'The mengantar-form CSS link is inside a <section>. Invalid HTML; ' +
            'some browsers may defer parse or ignore it.',
    line: badLinkLine,
    fix: 'Move to <head>, or load it dynamically via JS when the section becomes visible.'
  });
}

// Report
console.log(`\n=== Bug Report: index.html — ${bugs.length} bug(s) found ===\n`);
bugs.forEach(b => {
  console.log(`[${b.id}] ${b.severity} — ${b.title}`);
  console.log(`  Line ~${b.line}`);
  console.log(`  Detail: ${b.detail}`);
  console.log(`  Fix: ${b.fix}`);
  console.log();
});

process.exit(bugs.length > 0 ? 1 : 0);
