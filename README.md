# K-Digit

K-Digit is an ML project that uses a K-Nearest Neighbors (KNN) algorithm to identify handwritten digits. The project consists of two parts: the frontend and the backend.

## Description

### Frontend
The frontend is developed using React and leverages the HTML5 Browser API to facilitate touch and mouse drawing on a canvas. Users can draw digits on the canvas, which are then sent to the backend for identification.

### Backend
The backend is implemented in Python using FastAPI. It hosts the KNN model that identifies the drawn digits. The model was trained on the MNIST dataset. Note that the training process of the model is not included in this repository; the repo demonstrates the implementation of the pre-trained model.

## How to run

Follow these steps to set up and run the project:

### Frontend

1. Navigate to the frontend folder:
   `cd frontend`
2. Install the necessary dependencies:
   `npm run dev`

### Backend

1. Navigate to the backend folder:
   `cd backend`
2. Create and activate a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate   # On Windows, use `venv\Scripts\activate`
    ```
3. Install the required dependencies:
   `pip install -r requirements.txt`
4. Start the FastAPI server:
    `uvicorn main:app --reload or fastapi dev main.py`
