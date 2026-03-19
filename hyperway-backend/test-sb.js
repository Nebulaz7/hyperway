require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function main() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
  
  const payload = {
    job_id: '1',
    buyer_address: '0x88f713a8d2bf0cfd51f84f3e1cbcef04493547fe',
    spec_cid: '0xc50a4ea75318bbcdb446260446c68bf41e5d3b7171fc0da1f81fb43172899b03',
    payment_amount: '100000',
    status: 'PENDING',
  };

  const { data, error } = await supabase
    .from('jobs')
    .upsert(payload, { onConflict: 'job_id' })
    .select();

  console.log('UPSERT Data:', data);
  console.log('UPSERT Error:', error);
}

main().catch(console.error);
