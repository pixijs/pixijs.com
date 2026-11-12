import { extensions, loadKTX2, resolveCompressedTextureUrl, detectCompressed } from 'pixi.js';

extensions.add(loadKTX2, resolveCompressedTextureUrl, detectCompressed);
