import os
import re

def replace_image_refs():
    print("Initiating Codebase Image References to WebP Replacer...")
    
    src_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../src'))
    if not os.path.exists(src_dir):
        print(f"Source directory not found: {src_dir}")
        return
        
    print(f"Scanning codebase files in: {src_dir}")
    
    # Exclude files that are not react components or styling
    allowed_extensions = ('.tsx', '.ts', '.css', '.html')
    
    # Matching .png, .jpg, .jpeg but NOT .webp, within quotes
    # e.g. "/brand/some-logo.png" -> "/brand/some-logo.webp"
    pattern = re.compile(r'([\'"/][^\'"]+\.)(png|jpg|jpeg)([\'"])', re.IGNORECASE)
    
    count = 0
    file_count = 0
    
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(allowed_extensions):
                file_path = os.path.join(root, file)
                
                # Skip context.md and similar non-code files
                if file.endswith('.md'):
                    continue
                    
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    # We perform search and replace
                    new_content, num_subs = pattern.subn(r'\1webp\3', content)
                    
                    if num_subs > 0:
                        # Write back only if changes were made
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated {num_subs} reference(s) in: {file}")
                        count += num_subs
                        file_count += 1
                except Exception as e:
                    print(f"Error processing file {file}: {e}")
                    
    print(f"Image reference replacement complete. Updated {count} reference(s) across {file_count} file(s)!")

if __name__ == '__main__':
    replace_image_refs()
