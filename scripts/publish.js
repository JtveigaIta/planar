// scripts/publish.js
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'scheduled_posts.json');
const POSTS_DIR = path.join(__dirname, '..', 'content', 'posts');

if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
}

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function slugToFilename(slug, publishDate) {
  // Optional: prefix by date to keep ordering if you want
  const datePart = new Date(publishDate).toISOString().slice(0,10);
  return `${datePart}-${slug}.md`;
}

function buildFrontMatter(post) {
  const yamlLines = [
    '---',
    `title: "${post.title.replace(/"/g, '\\"')}"`,
    `date: ${post.publish_date}`,
    `slug: "${post.slug}"`,
    `summary: "${(post.summary || '').replace(/"/g, '\\"')}"`,
    `tags: [${(post.tags || []).map(t => `"${t}"`).join(', ')}]`,
    `draft: false`,
    '---',
    ''
  ];
  return yamlLines.join('\n');
}

function fileExists(filename) {
  return fs.existsSync(path.join(POSTS_DIR, filename));
}

function writePostFile(filename, content) {
  fs.writeFileSync(path.join(POSTS_DIR, filename), content, 'utf8');
  console.log('Created:', filename);
}

function main() {
  const posts = loadJson(DATA_FILE);
  const now = new Date();

  let createdCount = 0;

  posts.forEach(post => {
    try {
      const pubDate = new Date(post.publish_date);
      if (isNaN(pubDate.getTime())) {
        console.warn('Invalid date for post id', post.id);
        return;
      }

      if (pubDate <= now) {
        const filename = slugToFilename(post.slug, post.publish_date);

        if (fileExists(filename)) {
          console.log('Already exists, skipping:', filename);
          return;
        }

        const front = buildFrontMatter(post);
        const body = post.content_markdown || '';
        const md = front + body;

        writePostFile(filename, md);
        createdCount++;
      } else {
        console.log('Not yet:', post.slug, '->', post.publish_date);
      }
    } catch (err) {
      console.error('Error processing post', post.id, err);
    }
  });

  if (createdCount === 0) {
    console.log('No posts created.');
  } else {
    console.log(`Created ${createdCount} post(s).`);
  }
}

main();