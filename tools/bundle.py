"""Generate the one-file preview from the editable main website (stdlib only)."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'src/styles.css').read_text(encoding='utf-8')
data=(ROOT/'src/data.js').read_text(encoding='utf-8').replace('export const ','const ')
app=(ROOT/'src/app.js').read_text(encoding='utf-8').replace("import {ARTISTS, GALLERIES, PHOTOS, PHOTO_CREDITS, getGallery, getArtist, byGallery} from './data.js';",'')
html=html.replace('<link rel="stylesheet" href="./src/styles.css" />','<style>'+css+'</style>')
html=html.replace('<script type="module" src="./src/app.js"></script>','<script>\n'+data+'\n'+app+'\n</script>')
html=html.replace('<link rel="icon" type="image/svg+xml" href="./assets/favicon.svg" />','')
(ROOT/'museum-preview.html').write_text(html,encoding='utf-8')
print(f"Generated {ROOT / 'museum-preview.html'}")
