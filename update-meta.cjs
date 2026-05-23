const fs = require('fs');
const path = require('path');

const pages = [
  { file: 'src/pages/About.tsx', title: "About Us | Sky's the Limit Painting LLC", desc: "Built by a Painter, Not a Sales Office. Learn about Anthony Briseno and Sky's the Limit Painting LLC based in Inver Grove Heights, MN." },
  { file: 'src/pages/Contact.tsx', title: "Contact Us & Free Estimates | Sky's the Limit Painting LLC", desc: "Get a free, clear estimate on your painting or striping project in the Twin Cities Metro. Call 651-410-4196 or message us today." },
  { file: 'src/pages/Projects.tsx', title: "Recent Painting Projects | Sky's the Limit Painting LLC", desc: "Real work. Clean finish. Take a look at some of our recent verifiable interior, exterior, and commercial painting projects across the Twin Cities." },
  { file: 'src/pages/ServiceArea.tsx', title: "Service Area | Twin Cities Painting Contractor", desc: "Serving Inver Grove Heights, Dakota County, and the Twin Cities Metro. Local, dependable painting services near you." },
  { file: 'src/pages/Services.tsx', title: "Professional Painting Services | Sky's the Limit Painting LLC", desc: "Professional painting and surface preparation built for real-world application. From residential interiors to high-traffic commercial environments." },
  { file: 'src/pages/ServiceInterior.tsx', title: "Interior Painting Services | Sky's the Limit Painting LLC", desc: "Clean walls, sharp lines, and a finished space that feels new. We provide precise interior painting for homes and businesses." },
  { file: 'src/pages/ServiceExterior.tsx', title: "Exterior Painting Services | Sky's the Limit Painting LLC", desc: "Protect curb appeal with prep-first exterior painting. Specialized in adhering to varied siding types and weather conditions in MN." },
  { file: 'src/pages/ServiceCommercial.tsx', title: "Commercial Painting Services | Sky's the Limit Painting LLC", desc: "Professional repainting for shops, offices, facilities, and job sites prioritizing minimal disruption and durable finishes." },
  { file: 'src/pages/ServiceStriping.tsx', title: "Pavement Marking & Striping | Sky's the Limit Painting LLC", desc: "Clean parking lot lines, safety markings, and pavement refreshes for small lots and facilities in the Twin Cities." }
];

const workspaceRoot = path.resolve(__dirname);

for (const p of pages) {
  const fullPath = path.normalize(path.resolve(workspaceRoot, p.file));
  if (!fullPath.startsWith(workspaceRoot)) {
    throw new Error('Path traversal detected');
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  if (!content.includes('PageMeta')) {
    content = content.replace(/(import PageTransition from '..\/components\/PageTransition';)/, "$1\nimport PageMeta from '../components/PageMeta';");
  }
  
  if (!content.includes('<PageMeta')) {
    content = content.replace(/<PageTransition>/, `<PageTransition>\n      <PageMeta title="${p.title}" description="${p.desc}" />`);
  }
  
  fs.writeFileSync(fullPath, content);
}
