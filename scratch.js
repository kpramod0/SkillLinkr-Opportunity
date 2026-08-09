const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        let val = match[2].trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        acc[match[1].trim()] = val;
    }
    return acc;
}, {});

async function main() {
    const url = `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/opp_colleges?select=*&email_domain=eq.kiit.ac.in&is_active=eq.true`;
    
    console.log("Fetching:", url);
    const response = await fetch(url, {
        headers: {
            'apikey': env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
        }
    });
    
    if (!response.ok) {
        console.error("Error fetching colleges:", await response.text());
        return;
    }
    
    const data = await response.json();
    console.log("DB Result:", JSON.stringify(data, null, 2));
}

main();
