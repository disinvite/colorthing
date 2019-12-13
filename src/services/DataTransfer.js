// input: Array[64]
// output: String
function chrToHexString(chrArray) {
  let hexout = '';
  const twobits = chrArray.map(x => x.toString(2).padStart(2,'0'));

  // js doesn't have 64-bit precision so we have to split it like this.
  // we also don't want to get negative numbers because we don't have uint
  for(let i = 0; i < 64; i+= 8) {
    const piece = twobits.slice(i, i + 8).join('');
    const hex = parseInt(piece, 2).toString(16).padStart(4,'0');
    hexout += hex;
  }

  return hexout;
}

// input: String
// output: Array[64]
function undoHex(hexChr) {
  const arrayOut = [];

  for(let i = 0; i < 32; i+= 4) {
    const piece = hexChr.slice(i, i + 4);
    const binary = parseInt(piece,16).toString(2).padStart(16,'0');
    for(let j = 0; j < 16; j += 2) {
      const twobit = binary.slice(j, j + 2);
      arrayOut.push(parseInt(twobit,2));
    }
  }

  return arrayOut;
}

export function Serialize(rawchr, colors, aliases) {
  const chr = rawchr.map(chrToHexString);
  const obj = { chr, colors, aliases };
  return JSON.stringify(obj);
}

export function Deserialize(jsonStr) {
  const obj = JSON.parse(jsonStr);
  const chr = obj.chr.map(undoHex);
  const colors = obj.colors;
  const aliases = obj.aliases;
  return { chr, colors, aliases }
}
