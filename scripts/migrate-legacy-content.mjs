import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import matter from 'gray-matter';
import { load } from 'cheerio';

const repoRoot = path.resolve(import.meta.dirname, '..');
const legacyHexoRoot = path.resolve(repoRoot, '../swjblog');
const postsSourceDir = path.join(legacyHexoRoot, 'source', '_posts');
const siteRoot = repoRoot;
const generatedPostsDir = path.join(repoRoot, 'src', 'content', 'posts');
const publicImagesDir = path.join(repoRoot, 'public', 'images');
const publicFilesDir = path.join(repoRoot, 'public', 'files');
const legacySearchIndex = path.join(siteRoot, 'search.xml');

function ensureDir(target) {
  fs.mkdirSync(target, { recursive: true });
}

function resetDirectory(target) {
  fs.rmSync(target, { recursive: true, force: true });
  ensureDir(target);
}

function normalizeFrontmatterTabs(content) {
  return content.replace(/\r\n/g, '\n').replace(/\t/g, '  ');
}

function readLegacyFile(filePath, gitPath) {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8');
  }

  return execFileSync('git', ['show', `HEAD:${gitPath}`], {
    cwd: repoRoot,
    encoding: 'utf8'
  });
}

function parseFrontmatter(rawContent) {
  const normalized = normalizeFrontmatterTabs(rawContent);

  if (normalized.startsWith('---\n')) {
    return matter(normalized);
  }

  const closingIndex = normalized.indexOf('\n---\n');
  if (closingIndex !== -1) {
    const frontmatterBlock = normalized.slice(0, closingIndex);
    const body = normalized.slice(closingIndex + '\n---\n'.length);
    return matter(`---\n${frontmatterBlock}\n---\n${body}`);
  }

  return matter(normalized);
}

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function toStringValue(value) {
  if (!value) return undefined;
  if (Array.isArray(value)) {
    return value[0] ? String(value[0]).trim() : undefined;
  }

  const normalized = String(value).trim();
  return normalized || undefined;
}

function buildLegacyRouteMap() {
  const searchXml = readLegacyFile(legacySearchIndex, 'search.xml');
  const urls = [...searchXml.matchAll(/<url>(.*?)<\/url>/g)].map((match) => match[1]);
  const map = new Map();

  for (const url of urls) {
    const segments = url.split('/').filter(Boolean).map((segment) => decodeURIComponent(segment));
    if (segments.length !== 4) {
      continue;
    }

    const [year, month, day, slug] = segments;
    map.set(slug, {
      date: `${year}-${month}-${day}`,
      path: `/${year}/${month}/${day}/${encodeURI(slug).replace(/#/g, '%23')}/`
    });
  }

  return map;
}

function summarize(markdown, length = 190) {
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]+\]\([^)]+\)/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (plainText.length <= length) {
    return plainText;
  }

  return `${plainText.slice(0, length).trimEnd()}...`;
}

function safeFilenameSegment(value) {
  const normalized = value
    .normalize('NFKD')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  return normalized || 'post';
}

function serializeFrontmatter(data) {
  const lines = ['---'];

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${key}: []`);
        continue;
      }
      lines.push(`${key}:`);
      for (const item of value) {
        lines.push(`  - ${JSON.stringify(item)}`);
      }
      continue;
    }

    if (value instanceof Date) {
      lines.push(`${key}: ${value.toISOString()}`);
      continue;
    }

    lines.push(`${key}: ${JSON.stringify(value)}`);
  }

  lines.push('---', '');
  return lines.join('\n');
}

function writeMarkdownFile(targetPath, data, body) {
  const content = `${serializeFrontmatter(data)}${body.trim()}\n`;
  fs.writeFileSync(targetPath, content, 'utf8');
}

function migrateHexoPosts() {
  const legacyRouteMap = buildLegacyRouteMap();
  const filenames = fs
    .readdirSync(postsSourceDir)
    .filter((filename) => filename.endsWith('.md'))
    .sort((a, b) => a.localeCompare(b, 'en'));

  for (const filename of filenames) {
    const sourcePath = path.join(postsSourceDir, filename);
    const parsed = parseFrontmatter(fs.readFileSync(sourcePath, 'utf8'));
    const slug = path.basename(filename, '.md');
    const legacyRoute = legacyRouteMap.get(slug);
    const rawDate = parsed.data.date || legacyRoute?.date;
    const date =
      rawDate instanceof Date
        ? rawDate
        : rawDate
          ? new Date(String(rawDate).replace(' ', 'T'))
          : undefined;

    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      throw new Error(`Could not determine a valid date for ${filename}.`);
    }

    const normalizedData = {
      title: String(parsed.data.title || slug),
      date,
      slug,
      summary: summarize(parsed.content),
      tags: toArray(parsed.data.tags),
      category: toStringValue(parsed.data.categories),
      legacyPath: legacyRoute?.path,
      legacyTopLevelPaths: slug === 'Reinforcement-Learning-Note-1' ? ['/Reinforcement-Learning-Note-1.html'] : [],
      legacyTagSlugs: slug === 'My Ionic-Hybrid Experience[1]' ? ['Web-Mobile'] : []
    };

    const targetName = `${date.toISOString().slice(0, 10)}-${safeFilenameSegment(slug)}.md`;
    writeMarkdownFile(path.join(generatedPostsDir, targetName), normalizedData, parsed.content);
  }
}

function migrateGeneratedOnlyPost() {
  const legacyPostPath = path.join(
    siteRoot,
    '2020',
    '06',
    '23',
    'Survival-Analysis-note-0',
    'index.html'
  );
  const html = readLegacyFile(
    legacyPostPath,
    '2020/06/23/Survival-Analysis-note-0/index.html'
  );
  const $ = load(html);
  const body = $('.post-body').html()?.trim();

  if (!body) {
    throw new Error('Could not extract generated-only post body.');
  }

  const targetPath = path.join(generatedPostsDir, '2020-06-23-Survival-Analysis-note-0.md');
  writeMarkdownFile(
    targetPath,
    {
      title: 'Brier Score',
      date: new Date('2020-06-23T00:00:00.000Z'),
      slug: 'Survival-Analysis-note-0',
      summary:
        'Notes on the Brier Score, censoring-aware evaluation, and the integral Brier Score for survival analysis.',
      tags: ['Machine Learning Survival Analysis'],
      category: 'Research',
      legacyPath: '/2020/06/23/Survival-Analysis-note-0/',
      legacyTopLevelPaths: [],
      legacyTagSlugs: ['Machine-Learning-Survival-Analysis']
    },
    body
  );
}

function copyImageSources() {
  const sourceImages = [
    path.join(legacyHexoRoot, 'source', 'images'),
    path.join(siteRoot, 'images')
  ];

  for (const sourceDir of sourceImages) {
    if (!fs.existsSync(sourceDir)) continue;
    fs.cpSync(sourceDir, publicImagesDir, { recursive: true, force: true });
  }
}

function ensureCvSlot() {
  ensureDir(publicFilesDir);
  const readmePath = path.join(publicFilesDir, 'README.md');
  fs.writeFileSync(
    readmePath,
    'Place a PDF named `weijie-sun-cv.pdf` in this directory to enable the download button on `/cv/`.\n',
    'utf8'
  );
}

resetDirectory(generatedPostsDir);
ensureDir(publicImagesDir);
ensureDir(publicFilesDir);
migrateHexoPosts();
migrateGeneratedOnlyPost();
copyImageSources();
ensureCvSlot();

console.log('Migrated legacy posts and copied public assets.');
