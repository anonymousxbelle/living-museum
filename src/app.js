import {ARTISTS, GALLERIES, PHOTOS, PHOTO_CREDITS, getGallery, getArtist, byGallery} from './data.js';

/* The museum is deliberately dependency-free, so it can publish directly to GitHub Pages.
   No synthetic or AI-generated imagery is used. Photos are real Unsplash photographs;
   previews are retrieved live from Wikimedia Commons / Open Library / YouTube. */
const app = document.querySelector('#app');
const esc = (value='')=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const decoded = value => {try{return decodeURIComponent(value)}catch{return value}};
const wikiArticle = slug => `https://en.wikipedia.org/wiki/${slug}`;
const wikiSearch = query=>`https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}`;
const bookSearch = (title, author)=>`https://openlibrary.org/search?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`;
const musicSearch=(artist,title)=>`https://www.youtube.com/results?search_query=${encodeURIComponent(`${artist} ${title} recording performance`)}`;
const currentHash =()=> (location.hash || '#/').slice(1).replace(/\/+$/,'') || '/';
const wrapMain = (body, className='') => `${header()}<main id="main" class="${className} page-entrance" tabindex="-1">${body}</main>${footer()}`;

function header(){return `<header class="site-header"><div class="header-inner shell"><a class="brand" href="#/" aria-label="The Living Museum, home"><span class="brand-symbol">✧</span><span>The Living Museum</span></a><nav class="nav-actions" aria-label="Main navigation"><a class="nav-link" href="#/galleries">Explore galleries</a><a class="nav-link" href="#/about">About & credits</a><span class="nav-dot" aria-hidden="true"></span></nav></div></header>`}
function footer(){return `<footer class="site-footer"><div class="shell"><div class="footer-top"><div><div class="footer-brand">The Living Museum</div><p class="footer-desc">Five galleries. Thirty-one creative minds. A digital journey through the people who changed the way we create and experience art.</p></div><nav class="footer-links" aria-label="Footer links"><a href="#/galleries">Galleries</a><a href="#/about">Image credits & sources</a><a href="#/">Return to entrance</a></nav></div><div class="footer-bottom"><span>31 artists</span></div></div></footer>`}
function galleryCard(g) {
  const count = byGallery(g.id).length;
  return `<a class="gallery-card" href="#/gallery/${g.id}" style="--card-photo:url('${g.image}');--gallery-accent:${g.accent}">
    <div class="gallery-top"><span>${esc(g.short)}</span><span class="gallery-index" aria-hidden="true">${g.icon}</span></div>
    <div><h3 class="gallery-name">${esc(g.name)}</h3><p class="gallery-caption">${count} artists</p></div>
  </a>`;
}

function galleryListing(isHome) {
  const heading = isHome ? 'h2' : 'h1';
  return `<section class="section gallery-listing" aria-labelledby="gallery-heading"><div class="shell">
    <div class="section-heading"><${heading} id="gallery-heading" class="serif">Explore the galleries</${heading}></div>
    <div class="gallery-grid">${GALLERIES.map(galleryCard).join('')}</div>
  </div></section>`;
}

function home() {
  return wrapMain(`<section class="hero" style="--bg-photo:url('${PHOTOS.entrance}')">
    <div class="hero-bg" aria-hidden="true"></div>
    <div class="float-spark spark-a" aria-hidden="true"></div>
    <div class="float-spark spark-b" aria-hidden="true"></div>
    <div class="float-spark spark-c" aria-hidden="true"></div>
    <div class="shell hero-shell"><div class="hero-content">
      <h1>The Living <em>Museum</em></h1>
      <p class="hero-lede">Explore music, theater, literature, visual arts, and sculpture through the lives and works of 31 artists.</p>
      <a class="button-primary" href="#/galleries">Enter the museum</a>
    </div></div>
  </section><div class="gold-line"></div>${galleryListing(true)}`,'home-main');
}

function lobby() {
  return wrapMain(galleryListing(false),'lobby-main');
}

function galleryNav(activeId) {
  return `<nav class="gallery-nav" aria-label="Museum galleries"><div class="shell gallery-nav-inner">
    ${GALLERIES.map(g => `<a href="#/gallery/${g.id}"${g.id === activeId ? ' aria-current="page"' : ''}>${esc(g.short)}</a>`).join('')}
  </div></nav>`;
}

function artistCard(a){const words=a.name.split(' ');const initial=words.length>1?`${words[0][0]}${words.at(-1)[0]}`:a.name.slice(0,2);return `<a href="#/artist/${a.id}" class="artist-card"><div class="artist-card-portrait"><div class="portrait-placeholder" aria-hidden="true">${esc(initial)}</div><img data-wiki="${esc(a.wikipedia)}" data-kind="portrait" alt="Portrait of ${esc(a.name)}" loading="lazy" hidden /></div><div class="artist-card-body"><h3>${esc(a.name)}</h3><p class="artist-card-role">${esc(a.role)}</p><div class="artist-card-action"><span>View exhibit</span></div></div></a>`}
function galleryPage(id){const g=getGallery(id);if(!g)return missing();const artists=byGallery(id);return wrapMain(`<section class="gallery-hero" style="--bg-photo:url('${g.image}')"><div class="gallery-hero-bg" aria-hidden="true"></div><div class="shell"><div class="breadcrumbs"><a href="#/">Entrance</a><span class="slash">/</span><a href="#/galleries">Galleries</a><span class="slash">/</span><span>${esc(g.name)}</span></div><div class="tiny eyebrow">Gallery ${g.number} &nbsp; · &nbsp; ${artists.length} artists</div><h1>${esc(g.name)}</h1><p class="subtitle">${esc(g.description)}</p></div></section>${galleryNav(g.id)}<section class="section artists-section"><div class="shell"><div class="section-heading"><h2>Artists</h2></div><div class="artist-grid">${artists.map(artistCard).join('')}</div></div></section>`,'gallery-main')}
const catalogSources = {
  'The Creation of Adam': 'https://www.museivaticani.va/content/museivaticani/it/collezioni/musei/cappella-sistina/volta.html',
  'Downhearted Blues': 'https://www.loc.gov/static/programs/national-recording-preservation-board/documents/Down-HeartedBlues.pdf',
  'The Return of the Prodigal Son': 'https://www.hermitagemuseum.org/digital-collection/43413',
  'The Glass Menagerie': 'https://www.concordtheatricals.com/p/98161/the-glass-menagerie',
  'Cat on a Hot Tin Roof': 'https://www.ibdb.com/broadway-production/cat-on-a-hot-tin-roof-2508',
  'Romeo and Juliet': 'https://www.folger.edu/explore/shakespeares-works/romeo-and-juliet/',
  'A Raisin in the Sun': 'https://www.themorgan.org/literary-historical/91335',
  'The Sign in Sidney Brustein’s Window': 'https://www.lhlt.org/works',
  'Les Blancs': 'https://www.lhlt.org/news/joi-gresham-introduces-les-blancs-national-theatre-home',
  'A Street in Bronzeville': 'https://www.loc.gov/programs/poetry-and-literature/poet-laureate/poets-laureate/item/n50041281/gwendolyn-brooks/',
  'Annie Allen': 'https://exhibits.library.illinois.edu/s/rbml/item/30409',
  'Mending Wall': 'https://rpo.library.utoronto.ca/content/mending-wall',
  'Stopping by Woods on a Snowy Evening': 'https://rpo.library.utoronto.ca/content/stopping-woods-snowy-evening-3',
  'The Weary Blues': 'https://library.brown.edu/exhibits/archive/hughes/checklist.html',
  'The Basket of Apples': 'https://www.cezannecatalogue.com/catalogue/entry.php?id=776',
  'Red Canna': 'https://access-ok.okeeffemuseum.org/object/8561/',
  'Jimson Weed/White Flower No. 1': 'https://crystalbridges.org/artworks/2014-35',
  'Red Cube': 'https://noguchi.whirlihost.com/Detail/artwork/993',
  "Moulin Rouge: La Goulue": "https://www.metmuseum.org/art/collection/search/333990",
  "Jane Avril": "https://www.metmuseum.org/art/collection/search/333993",
  "The Migration Series": "https://www.moma.org/calendar/exhibitions/444",
  "Aspects of Negro Life": "https://old-digitalcollections.nypl.org/items/6ca557ed-9597-5dcd-e040-e00a18065af4",
  "Song of the Towers": "https://www.si.edu/object/aspects-negro-life-song-towers-painting%3Asiris_ari_399542",
  "The Card Players": "https://www.metmuseum.org/art/collection/search/435868",
  "Mont Sainte-Victoire": "https://www.philamuseum.org/objects/71967",
  "Guernica": "https://www.museoreinasofia.es/en/collections/artwork/guernica-0/",
  "Les Demoiselles d’Avignon": "https://www.moma.org/collection/works/79766",
  "Self-Portrait with Thorn Necklace and Hummingbird": "https://www.hrc.utexas.edu/frida-kahlo-self-portrait/",
  "David": "https://www.galleriaaccademiafirenze.it/en/artworks/david-michelangelo/",
  "Pietà": "https://www.basilicasanpietro.va/en/san-pietro/the-pieta-of-saint-peter-s",
  "Walking Man I": "https://www.fondation-giacometti.com/en/database/174203/walking-man-i",
  "Pointing Man": "https://www.fondation-giacometti.fr/en/database/181776/pointing-man",
  "Black Sun": "https://www.si.edu/object/black-sun-sculpture%3Asiris_ari_15043",
  "Akari Light Sculptures": "https://shop.noguchi.org/collections/akari-light-sculptures",
  "Hamlet": "https://www.folger.edu/explore/shakespeares-works/hamlet/",
  "The Night Watch": "https://www.rijksmuseum.nl/nl/collectie/object/De-Nachtwacht-van-Rembrandt-1642--beb298875917ec40ff09779a547f9442",
  "Polonaise in A-flat Major, Op. 53": "https://chopin.nifc.pl/en/chopin/kompozycja/116_polonaise-in-a-flat-major/",
  'leontyne-price': 'https://library.rcmusic.com/cgi-bin/koha/opac-ISBDdetail.pl?biblionumber=43941',
  'kathleen-battle': 'https://www.deutschegrammophon.com/en/catalogue/products/kathleen-battle-at-carnegie-hall-6627',
  'We Real Cool': 'https://www.poetryfoundation.org/poetrymagazine/poems/28112/we-real-cool',
  'The Life of Toussaint L’Ouverture': 'https://ccaha.org/news/amistad-research-centers-life-toussaint-louverture-jacob-lawrence',
  'The Builders': 'https://www.christies.com/en/lot/lot-4907445',
  'Into Bondage': 'https://www.nga.gov/artworks/166444-bondage',
  'Black Iris III': 'https://www.metmuseum.org/art/collection/search/489813',
  'The Last Supper': 'https://cenacolovinciano.org/en/museum/the-works/the-last-supper-leonardo-da-vinci-1452-1519/',
  'The Anatomy Lesson of Dr. Nicolaes Tulp': 'https://www.mauritshuis.nl/en/our-collection/artworks/146-the-anatomy-lesson-of-dr-nicolaes-tulp',
  'The Palace at 4 a.m.': 'https://www.moma.org/collection/works/80928'
};
function sourceForWork(a,w){
  const catalog = catalogSources[w.title] || catalogSources[a.id];
  if (catalog) return catalog;
  if(w.media==='music')return w.video?`https://www.youtube.com/watch?v=${w.video}`:musicSearch(a.name,w.title);
  if(w.media==='book')return bookSearch(w.title,a.name);
  return w.wiki && w.wiki!==a.wikipedia?wikiArticle(w.wiki):wikiSearch(`${w.title} ${a.name}`);
}
function mediaMarkup(a,w){let kind=w.media==='music'?'recording':w.media==='book'?'book / play':'artwork';
  if(w.media==='music'&&w.video){return `<div class="work-art"><span class="item-type">Video · ${esc(kind)}</span><div class="video-shell"><iframe loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen title="${esc(w.title)} — performance" referrerpolicy="strict-origin-when-cross-origin" src="https://www.youtube-nocookie.com/embed/${w.video}"></iframe></div></div>`}
  return `<div class="work-art" data-card-media="${esc(w.media)}"><span class="item-type">${esc(kind)}</span><div class="work-fallback">${w.media==='music'?'<span class="record-fallback">♫</span>':esc(w.title)}</div><img hidden data-kind="work" data-media="${esc(w.media)}" data-wiki="${esc(w.wiki === a.wikipedia ? '' : w.wiki)}" data-work="${esc(w.title)}" data-author="${esc(a.name)}" alt="Source-hosted image for ${esc(w.title)}" loading="lazy"/><button type="button" class="view-zoom" aria-label="Enlarge ${esc(w.title)}" data-zoom="${esc(w.title)}">↗</button></div>`
}
function workCard(a,w){const label=(catalogSources[w.title] || catalogSources[a.id]) ? 'View catalog source' : w.media==='music'?(w.video?'Watch recording':'Find a recording'):w.media==='book'?'Explore an edition':'Explore original / source';return `<article class="work-card">${mediaMarkup(a,w)}<div class="work-body"><h3>${esc(w.title)}</h3><p class="work-date">${esc(w.year)}</p><p class="work-desc">${esc(w.description)}</p><a class="work-source" href="${esc(sourceForWork(a,w))}" target="_blank" rel="noopener noreferrer"><span>${esc(label)}</span><span aria-hidden="true">↗</span></a></div></article>`}
function artistPage(id){const a=getArtist(id);if(!a)return missing();const g=getGallery(a.gallery);const members=byGallery(a.gallery);const position=members.findIndex(item=>item.id===a.id);const prev=members[(position-1+members.length)%members.length];const next=members[(position+1)%members.length];return wrapMain(`<div class="artist-page" style="--gallery-accent:${g.accent}"><div class="shell"><div class="artist-top"><a class="back-link" href="#/gallery/${g.id}"><span aria-hidden="true">←</span> Back to ${esc(g.name)}</a></div><section class="artist-intro"><div class="portrait-art"><div class="portrait-inner"><div class="portrait-placeholder" aria-hidden="true">${esc(a.name.split(' ').map(x=>x[0]).slice(0,2).join(''))}</div><img hidden data-kind="portrait" data-wiki="${esc(a.wikipedia)}" alt="Portrait of ${esc(a.name)}"/><a class="portrait-label" hidden href="${esc(wikiArticle(a.wikipedia))}" target="_blank" rel="noopener noreferrer">Portrait source ↗</a></div></div><div><div class="artist-name-tag">Gallery ${g.number} &nbsp; / &nbsp; ${esc(g.name)}</div><h1 class="artist-title">${esc(a.name)}</h1><p class="artist-dates">${esc(a.years)} &nbsp; · &nbsp; ${esc(a.role)}</p><p class="artist-description">${esc(a.bio)}</p><a class="artist-link" href="${esc(wikiArticle(a.wikipedia))}" target="_blank" rel="noopener noreferrer">Read artist biography <span aria-hidden="true">↗</span></a></div></section></div><section class="works-section"><div class="shell"><div class="works-header"><div><h2>Featured works</h2></div></div><div class="works-grid">${a.works.map(w=>workCard(a,w)).join('')}</div><p class="source-hint">Images and covers, where available, come from <a href="https://commons.wikimedia.org/" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a> or <a href="https://openlibrary.org/" target="_blank" rel="noopener noreferrer">Open Library</a>. The Chopin embed is a modern performance of his composition. Recording searches are provided where we lack an embedded performance. Some copyrighted works cannot be reproduced here; use each source link to see the original.</p></div></section><div class="shell"><nav class="artist-pager" aria-label="Browse artist exhibits"><a class="pager-link" href="#/artist/${prev.id}"><small>← Previous artist</small>${esc(prev.name)}</a><a class="pager-link" href="#/artist/${next.id}" style="text-align:right"><small>Next artist →</small>${esc(next.name)}</a></nav></div></div>`,'artist-main')}
function aboutPage(){return wrapMain(`<section class="about-section"><div class="shell"><span class="tiny eyebrow">Behind the collection</span><h1>About this museum.</h1><p>The Living Museum is an educational creative arts project featuring 31 people across five galleries: music, theater, literature, visual arts, and sculpture. Each artist page contains a short background and three selected works. The magic of the site comes from layout, color, lighting, and motion—not generated imagery.</p><p>All gallery photographs are authentic stock photographs. Artist portraits and images are requested from Wikimedia and displayed only if a Commons license can be identified; book-cover previews come from Open Library; a small number of identified performances are embedded from YouTube. We do not claim copyright ownership over artworks, book covers, or recordings. Some works are linked rather than displayed where a suitable reusable preview is unavailable.</p><div class="credit-grid"><section class="credit-panel"><h2>Photography</h2><ul>${PHOTO_CREDITS.map(x=>`<li><a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.label)} ↗</a></li>`).join('')}</ul></section><section class="credit-panel"><h2>Research & media</h2><ul><li><a href="https://en.wikipedia.org/" target="_blank" rel="noopener noreferrer">Wikipedia — artist overviews and work pages ↗</a></li><li><a href="https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia" target="_blank" rel="noopener noreferrer">Wikimedia Commons — image files and license details ↗</a></li><li><a href="https://openlibrary.org/dev/docs/api/covers" target="_blank" rel="noopener noreferrer">Open Library — authentic book covers ↗</a></li><li><a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">YouTube — source-hosted performances ↗</a></li><li><a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">Unsplash License ↗</a></li></ul></section></div></div></section>`,'about-main')}
function missing(){return wrapMain(`<section class="section"><div class="shell"><div class="tiny eyebrow">An empty room</div><h1 class="artist-title">Exhibit not found.</h1><p class="muted">This doorway doesn't lead to a gallery. Return to the collection.</p><a class="button-primary" href="#/galleries">Browse galleries ↗</a></div></section>`,'missing-main')}

// Only reusable / public-domain Commons images are put in third-party page layouts.
const wikiCache=new Map();
async function wikiImage(article){
 const title=decoded(article).replaceAll('_',' ');
 if(wikiCache.has(title))return wikiCache.get(title);
 const task=(async()=>{
  try{
   const params=new URLSearchParams({action:'query',format:'json',prop:'pageimages',titles:title,pithumbsize:'850',pilicense:'free',redirects:'1',origin:'*'});
   const res=await fetch('https://en.wikipedia.org/w/api.php?'+params,{mode:'cors'});if(!res.ok)return null;
   const data=await res.json();const page=Object.values(data.query?.pages||{})[0];
   if(!page?.thumbnail?.source||!page.pageimage)return null;
   const licenseParams=new URLSearchParams({action:'query',format:'json',prop:'imageinfo',titles:`File:${page.pageimage}`,iiprop:'extmetadata|url',iiurlwidth:'850',origin:'*'});
   const lr=await fetch('https://commons.wikimedia.org/w/api.php?'+licenseParams,{mode:'cors'});if(!lr.ok)return null;
   const ld=await lr.json();const file=Object.values(ld.query?.pages||{})[0];
   const info=file?.imageinfo?.[0];const license=(info?.extmetadata?.LicenseShortName?.value||'').toLowerCase();
   if(!/^(?:public domain|pdm|cc0|cc\s*by(?:-sa)?)(?:\s|$)/.test(license))return null;
   if (!info.url || new URL(info.url).pathname.split('/')[2] !== 'commons') return null;
   return {src:info.thumburl || info.url,source:info.descriptionurl,license};
  }catch{return null}
 })();wikiCache.set(title,task);return task;
}
const bookCache=new Map();
async function bookCover(title,author){const key=title+'|'+author;if(bookCache.has(key))return bookCache.get(key);
 const task=(async()=>{try{
  const params=new URLSearchParams({title,author,limit:'10',fields:'key,title,author_name,cover_i'});
  const res=await fetch('https://openlibrary.org/search.json?'+params,{mode:'cors'});if(!res.ok)return null;
  const data=await res.json();const norm=x=>x.toLowerCase().replace(/[^a-z0-9]/g,'');const matched=(data.docs||[]).find(d=>d.cover_i && (norm(d.title)===norm(title)||norm(d.title).startsWith(norm(title))));
  const doc=matched;return doc?{src:`https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`,source:`https://openlibrary.org${doc.key}`,license:'Book cover · publisher rights retained'}:null;
 }catch{return null}})();bookCache.set(key,task);return task;
}
async function hydrateImages(){
 const images=[...app.querySelectorAll('img[data-kind]')];
 await Promise.all(images.map(async image=>{
  const media=image.dataset.media;const result=media==='book' ?await bookCover(image.dataset.work,image.dataset.author):image.dataset.wiki ? await wikiImage(image.dataset.wiki) : null;
  if(!image.isConnected||!result?.src)return;
  image.onload=()=>{if(!image.isConnected)return;image.hidden=false;const placeholder=image.parentElement.querySelector('.portrait-placeholder, .work-fallback');if(placeholder)placeholder.hidden=true;const parent=image.closest('.work-art');if(parent){parent.classList.add('has-image');parent.dataset.source=result.source;parent.dataset.title=image.dataset.work;}const portraitLink=image.parentElement.querySelector('.portrait-label');if(portraitLink){portraitLink.hidden=false;portraitLink.href=result.source;portraitLink.textContent='Portrait · '+(result.license||'source')+' ↗';}}
  image.onerror=()=>{image.hidden=true;image.parentElement.querySelector('.work-fallback, .portrait-placeholder')?.removeAttribute('hidden')};
  image.src=result.src;image.dataset.imageSource=result.source;
 }));
}
function render(moveFocus = false){const route=currentHash();let html;
 if(route==='/'||route==='')html=home();
 else if(route==='/galleries')html=lobby();
 else if(route.startsWith('/gallery/'))html=galleryPage(route.slice('/gallery/'.length));
 else if(route.startsWith('/artist/'))html=artistPage(route.slice('/artist/'.length));
 else if(route==='/about')html=aboutPage();
 else html=missing();
 const lightbox = document.querySelector('#lightbox');
 if (lightbox.open) lightbox.close();
 app.innerHTML=html;
 if (moveFocus) app.querySelector('main').focus({preventScroll:true});
 document.title=route.startsWith('/artist/') ? `${getArtist(route.slice(8))?.name||'Artist'} · The Living Museum` : route.startsWith('/gallery/') ? `${getGallery(route.slice(9))?.name||'Gallery'} · The Living Museum`:'The Living Museum — An Exploration of Creative Minds';
 window.scrollTo({top:0,left:0,behavior:'instant'});
 hydrateImages();
}
window.addEventListener('hashchange',()=>{if(location.hash && !location.hash.startsWith('#/'))return;render(true)});
document.addEventListener('click',e=>{
 const zoom=e.target.closest('button[data-zoom]');if(zoom){const wrap=zoom.closest('.work-art');const img=wrap?.querySelector('img:not([hidden])');if(!img)return;const dialog=document.querySelector('#lightbox');document.querySelector('#lightbox-image').src=img.src;document.querySelector('#lightbox-image').alt=img.alt;document.querySelector('#lightbox-title').textContent=wrap.dataset.title||'Artwork';document.querySelector('#lightbox-source').href=img.dataset.imageSource||wrap.dataset.source||'#';dialog.showModal();}
});
document.querySelector('#lightbox-close').addEventListener('click',()=>document.querySelector('#lightbox').close());
document.querySelector('#lightbox').addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.close()});
render();
