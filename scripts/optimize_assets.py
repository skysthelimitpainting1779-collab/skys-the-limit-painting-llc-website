import os
import re
from PIL import Image

def get_file_size_kb(filepath):
    try:
        return os.path.getsize(filepath) / 1024.0
    except OSError:
        return 0.0

def optimize_image(filepath, max_width=None, quality=80):
    if not os.path.exists(filepath):
        print(f"Warning: Image path not found: {filepath}")
        return

    size_before = get_file_size_kb(filepath)
    try:
        img = Image.open(filepath)
        original_format = img.format if img.format else "WEBP"
        
        # Resize if max_width is specified and image exceeds it
        if max_width and img.width > max_width:
            ratio = max_width / float(img.width)
            new_height = int(float(img.height) * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            print(f"Resized {os.path.basename(filepath)} to {max_width}x{new_height}")
            
        # Re-save with compression
        img.save(filepath, format="WEBP", quality=quality, method=6)
        size_after = get_file_size_kb(filepath)
        savings = size_before - size_after
        pct = (savings / size_before) * 100 if size_before > 0 else 0
        print(f"Optimized {os.path.basename(filepath)}: {size_before:.1f} KiB -> {size_after:.1f} KiB (Saved {savings:.1f} KiB, -{pct:.1f}%)")
    except Exception as e:
        print(f"Error optimizing {filepath}: {e}")

def minify_svg(filepath):
    if not os.path.exists(filepath):
        print(f"Warning: SVG path not found: {filepath}")
        return

    size_before = get_file_size_kb(filepath)
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        # 1. Strip XML comments
        content = re.sub(r"<!--.*?-->", "", content, flags=re.DOTALL)
        
        # 2. Strip leading and trailing whitespace per line and join
        lines = [line.strip() for line in content.splitlines()]
        lines = [line for line in lines if line] # Filter out empty lines
        
        # Join into a single compact string
        minified = " ".join(lines)
        
        # 3. Replace multiple spaces with a single space
        minified = re.sub(r"\s+", " ", minified)
        
        # 4. Remove space between tags
        minified = re.sub(r">\s+<", "><", minified)
        
        # 5. Remove space after/before equal signs and quotes within tags
        minified = re.sub(r'\s*=\s*"', '="', minified)
        minified = re.sub(r'"\s+>', '">', minified)
        minified = re.sub(r'"\s+/>', '"/>', minified)

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(minified)

        size_after = get_file_size_kb(filepath)
        savings = size_before - size_after
        pct = (savings / size_before) * 100 if size_before > 0 else 0
        print(f"Minified {os.path.basename(filepath)}: {size_before:.1f} KiB -> {size_after:.1f} KiB (Saved {savings:.1f} KiB, -{pct:.1f}%)")
    except Exception as e:
        print(f"Error minifying SVG {filepath}: {e}")

def main():
    print("--- Starting Sky's the Limit Asset Optimization ---")
    
    # 1. Optimize WebP images in public/images/site
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    site_images_dir = os.path.join(base_dir, "public", "images", "site")
    
    # Files to resize & compress
    optimize_image(os.path.join(site_images_dir, "iphone-exterior-prep-front-entry.webp"), max_width=800, quality=80)
    optimize_image(os.path.join(site_images_dir, "iphone-interior-painting-progress.webp"), max_width=800, quality=80)
    
    # Hero image: just compress at quality=80 without resizing
    optimize_image(os.path.join(site_images_dir, "marketing-hero-exterior-painting.webp"), max_width=None, quality=80)
    
    # 2. Minify master corporate logo SVG
    brand_dir = os.path.join(base_dir, "public", "brand")
    minify_svg(os.path.join(brand_dir, "SkyLLP_BrandLogo.svg"))
    
    print("--- Asset Optimization Complete ---")

if __name__ == "__main__":
    main()
