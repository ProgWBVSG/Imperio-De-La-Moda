from rembg import remove
from PIL import Image

input_path = r"C:\Users\benja\Propuesta Imperio de la moda\Professional_fashion_photography_of_a_202604301817.jpeg"
output_path = r"C:\Users\benja\Propuesta Imperio de la moda\public\modelo-hero-nobg.png"

print("Opening image...")
img = Image.open(input_path)

print("Removing background...")
output_img = remove(img)

print("Cropping image (waist up)...")
# Crop from top to roughly 65% of the height
width, height = output_img.size
crop_box = (0, 0, width, int(height * 0.65))
cropped_img = output_img.crop(crop_box)

cropped_img.save(output_path)
print("Saved to", output_path)
