require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function main() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
  
  console.log("Clearing old job_events...");
  const { error: err1 } = await supabase.from('job_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (err1) console.error(err1);

  console.log("Clearing old jobs...");
  const { error: err2 } = await supabase.from('jobs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (err2) console.error(err2);

  console.log("Database cleared for the new smart contract deployment.");
}

main().catch(console.error);
