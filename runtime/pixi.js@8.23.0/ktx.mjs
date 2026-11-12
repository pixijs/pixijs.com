import { extensions, loadKTX, resolveCompressedTextureUrl, detectCompressed } from 'pixi.js';

extensions.add(loadKTX, resolveCompressedTextureUrl, detectCompressed);
