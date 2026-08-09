const fs = require('fs');
const path = require('path');

const filesToFix = [
  "src/app/society/submit/page.tsx",
  "src/app/society/dashboard/page.tsx",
  "src/app/ambassador/review/[id]/page.tsx",
  "src/app/ambassador/queue/page.tsx",
  "src/app/ambassador/dashboard/page.tsx",
  "src/app/admin/opportunities/page.tsx",
  "src/app/admin/societies/page.tsx",
  "src/app/admin/dashboard/page.tsx",
  "src/app/actions/users.ts",
  "src/app/actions/opportunities.ts",
  "src/app/actions/notifications.ts",
  "src/app/actions/auth-helpers.ts",
  "src/app/admin/ambassadors/page.tsx",
  "src/app/(auth)/register/page.tsx",
  "src/app/(auth)/login/page.tsx"
];

for (const file of filesToFix) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('createClient()') && !content.includes('await createClient()')) {
      content = content.replace(/createClient\(\)/g, 'await createClient()');
      fs.writeFileSync(filePath, content);
      console.log('Fixed', file);
    } else {
      console.log('Skipped', file);
    }
  } else {
    console.log('Not found', file);
  }
}
