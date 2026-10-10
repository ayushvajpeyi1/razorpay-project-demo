const { chromium } = require('playwright');
const fs = require('node:fs');
(async () => {
 const browser = await chromium.launch({headless:true,channel:'msedge'});
 const results=[];
 for (const [name,width,height] of [['desktop',2232,1224],['laptop',1440,900],['mobile',390,844]]) {
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto('http://127.0.0.1:3000',{waitUntil:'networkidle'});
  await page.screenshot({path:`qa/${name}.png`,fullPage:false});
  const checks=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,logoLoaded:document.querySelector('.brand-logo').naturalWidth>0,sidebarVisible:getComputedStyle(document.querySelector('.sidebar')).display!=='none',cards:document.querySelectorAll('.metric-card').length}));
  results.push({name,status:response.status(),...checks,errors});await page.close();
 }
 await browser.close();fs.writeFileSync('qa/results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
 if(results.some(r=>r.status!==200||r.overflow||!r.logoLoaded||r.cards!==3||r.errors.length))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});


