"""Builds the avatar's idle-animation sprite sheet from the 30x40 pixel avatar.

Written by Claude (Anthropic) for this portfolio. It does not use an image- or video-generation model:
every frame is drawn by shifting or recolouring pixels of the existing sprite.

Frames (each 30x40, side by side):
  0  base
  1  lean right  - head shifts 1px right, the hair strands swing with it
  2  lean left   - the mirror of frame 1
  3  blink       - the white of each eye is replaced by skin, leaving the dark lash line

Run:  python tools/make_avatar_idle.py
Reads assets/nandita_pixel_avatar_raw_30x40.png, writes assets/avatar_idle_sheet.png (120x40).
The site plays the frames as an 8-second loop with a CSS steps() animation (see css/style.css, .idle-sprite).
"""
import os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'assets', 'nandita_pixel_avatar_raw_30x40.png')
OUT = os.path.join(ROOT, 'assets', 'avatar_idle_sheet.png')

W, H = 30, 40
HEAD_ROWS = range(6, 23)      # hair + face, down to the chin
STRAND_ROWS = range(23, 36)   # loose hair below the chin
HAIR = {(26, 23, 41), (42, 37, 66), (58, 52, 92)}  # hair colours in the sprite
WHITE_OF_EYE = (255, 255, 255)
SKIN = (224, 168, 120)


def is_strand(x, rgb):
    return (x <= 5 or x >= 24) and rgb in HAIR


def frame(src, shift=0, blink=False):
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    px = src.load()
    put = out.load()

    # 1. loose hair strands, drawn first so the body covers them where they overlap
    for y in STRAND_ROWS:
        for x in range(W):
            r, g, b, a = px[x, y]
            if a and is_strand(x, (r, g, b)):
                nx = x + shift
                if 0 <= nx < W:
                    put[nx, y] = (r, g, b, a)

    # 2. body: everything below the chin that is not a loose strand stays put
    for y in range(23, H):
        for x in range(W):
            r, g, b, a = px[x, y]
            if a and not (y in STRAND_ROWS and is_strand(x, (r, g, b))):
                put[x, y] = (r, g, b, a)

    # 3. head, shifted sideways as one piece
    for y in HEAD_ROWS:
        for x in range(W):
            r, g, b, a = px[x, y]
            if not a:
                continue
            if blink and (r, g, b) == WHITE_OF_EYE:
                r, g, b = SKIN
            nx = x + shift
            if 0 <= nx < W:
                put[nx, y] = (r, g, b, a)
    return out


def main():
    src = Image.open(SRC).convert('RGBA')
    assert src.size == (W, H), src.size
    frames = [frame(src), frame(src, shift=1), frame(src, shift=-1), frame(src, blink=True)]
    sheet = Image.new('RGBA', (W * len(frames), H), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        sheet.paste(f, (i * W, 0))
    sheet.save(OUT)
    # sanity: frame 0 must be identical to the source sprite
    assert frames[0].tobytes() == src.tobytes(), 'base frame differs from the source sprite'
    print('wrote', OUT, sheet.size)


if __name__ == '__main__':
    main()
