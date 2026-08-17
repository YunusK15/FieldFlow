# FieldFlow

FieldFlow is an intelligent agricultural management application designed to assist farmers and agricultural professionals with pest classification, weather tracking, outbreak monitoring, and the latest agricultural technologies. It features a React-based frontend and an Express/MongoDB backend, integrated with a PyTorch machine learning model capable of identifying **132 Indian pest species** (trained on the Pestopia dataset).

## Features

- 🌱 **Pest Classification**: Upload images of pests to identify them using a custom PyTorch machine learning model.
- 🌤️ **Weather Integration**: Track weather conditions to make informed agricultural decisions.
- 🚨 **Outbreak Monitoring**: Stay updated on regional pest outbreaks.
- 🚜 **Agricultural Technologies**: Discover the latest technologies and practices in the agricultural sector.
- 🔐 **Authentication**: Secure user authentication using JWT and Google OAuth integration.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router, Vitest
- **Backend**: Node.js, Express, MongoDB (Mongoose), Cloudinary (for image uploads), JWT Auth
- **Machine Learning**: Python, PyTorch, Torchvision (Pest image classification)
- **Containerization**: Docker

## Prerequisites

- Node.js (v20.x recommended)
- Python 3.10+
- MongoDB

## Installation and Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd FieldFlow
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pestDB
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory (if needed) for API URLs or Google Client IDs.

Start the frontend development server:
```bash
npm run dev
```

### 4. Machine Learning Setup

The backend relies on a Python virtual environment to run the `predict.py` script.

In the root directory, create a virtual environment and install the dependencies:
```bash
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```
Ensure you have the `pest_classifier_v2.pth` (or `pest_classifier_v1.pth`) and `classes.txt` in the root directory.

## Docker Deployment

You can run the entire application using Docker:

```bash
docker build -t fieldflow .
docker run -p 5000:5000 fieldflow
```

*Note: You may need to pass environment variables to the docker container for MongoDB URI, Cloudinary credentials, etc.*

## Project Structure

- `/frontend`: React application.
- `/backend`: Express server handling API requests, authentication, and Python script execution.
- `predict.py`: Inference script for pest classification.
- `train.py`: V1 local training script for 12 generic pest species.
- `fieldflowv2.py`: V2 Colab training script for 132 Indian pest species (Pestopia dataset).
- `Dockerfile`: Containerization configuration for the app.