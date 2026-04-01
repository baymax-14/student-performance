import os

md_path = r"C:\Users\USER\.gemini\antigravity\brain\0f489bb2-ef7e-4884-bd70-0a31891e42e6\EduPredict_Full_Technical_Report.md"
with open(md_path, 'r', encoding='utf-8') as f:
    md_content = f.read()

# Escape backticks and template string dollars
escaped_md = md_content.replace('\\', '\\\\').replace('`', '\\`').replace('$', '\\$')

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EduPredict — Full Technical Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    :root {{
      --primary: #0ea5e9;
      --primary-dark: #0284c7;
      --bg: #f8fafc;
      --surface: #ffffff;
      --border: #e2e8f0;
      --text: #0f172a;
      --text-muted: #64748b;
    }}
    body {{ font-family: 'Inter', sans-serif; color: var(--text); background: var(--bg); line-height: 1.7; font-size: 14px; padding: 40px; margin: 0; }}
    .container {{ max-width: 900px; margin: 0 auto; background: var(--surface); padding: 50px 60px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid var(--border); }}
    h1 {{ font-size: 34px; font-weight: 800; margin-bottom: 24px; color: var(--primary-dark); padding-bottom: 20px; text-align: center; border-bottom: 2px solid var(--border); }}
    h2 {{ font-size: 24px; font-weight: 700; margin: 40px 0 20px; color: var(--primary-dark); border-bottom: 1px solid var(--border); padding-bottom: 8px; }}
    h3 {{ font-size: 18px; font-weight: 700; margin: 24px 0 12px; color: var(--text); }}
    p {{ margin-bottom: 16px; }}
    table {{ width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 13.5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }}
    th {{ background: #f1f5f9; text-align: left; padding: 14px 16px; border: 1px solid var(--border); font-weight: 700; text-transform: uppercase; color: var(--text-muted); font-size: 12px; }}
    td {{ padding: 14px 16px; border: 1px solid var(--border); vertical-align: top; }}
    tr:nth-child(even) {{ background: #f8fafc; }}
    ul, ol {{ margin: 16px 0 24px 24px; }}
    code {{ background: #f1f5f9; padding: 3px 6px; border-radius: 4px; font-family: 'Consolas', monospace; font-size: 13px; color: #be185d; border: 1px solid var(--border); }}
    pre {{ background: #1e293b; color: #e2e8f0; padding: 20px 24px; border-radius: 10px; overflow-x: auto; margin: 20px 0; font-family: 'Consolas', monospace; font-size: 13px; }}
    pre code {{ color: inherit; background: none; padding: 0; border: none; }}
    blockquote {{ border-left: 4px solid var(--primary); padding-left: 20px; color: var(--text-muted); margin: 24px 0; background: #f0f9ff; padding: 20px; border-radius: 0 8px 8px 0; font-weight: 500; }}
    a {{ color: var(--primary); text-decoration: none; }}
    a:hover {{ text-decoration: underline; }}
  </style>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</head>
<body>
  <div class="container" id="content">Loading full technical report...</div>
  <script>
    const markdownText = `{escaped_md}`;
    document.getElementById('content').innerHTML = marked.parse(markdownText);
  </script>
</body>
</html>"""

out_path = r"d:\anand\student performance\EduPredict_Technical_Report.html"
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(html_content)
print("File generated successfully.")
