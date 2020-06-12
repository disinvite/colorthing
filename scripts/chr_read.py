AsciiArt = ' \u2591\u2593\u2588'
#AsciiArt = '.123'

class BitPlaneWrongSizeError(Exception):
    pass

def squeeze_bits(byte):
    pass

def flay_bits(byte):
    """i.e. 0b11111111 to 0b1010101010101010"""
    return sum([(byte & (1<<i)) << (i+1) for i in range(8)])

def combine_bitplanes(bitplanes):
    if len(bitplanes) != 16:
        raise BitPlaneWrongSizeError

    bp1 = [b for b in bitplanes[0:8]]
    bp2 = [b for b in bitplanes[8:16]]

    return [(flay_bits(bp1[i])>>1) + flay_bits(bp2[i]) for i in range(8)]

def combined_bitplanes_to_ascii(row):
    return ''.join([AsciiArt[ (row >> i) & 3 ] for i in range(14,-2,-2)])

def dump_to_hexstring(sprite):
    return ''.join(f"{b:04x}" for b in sprite)

def main():
    with open("../../../Super Mario Bros (JU) (PRG 0).nes", "rb") as f:
        data = f.read()

    chr_rom = data[0x8010:]

    for cdata in [chr_rom[i : i + 16] for i in range(0, len(chr_rom), 16)]:
        combined = combine_bitplanes(cdata)
        """
        for b in combined:
            print(combined_bitplanes_to_ascii(b))
        print('\n')
        """
        print(f'"{dump_to_hexstring(combined)}",')

if __name__ == "__main__":
    main()
