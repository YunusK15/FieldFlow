import sys
print(f"Python: {sys.version}")
try:
    import torch
    print(f"PyTorch: {torch.__version__}")
    print(f"CUDA: {torch.cuda.is_available()}")
except ImportError:
    print("PyTorch: NOT INSTALLED")
try:
    from PIL import Image
    print("Pillow: OK")
except ImportError:
    print("Pillow: NOT INSTALLED")
try:
    from torchvision import models
    print("torchvision: OK")
except ImportError:
    print("torchvision: NOT INSTALLED")
import os
print(f"Model file exists: {os.path.exists('pest_classifier_best.pth')}")
print(f"Classes file exists: {os.path.exists('classes.txt')}")
