set -e

python3 << 'PYEOF'
with open('components/Footer.tsx', 'r') as f:
    content = f.read()

old = '''          <a href="#">LinkedIn</a>
          <a href="#">Instagram</a>
          <a href="#">YouTube</a>'''

new = '''          <a href="https://ca.linkedin.com/company/czrobio">LinkedIn</a>
          <a href="https://www.youtube.com/@czrobio">YouTube</a>'''

if old not in content:
    print("ABORT: expected block not found in Footer.tsx")
    exit(1)

content = content.replace(old, new)
with open('components/Footer.tsx', 'w') as f:
    f.write(content)
print("Footer.tsx updated")
PYEOF

git add components/Footer.tsx
git commit -m "Update footer social links: real LinkedIn/YouTube URLs, remove Instagram"
git push origin main
