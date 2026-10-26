import sys
from PIL import Image
for p in sys.argv[1:]:
    im = Image.open(p); w, h = im.size; f = 3 if w > 1000 else 1
    im = im.convert('RGB').resize((w // f, h // f))
    im.save(p.rsplit('.', 1)[0] + '-s.jpg', quality=70)
