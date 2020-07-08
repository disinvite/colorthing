export function bin_deserializeChr(chrBin) {
    const chrArray = Array.from(Array(256), () => Array(64).fill(0));
    for (let chr_i = 0; chr_i < 256; chr_i++) {
        const chrView = new Uint8ClampedArray(chrBin, chr_i*16, 16);
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const pixel = row*8 + col;
                chrArray[chr_i][pixel] += (chrView[row]   >> (7 - col)) & 1;
                chrArray[chr_i][pixel] += ((chrView[row+8] >> (7 - col)) & 1) << 1;
            }
        }
    }
    return chrArray;
}

export function bin_serializeChr(chr) {
    const chrBuffer = new ArrayBuffer(16*256);
    for (let chr_i = 0; chr_i < 256; chr_i++) {
        const chrView = new Uint8ClampedArray(chrBuffer, chr_i*16, 16);
        for (let row = 0; row < 8; row++) {
            for(let col = 0; col < 8; col++) {
                const pixel = chr[chr_i][row*8 + col];
                chrView[row  ] |= ( pixel     & 1) << (7 - col)
                chrView[row+8] |= ((pixel>>1) & 1) << (7 - col)
            }
        }
    }
    return new Uint8ClampedArray(chrBuffer);
}

export function bin_serializeNametable(tiles, attributes) {
    const nametableBuffer = new ArrayBuffer(1024);
    const tileView = new Uint8ClampedArray(nametableBuffer, 0, 960);
    const attributeView = new Uint8ClampedArray(nametableBuffer, 960, 64);

    for (let i = 0; i < 32; i++) {
        for (let j = 0; j < 30; j++) {
            const buf_i = i*32 + j;
            tileView[buf_i] = tiles[buf_i];
        }
    }

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const topleft_i = (i*32) + (j*2);
            const topleft     = 3 & attributes[topleft_i];
            const topright    = 3 & attributes[topleft_i + 1];
            const bottomleft  = 3 & attributes[topleft_i + 16];
            const bottomright = 3 & attributes[topleft_i + 17];
            const value = (bottomright << 6) + (bottomleft << 4) + (topright << 2) + (topleft << 0);
            attributeView[i * 8 + j] = value;
        }
    }

    return new Uint8ClampedArray(nametableBuffer);
}

export function bin_deserializeNametable(buffer) {
    const tileView = new Uint8ClampedArray(buffer, 0, 960);
    const attributeView = new Uint8ClampedArray(buffer, 960, 64);
    const tileArray = Array(960).fill(0);
    const attrArray = Array(256).fill(0);

    for (let i = 0; i < 960; i++) {
        tileArray[i] = tileView[i];
    }

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const buf_i = i*8 + j;
            const arr_i = (i*32) + (j*2);
            attrArray[arr_i]      = (attributeView[buf_i]) & 3;
            attrArray[arr_i + 1]  = (attributeView[buf_i] >> 2) & 3;
            attrArray[arr_i + 16] = (attributeView[buf_i] >> 4) & 3;
            attrArray[arr_i + 17] = (attributeView[buf_i] >> 6) & 3;
        }
    }

    return { tileArray, attrArray };
}

