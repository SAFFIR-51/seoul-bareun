import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const edits = JSON.parse(await readFile('public/images/demo1-unique/doctor-identity-edits.json', 'utf8'));
const uniquePath = 'public/images/demo1-unique/asset-prompts.json';
const brightPath = 'public/images/demo1-realistic/asset-prompts-bright.json';
const unique = JSON.parse(await readFile(uniquePath, 'utf8'));
const bright = JSON.parse(await readFile(brightPath, 'utf8'));
assert.equal(edits.assets.length, 14);
for (const edit of edits.assets) {
  const asset = edit.name === 'equipment-consultation'
    ? bright.assets.find(asset => asset.name === 'consultation')
    : unique.assets.find(asset => asset.name === edit.name);
  assert(asset, edit.name);
  asset.initialSceneSource ??= asset.source;
  asset.source = edit.source;
  asset.identityDoctor = edit.doctor;
  asset.identityReference = edit.reference;
  asset.identityEditPrompt = edit.prompt;
}
unique.referenceDoctors = edits.referenceDoctors;
await writeFile(uniquePath, JSON.stringify(unique, null, 2) + '\n');
await writeFile(brightPath, JSON.stringify(bright, null, 2) + '\n');
console.log('Applied three existing doctor identities to 14 consultation/examination scenes.');
