import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyze(filePath) {
  const data = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
  const base64 = data.toString('base64');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [
          { inlineData: { mimeType, data: base64 } },
          { text: 'Briefly deduce what this painting/contractor image shows. e.g. "exterior of a house", "commercial building", "painter prepping a wall", "sprayers and lifts", "work trucks", "striping". Output just 1 sentence.' }
        ]}
      ]
    });
    console.log(`${path.basename(filePath)}: ${response.text}`);
  } catch(e) {
    console.error(`Error analyzing ${filePath}: ${e.message}`);
  }
}

async function main() {
  const dirs = [
    'src/assets/images',
    'public/images/backup'
  ];
  
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.match(/\.(png|jpe?g)$/i));
    for (const f of files) {
      await analyze(path.join(dir, f));
    }
  }
}
main();
