const assert = require('assert');
const JSONToTypeScript = require('./core');

const data = {
  id: 1,
  title: "Build agent",
  completed: false,
  author: {
    name: "Lorence",
    email: "lorence@test.local"
  },
  tags: ["code", "ai"]
};

const ts = JSONToTypeScript.convert(data, 'Task');
assert.strictEqual(ts.includes('export interface Task'), true);
assert.strictEqual(ts.includes('export interface Author'), true);
assert.strictEqual(ts.includes('tags: string[];'), true);
console.log('ok, all JSONToTypeScript assertions passed');
