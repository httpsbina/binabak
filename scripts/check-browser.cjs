// Optional browser regression checks. The site itself has no runtime dependencies.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/';
const artifacts = process.env.REVIEW_ARTIFACTS || path.join(os.tmpdir(), 'portfolio-cleanup-review');
const views = { home: '.hero', calendar: '.calendar-shell', resume: '.notes-shell', about: '.health-shell', mail: '.mail-shell', photos: '.photos-shell' };
const content = { home: '.identity-card', calendar: '.calendar-content', resume: '.note-reader', about: '.health-columns', mail: '.mail-reader', photos: '.photo-library' };
const sizes = [[1440,1000],[1440,900],[1440,800],[1280,900],[1280,800],[1100,800],[1024,768],[951,740],[950,768],[820,1180],[768,1024],[390,844],[320,740],[1683,3476]];
const notes = ['overview','research','product','leadership','education','skills'];
const projects = ['common-senses','tbca','peak','aces','advisory','forge','accounting','statistics','coursework','research'];
const report = { layouts: 0, detailedViews: 0, photographs: 0, motionViews: 0, checks: [], errors: [] };
fs.mkdirSync(artifacts, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}) });
  const page = await browser.newPage();
  let sequence = 0;
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith(base) && response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`);
  });
  async function settled(selector) {
    await page.locator(selector).waitFor();
    await page.locator(selector).evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished.catch(() => {}))));
  }
  async function visit(route) {
    const url = new URL(base), [app, section] = route.split('/');
    url.searchParams.set('review', String(++sequence)); url.hash = route;
    await page.goto(url.href);
    await page.locator(views[app]).waitFor();
    if (app === 'resume' && section) await page.locator(`[data-note="${section}"][aria-current="page"]`).waitFor();
    if (app === 'mail' && section) await page.locator(`[data-email="${section}"][aria-current="page"]`).waitFor();
    if (app === 'photos') await page.locator(`.photos-sidebar [href="#${route}"][aria-current="page"]`).waitFor();
    await page.evaluate(() => document.fonts.ready);
    await settled(content[app]);
  }
  async function noHorizontalClipping(selector, label) {
    const result = await page.locator(selector).evaluate(element => ({ width: element.clientWidth, content: element.scrollWidth }));
    assert(result.content <= result.width + 2, `${label}: horizontal clipping ${JSON.stringify(result)}`);
  }
  async function fittedImage() {
    await page.locator('#media-dialog img').evaluate(image => image.decode());
    const fit = await page.locator('.media-stage').evaluate(stage => {
      const image = stage.querySelector('img').getBoundingClientRect(), area = stage.getBoundingClientRect();
      return image.left >= area.left - 1 && image.right <= area.right + 1 && image.top >= area.top - 1 && image.bottom <= area.bottom + 1;
    });
    assert(fit, 'Image must open fully fitted before zoom');
    await noHorizontalClipping('.media-toolbar', 'Image controls');
  }
  try {
    for (const [width, height] of sizes) {
      await page.setViewportSize({ width, height });
      for (const app of Object.keys(views)) {
        await visit(app === 'resume' ? 'resume/research' : app);
        const problems = await page.evaluate(() => {
          const failures = [];
          if (document.documentElement.scrollWidth > innerWidth) failures.push('Page has horizontal overflow');
          for (const element of document.querySelectorAll('.native-toolbar,.calendar-event,.resume-section,.health-row,.message-body,.message-meta,.signature,.hero h1,.project-scrap')) {
            const rectangle = element.getBoundingClientRect();
            if (!rectangle.width || getComputedStyle(element).visibility === 'hidden') continue;
            if (element.scrollWidth > element.clientWidth + 2) failures.push(`Text overflow: ${element.className || element.tagName}`);
            if (element.matches('.calendar-event') && element.scrollHeight > element.clientHeight + 2) failures.push(`Calendar copy clipped: ${element.textContent.slice(0, 50)}`);
          }
          return failures;
        });
        assert.deepEqual(problems, [], `${width} × ${height}, ${app}`);
        if (app === 'home') {
          const papers = await page.locator('.project-scrap').evaluateAll(elements => {
            const [a,b] = elements.map(element => element.getBoundingClientRect());
            return Math.min(a.right,b.right) > Math.max(a.left,b.left) && Math.min(a.bottom,b.bottom) > Math.max(a.top,b.top);
          });
          assert(!papers, `Home paper notes overlap at ${width}`);
        }
        if (app === 'mail' && width > 800) assert(await page.locator('.mail-messages').evaluate(element => element.scrollHeight <= element.clientHeight + 2), `All nine inbox rows should fit at ${width}`);
        if (app === 'photos' && width > 800) assert(await page.locator('.photo-scroll').evaluate(element => element.scrollHeight <= element.clientHeight + 2), `All 16 photo thumbnails should fit at ${width}`);
        if ((width === 1440 && height === 900) || width === 390) {
          await page.locator('img').evaluateAll(images => Promise.all(images.filter(image => { const r = image.getBoundingClientRect(); return r.width && r.top < innerHeight && r.bottom > 0; }).map(image => image.decode().catch(() => {}))));
          await page.screenshot({ path: path.join(artifacts, `${width}-${app}.png`), fullPage: true });
        }
        report.layouts++;
      }
      console.log(`PASS six layouts at ${width} × ${height}`);
    }
    for (const [width,height] of [[1440,900],[1024,768],[390,844],[320,740]]) {
      await page.setViewportSize({ width,height });
      for (const key of notes) { await visit(`resume/${key}`); await noHorizontalClipping('.note-reader', `Note ${key}`); report.detailedViews++; }
      for (let index = 0; index < 9; index++) {
        await visit(`mail/${index}`); await noHorizontalClipping('.mail-reader', `Email ${index}`);
        assert.equal(new URL(await page.locator('.message-reply').getAttribute('href')).searchParams.get('subject'), await page.locator('.mail-reader h2').innerText()); report.detailedViews++;
      }
      for (const key of projects) {
        await visit(`calendar/${key}`); await page.locator('#project-dialog[open]').waitFor();
        await noHorizontalClipping('.paper-note', `Project ${key}`);
        await page.locator('#project-dialog').evaluate(element => element.scrollTop = element.scrollHeight / 2);
        const close = await page.locator('.project-close').boundingBox(), dialog = await page.locator('#project-dialog').boundingBox();
        assert(close.y >= dialog.y && close.y + close.height <= dialog.y + dialog.height, 'Close must stay available while reading a project');
        await page.locator('.project-close').click(); report.detailedViews++;
      }
      for (const album of ['photos','photos/albums','photos/coast','photos/city-walks','photos/small-moments']) { await visit(album); await noHorizontalClipping('.photo-library', album); report.detailedViews++; }
      for (const route of ['mail/1','mail/3','photos']) {
        await visit(route); await page.locator(route === 'photos' ? '.photo-tile' : '.message-attachment').first().click(); await fittedImage();
        await page.getByRole('button', {name:'Zoom in',exact:true}).click(); await page.getByRole('button',{name:'Fit',exact:true}).click(); await fittedImage(); await page.keyboard.press('Escape');
      }
    }
    for (const [width,height] of [[1440,900],[390,844]]) {
      await page.setViewportSize({width,height});
      await visit('mail'); await page.getByRole('searchbox',{name:'Search messages'}).fill('Jayden');
      assert.equal(await page.locator('.mail-item:visible').count(),1);
      await page.locator('.mail-item:visible').click(); await page.locator('.mail-reader h2').filter({hasText:'PR review'}).waitFor();
      assert.equal(await page.getByRole('searchbox',{name:'Search messages'}).inputValue(),'Jayden');
      assert.equal(await page.locator('.mail-item:visible').count(),1);
      await page.getByRole('searchbox',{name:'Search messages'}).fill('no-result-xyz'); assert(await page.locator('.mail-empty').isVisible()); assert(!(await page.locator('.mail-reader').isVisible()));
      await page.getByRole('searchbox',{name:'Search messages'}).fill(''); assert.equal(await page.locator('.mail-item:visible').count(),9);
      assert.equal(new URL(await page.getByRole('link',{name:'Compose an email'}).getAttribute('href')).searchParams.get('subject'),'Hi Bina!');
      await visit('resume'); await page.getByRole('button',{name:'Search résumé',exact:true}).click(); await page.getByRole('searchbox',{name:'Search résumé'}).fill('data quality');
      await page.locator('[data-note="skills"]:visible').click(); await page.locator('[data-note="skills"][aria-current="page"]').waitFor();
      assert.equal(await page.getByRole('searchbox',{name:'Search résumé'}).inputValue(),'data quality');
      await page.getByRole('searchbox',{name:'Search résumé'}).fill('no-result-xyz'); assert(await page.locator('.notes-empty').isVisible());
      await page.getByRole('button',{name:'Search résumé',exact:true}).click(); assert.equal(await page.locator('.note-item:visible').count(),6);
      const download = await Promise.all([page.waitForEvent('download'),page.getByRole('link',{name:'Download PDF'}).click()]); assert.match(download[0].suggestedFilename(),/Resume.pdf$/);
      await visit('photos'); await page.locator('.photo-tile').first().click();
      for(let i=0;i<16;i++){ await fittedImage(); report.photographs++; await page.getByRole('button',{name:'Next image',exact:true}).click(); } await page.keyboard.press('Escape');
      await visit('about'); const board = await page.locator('.sudoku-grid').elementHandle();
      await page.getByRole('button',{name:'Hint',exact:true}).click(); const scroll = await page.evaluate(()=>scrollY);
      for(let i=0;i<7;i++) await page.getByRole('button',{name:'Hint',exact:true}).click(); assert.equal(await page.locator('.sudoku-status').innerText(),'Puzzle complete.');
      assert.equal(await page.locator('dialog[open]').count(),0); assert.equal(await page.evaluate(()=>scrollY),scroll);
      await page.getByRole('button',{name:'Reset',exact:true}).click(); assert(await board.evaluate(element=>element.isConnected));
      await page.locator('.skip-link').focus(); await page.keyboard.press('Enter'); assert.equal(await page.evaluate(()=>document.activeElement.id),'main-content');
      await page.mouse.move(0,0);
      for(const [app,selector] of Object.entries(content)) {
        await page.locator(`#dock a[href="#${app}"]`).click(); await page.locator(selector).waitFor();
        const frames = await page.locator(selector).evaluate(element=>element.getAnimations().filter(animation=>animation.animationName==='content-settle').map(animation=>animation.effect.getKeyframes()));
        assert(frames.length, `Missing entrance on ${app}`); assert.equal(frames[0][0].translate,'0px 6px'); assert(frames[0].every(frame=>!('opacity' in frame)&&!('scale' in frame)&&!('transform' in frame)));
        await settled(selector); report.motionViews++;
      }
      await page.emulateMedia({reducedMotion:'reduce'});
      for(const [app,selector] of Object.entries(content)){await page.locator(`#dock a[href="#${app}"]`).click();await page.locator(selector).waitFor();assert.equal(await page.locator(selector).evaluate(element=>element.getAnimations().length),0);}
      await page.emulateMedia({reducedMotion:'no-preference'});
    }
    report.checks.push('All layouts, detailed readers, sticky dialog close controls, preserved search results, no-result states, PDF download, contextual replies, all full-size photos, fitted map/plot views, Sudoku and reduced-motion behavior passed.');
    assert.deepEqual(report.errors,[]);
    fs.writeFileSync(path.join(artifacts,'results.json'),JSON.stringify(report,null,2));
    console.log(`PASS ${report.layouts} layouts, ${report.detailedViews} detailed views, ${report.photographs} photo fits and ${report.motionViews} shared page entrances.`);
    console.log(`Artifacts: ${artifacts}`);
  } catch (error) {
    report.failure = String(error); report.url = page.url();
    fs.writeFileSync(path.join(artifacts,'results.json'),JSON.stringify(report,null,2));
    await page.screenshot({path:path.join(artifacts,'failure.png'),fullPage:true});
    throw error;
  } finally { await browser.close(); }
})().catch(error=>{ console.error(error.message); process.exitCode=1; });
