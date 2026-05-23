import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyze(filePath) {
  const workspaceRoot = path.resolve(process.cwd());
  const fullPath = path.normalize(path.resolve(workspaceRoot, filePath));
  
  if (!fullPath.startsWith(workspaceRoot)) {
    throw new Error('Path traversal detected');
  }

  const data = fs.readFileSync(fullPath);
  const ext = path.extname(fullPath).toLowerCase();
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
      ],
      config: {
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
        ]
      }
    });
    console.log(`${path.basename(fullPath)}: ${response.text}`);
  } catch(e) {
    console.error(`Error analyzing ${fullPath}: ${e.message}`);
  }
}

async function main() {
  const workspaceRoot = path.resolve(process.cwd());
  const dirs = [
    path.normalize(path.join(workspaceRoot, 'src/assets/images')),
    path.normalize(path.join(workspaceRoot, 'public/images/backup'))
  ];
  
  for (const dir of dirs) {
    if (!dir.startsWith(workspaceRoot)) {
      throw new Error('Path traversal detected');
    }
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.match(/\.(png|jpe?g)$/i));
    for (const f of files) {
      await analyze(path.join(dir, f));
    }
  }
}
main();
