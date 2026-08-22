const sample = "{\n  \"status\": \"success\",\n  \"code\": 200,\n  \"data\": {\n    \"userId\": \"usr_example\",\n    \"profile\": {\n      \"firstName\": \"Casey\",\n      \"verified\": true,\n      \"reputation\": 4.95\n    },\n    \"roles\": [\"maintainer\", \"creator\"],\n    \"preferences\": {\n      \"theme\": \"dark\",\n      \"notifications\": false\n    }\n  }\n}";

const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const statsEl = document.getElementById('output-stats') || document.getElementById('stats');

function process() {
  const txt = inputEl.value;
  if (!txt.trim()) { outputEl.value = ''; if (statsEl) statsEl.textContent = 'Empty input'; return; }
  try {
    const ts = JSONToTypeScript.convert(txt, 'RootResponse');
    outputEl.value = ts;
    if (statsEl) statsEl.textContent = '✅ Generated TypeScript interfaces';
  } catch (err) {
    outputEl.value = 'Error: ' + err.message;
  }
}

document.getElementById('btn-run').addEventListener('click', process);
inputEl.addEventListener('input', process);
document.getElementById('btn-sample').addEventListener('click', () => { inputEl.value = sample; process(); });
document.getElementById('btn-copy').addEventListener('click', () => { navigator.clipboard.writeText(outputEl.value); alert('Copied TypeScript!'); });
if (document.getElementById('btn-clear')) document.getElementById('btn-clear').addEventListener('click', () => { inputEl.value = ''; outputEl.value = ''; });
