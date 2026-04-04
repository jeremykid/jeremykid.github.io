import fs from 'node:fs';
import path from 'node:path';

const distRoot = path.resolve(import.meta.dirname, '..', 'dist');

function assertFile(relativePath) {
  const target = path.join(distRoot, relativePath);
  if (!fs.existsSync(target)) {
    throw new Error(`Missing expected file: ${relativePath}`);
  }
}

[
  'index.html',
  'blog/index.html',
  'publications/index.html',
  'projects/index.html',
  'archives/index.html',
  'about/index.html',
  'search.json',
  'search.xml',
  'Deep learning.html',
  'Reinforcement-Learning-Note-1.html',
  '2016/07/18/Algorithm/index.html',
  '2016/07/27/My Ionic-Hybrid Experience[1]/index.html',
  '2018/07/02/中国剩余定理/index.html',
  '2020/06/23/Survival-Analysis-note-0/index.html',
  'tags/Web-Mobile/index.html'
].forEach(assertFile);

const searchEntries = JSON.parse(fs.readFileSync(path.join(distRoot, 'search.json'), 'utf8'));

if (searchEntries.length < 26) {
  throw new Error(`Expected at least 26 search entries, found ${searchEntries.length}.`);
}

if (!searchEntries.some((entry) => entry.slug === '中国剩余定理')) {
  throw new Error('Expected search index to include a non-ASCII slug.');
}

console.log('Dist verification passed.');
