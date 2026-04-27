const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Capturar errores de consola
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log(`PAGE ERROR: ${msg.text()}`);
        }
    });

    page.on('pageerror', error => {
        console.log(`PAGE EXCEPTION: ${error.message}`);
    });

    try {
        await page.goto('https://imperio-de-la-moda.vercel.app', { waitUntil: 'networkidle0', timeout: 15000 });
        console.log('Page loaded successfully');
    } catch (e) {
        console.log('Exception while loading:', e.message);
    }
    
    await browser.close();
})();
