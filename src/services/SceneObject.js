// From: https://github.com/30-seconds/30-seconds-of-code
const chunk = (arr, size) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
}

const chrPieceToHex = ([p1, p2]) => (p1 * 4 + p2).toString(16);
const hexToChrPiece = h => [parseInt(h, 16) >> 2, parseInt(h, 16) & 3];

const byteToHex = n => (n & 255).toString(16).padStart(2, '0');
const ntRowToHex = row => row.map(byteToHex).join('');

function serializeChr(chrArray) {
  return chunk(chrArray, 2).map(chrPieceToHex).join('');
}

function deserializeChr(chrString) {
  return chrString.split('').map(hexToChrPiece).flat();
}

function serializeNametable(nametableArray) {
  return chunk(nametableArray, 32).map(ntRowToHex);
}

function deserializeNametable(nametableStringArray) {
  return nametableStringArray.map(str => chunk(str, 2).map(h => parseInt(h, 16))).flat();
}

function serializeAttributes(attributeArray) {
  return chunk(attributeArray, 16).map(ntRowToHex);
}

function deserializeAttributes(attributeStringArray) {
  return attributeStringArray.map(str => chunk(str, 2).map(h => parseInt(h, 16))).flat();
}

export function EmptyObject() {
  return {
    nametable: Array(960).fill(0),
    attributes: Array(256).fill(0),
    objects: Array.from(Array(64), () => {
      return {
        character: -1,
        attribute: 0,
        x: 0,
        y: 0
      }
    }),
    backgroundChr: Array.from(Array(256), () => Array(64).fill(0)),
    spriteChr: Array.from(Array(256), () => Array(64).fill(0)),
    backgroundColors: Array.from(Array(4), () => Array(4).fill(0)),
    spriteColors: Array.from(Array(4), () => Array(4).fill(0))
  }
}

export function Serialize(obj) {
  // ignore objects for now.

  const { nametable, attributes, backgroundChr, 
    spriteChr, backgroundColors, spriteColors} = obj;

  return JSON.stringify({
    nametable: serializeNametable(nametable),
    attributes: serializeAttributes(attributes),
    backgroundChr: backgroundChr.map(serializeChr),
    spriteChr: spriteChr.map(serializeChr),
    backgroundColors,
    spriteColors
  });
}


export function Deserialize(obj, json_string) {
  const json_data = JSON.parse(json_string);

  if ("nametable" in json_data) {
    obj.nametable = deserializeNametable(json_data.nametable);
  }

  if ("attributes" in json_data) {
    obj.attributes = deserializeAttributes(json_data.attributes);
  }

  // ignore objects for now.

  if ("backgroundChr" in json_data) {
    obj.backgroundChr = json_data.backgroundChr.map(deserializeChr);
  }

  if ("spriteChr" in json_data) {
    obj.spriteChr = json_data.spriteChr.map(deserializeChr);
  }

  if ("backgroundColors" in json_data) {
    obj.backgroundColors = json_data.backgroundColors;
  }

  if ("spriteColors" in json_data) {
    obj.spriteColors = json_data.spriteColors;
  }
}
