import puppeteer from 'puppeteer-core';

async function checkPage(page, urlPath) {
  const url = `https://namo-ai-website.vercel.app${urlPath}`;
  console.log(`\n=================== Testing: ${urlPath} ===================`);
  await page.goto(url, { waitUntil: 'networkidle0' });

  // Let's scroll a bit to trigger any scroll effects
  await page.evaluate(() => window.scrollTo(0, 100));
  await new Promise(r => setTimeout(r, 500));

  const result = await page.evaluate(() => {
    const containers = Array.from(document.querySelectorAll('.container'));
    const containerData = containers.map((c, index) => {
      const r = c.getBoundingClientRect();
      const parent = c.parentElement;
      const computedStyle = window.getComputedStyle(c);
      return {
        index,
        parentTagName: parent ? parent.tagName : null,
        parentClassName: parent ? parent.className : null,
        left: r.left,
        right: r.right,
        width: r.width,
        computedWidth: computedStyle.width,
        computedMarginLeft: computedStyle.marginLeft,
        computedMarginRight: computedStyle.marginRight,
        computedPaddingLeft: computedStyle.paddingLeft,
        computedPaddingRight: computedStyle.paddingRight,
        distanceFromLeftOfDoc: r.left,
        distanceFromRightOfDoc: document.documentElement.clientWidth - r.right,
        distanceFromRightOfWindow: window.innerWidth - r.right
      };
    });

    const navbarWrap = document.querySelector('.nav-wrap');
    const nav = document.querySelector('.nav');
    const root = document.querySelector('#root');
    const main = document.querySelector('main');
    
    // Find any elements with transform or will-change containing transform
    const allElements = Array.from(document.querySelectorAll('*'));
    const transformedElements = allElements
      .filter(el => {
        const s = window.getComputedStyle(el);
        return (s.transform && s.transform !== 'none') || (s.willChange && s.willChange.includes('transform'));
      })
      .map(el => {
        const s = window.getComputedStyle(el);
        return {
          tagName: el.tagName,
          className: el.className,
          id: el.id,
          transform: s.transform,
          willChange: s.willChange,
          position: s.position
        };
      });

    return {
      windowWidth: window.innerWidth,
      docClientWidth: document.documentElement.clientWidth,
      htmlScrollbarGutter: window.getComputedStyle(document.documentElement).scrollbarGutter,
      bodyScrollbarGutter: window.getComputedStyle(document.body).scrollbarGutter,
      bodyWidth: window.getComputedStyle(document.body).width,
      rootWidth: root ? window.getComputedStyle(root).width : null,
      mainWidth: main ? window.getComputedStyle(main).width : null,
      containers: containerData,
      transformedElements
    };
  });

  console.log(JSON.stringify(result, null, 2));
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    await checkPage(page, '/');
    await checkPage(page, '/about');
    await checkPage(page, '/careers/culture');

  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
}

run();
