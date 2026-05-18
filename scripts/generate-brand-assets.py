from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "brand" / "generated"


def open_cover(relative_path, size):
    image = Image.open(ROOT / relative_path).convert("RGB")
    image.thumbnail((size[0] * 1.2, size[1] * 1.2), Image.Resampling.LANCZOS)
    scale = max(size[0] / image.width, size[1] / image.height)
    resized = image.resize((int(image.width * scale), int(image.height * scale)), Image.Resampling.LANCZOS)
    left = max(0, (resized.width - size[0]) // 2)
    top = max(0, (resized.height - size[1]) // 2)
    return resized.crop((left, top, left + size[0], top + size[1]))


def tint(image, saturation=0.75, contrast=1.08, brightness=0.82):
    image = ImageEnhance.Color(image).enhance(saturation)
    image = ImageEnhance.Contrast(image).enhance(contrast)
    image = ImageEnhance.Brightness(image).enhance(brightness)
    return image


def add_overlays(canvas, accent=(240, 192, 103)):
    draw = ImageDraw.Draw(canvas, "RGBA")
    w, h = canvas.size
    draw.rectangle((0, 0, w, h), fill=(5, 5, 5, 92))
    for x in range(0, w, 96):
        draw.line((x, 0, x, h), fill=(255, 255, 255, 14), width=1)
    for y in range(0, h, 96):
        draw.line((0, y, w, y), fill=(255, 255, 255, 12), width=1)
    for x in range(0, w, 112):
        draw.rectangle((x, 0, min(x + 72, w), 8), fill=(*accent, 210))
    draw.rectangle((0, int(h * 0.62), w, h), fill=(5, 5, 5, 120))
    draw.rectangle((0, 0, int(w * 0.52), h), fill=(5, 5, 5, 116))
    draw.line((0, h - 72, w, h - 72), fill=(*accent, 160), width=2)
    return canvas


def composite(name, images, accent=(240, 192, 103)):
    size = (1920, 1080)
    canvas = Image.new("RGB", size, (8, 8, 7))
    slots = [
        (0, 0, 1180, 1080),
        (1180, 0, 1920, 540),
        (1180, 540, 1920, 1080),
    ]
    for slot, source in zip(slots, images):
        box = (slot[0], slot[1], slot[2], slot[3])
        tile = open_cover(source, (box[2] - box[0], box[3] - box[1]))
        tile = tint(tile)
        canvas.paste(tile, box)

    canvas = add_overlays(canvas, accent)
    canvas = canvas.filter(ImageFilter.UnsharpMask(radius=1.2, percent=120, threshold=4))
    canvas.save(OUT / name, "WEBP", quality=78, method=6)


def square_composite(name, images, accent=(240, 192, 103)):
    size = (1400, 1400)
    canvas = Image.new("RGB", size, (8, 8, 7))
    slots = [
        (0, 0, 920, 1400),
        (920, 0, 1400, 700),
        (920, 700, 1400, 1400),
    ]
    for slot, source in zip(slots, images):
        box = (slot[0], slot[1], slot[2], slot[3])
        tile = open_cover(source, (box[2] - box[0], box[3] - box[1]))
        canvas.paste(tint(tile), box)
    canvas = add_overlays(canvas, accent)
    canvas.save(OUT / name, "WEBP", quality=80, method=6)


OUT.mkdir(parents=True, exist_ok=True)

composite(
    "sky-residential-authority.webp",
    [
        "public/brand/work/sky-work-02-finished-living-room.png",
        "public/brand/gbp/SkyGBP_Interior_Action.png",
        "public/brand/generated/premium-residential-finished-room.png",
    ],
    (240, 192, 103),
)

composite(
    "sky-commercial-authority.webp",
    [
        "public/brand/work/sky-work-08-finished-commercial.png",
        "public/brand/gbp/SkyGBP_Branded_Equipment.png",
        "public/brand/generated/premium-commercial-crew.png",
    ],
    (255, 90, 0),
)

composite(
    "sky-public-authority.webp",
    [
        "public/brand/work/SkyLLP_ParkingLot_Striping.png",
        "public/brand/gbp/SkyGBP_LightPole_Painting.png",
        "public/brand/gbp/SkyGBP_Branded_Equipment.png",
    ],
    (240, 192, 103),
)

composite(
    "sky-local-authority.webp",
    [
        "public/brand/gbp/SkyGBP_Exterior_Action_Logo.png",
        "public/brand/gbp/SkyGBP_SurfacePrep_Closeup_1.png",
        "public/brand/work/sky-work-real-04-before-after-bedroom.png",
    ],
    (255, 90, 0),
)

composite(
    "sky-service-proof.webp",
    [
        "public/brand/gbp/SkyGBP_SurfacePrep_Closeup_2.png",
        "public/brand/work/sky-work-01-finished-kitchen.png",
        "public/brand/work/sky-work-real-08-commercial.png",
    ],
    (240, 192, 103),
)

square_composite(
    "sky-owner-proof.webp",
    [
        "public/brand/gbp/SkyGBP_Branded_Equipment.png",
        "public/brand/gbp/SkyGBP_Interior_Action.png",
        "public/brand/gbp/SkyGBP_SurfacePrep_Closeup_1.png",
    ],
    (255, 90, 0),
)
