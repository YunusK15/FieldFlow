import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import sys

def predict(image_path):
    # Set device
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

    # Load classes
    with open('classes.txt', 'r') as f:
        classes = [line.strip() for line in f.readlines()]

    # Load model
    model = models.resnet18()
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, len(classes))
    model.load_state_dict(torch.load('pest_classifier_best.pth', map_location=device))
    model = model.to(device)
    model.eval()

    # Transformations
    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    # Load and preprocess image
    try:
        img = Image.open(image_path).convert('RGB')
        img_t = preprocess(img)
        batch_t = torch.unsqueeze(img_t, 0).to(device)

        # Inference
        with torch.no_grad():
            outputs = model(batch_t)
            _, index = torch.max(outputs, 1)
            percentage = torch.nn.functional.softmax(outputs, dim=1)[0] * 100
            
            confidence = percentage[index[0]].item()
            label = classes[index[0]]

        import json
        print(json.dumps({"label": label, "confidence": confidence}))
    except Exception as e:
        import json
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python predict.py <image_path>")
    else:
        predict(sys.argv[1])
