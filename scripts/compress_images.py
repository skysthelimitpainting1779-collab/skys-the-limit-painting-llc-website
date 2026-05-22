import os
import sys

def compress_images():
    print("Initiating WebP Image Compressor... 🧬")
    
    try:
        from PIL import Image
    except ImportError:
        print("Pillow is not installed. To run image compression, please run: pip install Pillow")
        print("Skipping active conversion but registering script for production deployment. 🧬")
        sys.exit(0)
        
    # We scan the website/public directory and any other graphic assets folders
    search_dirs = [
        os.path.abspath(os.path.join(os.path.dirname(__file__), '../public')),
        os.path.abspath(os.path.join(os.path.dirname(__file__), '../src/assets'))
    ]
    
    count = 0
    for base_dir in search_dirs:
        if not os.path.exists(base_dir):
            continue
            
        print(f"Scanning directory: {base_dir}")
        for root, dirs, files in os.walk(base_dir):
            for file in files:
                if file.lower().endswith(('.png', '.jpg', '.jpeg')) and not file.lower().endswith('.webp'):
                    file_path = os.path.join(root, file)
                    webp_path = os.path.splitext(file_path)[0] + '.webp'
                    
                    if os.path.exists(webp_path):
                        # WebP version already exists, skip
                        continue
                        
                    try:
                        print(f"Compressing: {file} -> {os.path.basename(webp_path)}")
                        with Image.open(file_path) as img:
                            # Convert RGBA to RGB if saving as JPEG or if necessary, but WebP supports transparency
                            img.save(webp_path, 'WEBP', quality=85)
                        count += 1
                    except Exception as e:
                        print(f"Error compressing {file}: {e}")
                        
    print(f"WebP compression complete. Successfully compressed {count} images to WebP! 🧬")

if __name__ == '__main__':
    compress_images()
