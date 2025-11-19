import json
import os
from datetime import datetime

POSTS_FILE = "scheduled-posts/posts.json"
POSTS_DIR = "content/posts/"

# Garantir que o diretório existe
os.makedirs(POSTS_DIR, exist_ok=True)

# Ler lista de posts
with open(POSTS_FILE, "r", encoding="utf-8") as f:
    posts = json.load(f)

today = datetime.utcnow().date()
changed = False

for post in posts:
    pub_date = datetime.strptime(post["publish_date"], "%Y-%m-%d").date()

    if pub_date <= today and not post.get("published", False):

        filename = f"{POSTS_DIR}{post['slug']}.md"

        with open(filename, "w", encoding="utf-8") as md:
            md.write(f"---\n")
            md.write(f"title: \"{post['title']}\"\n")
            md.write(f"date: \"{post['publish_date']}\"\n")
            md.write(f"draft: false\n")
            md.write(f"---\n\n")
            md.write(post["content"])

        post["published"] = True
        changed = True
        print(f"Published: {filename}")

# Atualizar JSON se houve mudanças
if changed:
    with open(POSTS_FILE, "w", encoding="utf-8") as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)
else:
    print("No scheduled posts to publish today")
