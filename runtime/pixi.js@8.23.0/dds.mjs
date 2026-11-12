import { extensions, loadDDS, detectCompressed, resolveCompressedTextureUrl } from 'pixi.js';

extensions.add(loadDDS, detectCompressed, resolveCompressedTextureUrl);
