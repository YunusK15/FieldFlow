# -*- coding: utf-8 -*-
"""FieldFlowV2.ipynb

FieldFlow V2 Training Script (Google Colab)
Trains a ResNet18 model on the Pestopia dataset (132 Indian pest species)
Dataset: https://www.kaggle.com/datasets/shruthisindhura/pestopia
For the V1 local training script (12 species), see train.py

Original file is located at
    https://colab.research.google.com/drive/1ajwmp30e3M5Giv1JcDeoGx_CwPAE5N7J
"""


import os
import copy
import time
import json
import kagglehub
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader, random_split
from google.colab import files

# 2. Download Pestopia Dataset from Kaggle
print("Downloading Pestopia dataset from Kaggle...")
dataset_root = kagglehub.dataset_download("shruthisindhura/pestopia")
print("Dataset downloaded to:", dataset_root)

# 3. Locate the exact directory containing the pest class folders
def find_pest_classes_dir(root_path):
    best_dir = None
    max_classes = 0
    valid_exts = ('.jpg', '.jpeg', '.png', '.bmp', '.webp')

    for current_root, dirs, _ in os.walk(root_path):
        if len(dirs) > 1:
            # Check how many subdirectories directly contain images
            class_count = 0
            for d in dirs:
                subdir_path = os.path.join(current_root, d)
                if os.path.isdir(subdir_path):
                    try:
                        has_img = any(f.lower().endswith(valid_exts) for f in os.listdir(subdir_path))
                        if has_img:
                            class_count += 1
                    except Exception:
                        pass
            if class_count > max_classes:
                max_classes = class_count
                best_dir = current_root

    return best_dir, max_classes

data_dir, num_found_classes = find_pest_classes_dir(dataset_root)
print(f"\nTarget image directory found: {data_dir}")
print(f"Number of pest classes detected: {num_found_classes}")

# 4. Transformations
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
print(f"Training device: {device} ({torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU'})")

data_transforms = {
    'train': transforms.Compose([
        transforms.RandomResizedCrop(224),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ]),
    'val': transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ]),
}

# 5. Load Dataset
full_dataset = datasets.ImageFolder(data_dir, data_transforms['train'])
class_names = full_dataset.classes
num_classes = len(class_names)

print(f"\nTotal images: {len(full_dataset)}")
print(f"Total classes ({num_classes}):")
print(class_names[:10], "... and", num_classes - 10, "more")

# 6. Split (80% Train, 20% Val)
train_size = int(0.8 * len(full_dataset))
val_size = len(full_dataset) - train_size
train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])

val_dataset.dataset = copy.deepcopy(full_dataset)
val_dataset.dataset.transform = data_transforms['val']

train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True, num_workers=2, pin_memory=True)
val_loader = DataLoader(val_dataset, batch_size=64, shuffle=False, num_workers=2, pin_memory=True)

# 7. Model Setup (Pretrained ResNet18)
model = models.resnet18(weights='IMAGENET1K_V1')

# Replace the output layer to match the new number of classes
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, num_classes)
model = model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.0003)
scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=4, gamma=0.5)

# 8. Train the Model
num_epochs = 10
best_acc = 0.0
best_model_wts = copy.deepcopy(model.state_dict())

print("\nStarting Training...")
for epoch in range(num_epochs):
    print(f'\nEpoch {epoch + 1}/{num_epochs}')
    print('-' * 25)

    for phase in ['train', 'val']:
        if phase == 'train':
            model.train()
            dataloader = train_loader
        else:
            model.eval()
            dataloader = val_loader

        running_loss = 0.0
        running_corrects = 0

        for inputs, labels in dataloader:
            inputs = inputs.to(device)
            labels = labels.to(device)

            optimizer.zero_grad()

            with torch.set_grad_enabled(phase == 'train'):
                outputs = model(inputs)
                _, preds = torch.max(outputs, 1)
                loss = criterion(outputs, labels)

                if phase == 'train':
                    loss.backward()
                    optimizer.step()

            running_loss += loss.item() * inputs.size(0)
            running_corrects += torch.sum(preds == labels.data)

        if phase == 'train':
            scheduler.step()

        epoch_loss = running_loss / len(dataloader.dataset)
        epoch_acc = running_corrects.double() / len(dataloader.dataset)

        print(f'{phase.capitalize()} Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}')

        if phase == 'val' and epoch_acc > best_acc:
            best_acc = epoch_acc
            best_model_wts = copy.deepcopy(model.state_dict())

print(f'\nBest Validation Accuracy: {best_acc:.4f}')

# 9. Save and Download
torch.save(best_model_wts, 'pest_classifier_v2.pth')

with open('classes.txt', 'w') as f:
    for item in class_names:
        f.write(f"{item}\n")

print("\nModel saved! Downloading files to your computer...")
files.download('pest_classifier_v2.pth')
files.download('classes.txt')