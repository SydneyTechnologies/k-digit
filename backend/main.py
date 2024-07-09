import base64
import pickle
import numpy as np
from PIL import Image
from io import BytesIO
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  
from pydantic import BaseModel
import logging
import binascii


digit_knn = pickle.load(open('k-digit.sav', 'rb'))
app = FastAPI(description="This is a simple API for digit recognition using KNN model", debug=False)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

logging.basicConfig(level=logging.INFO)



class ImageRequest(BaseModel):
    image: str


def decode_base64(data):
    # Add missing padding if necessary
    missing_padding = len(data) % 4
    if missing_padding:
        data += '=' * (4 - missing_padding)
    
    try:
        decoded_data = base64.b64decode(data)
        return decoded_data
    except binascii.Error as e:
        return None
    
@app.post("/predict/")
def predict_digit(file: ImageRequest):
    try:
        # also accept base64 encoded image
        test_image = decode_base64(file.image.split(",")[1])  
        
        _image = Image.open(BytesIO(test_image))
        
        logging.info("Image opened", file)

        # convert image to grayscale
        _gray_image = _image.convert('L')

        # resize image to 28x28
        _resized_image = _gray_image.resize((28, 28))
        # _resized_image = _gray_image

        _resized_image.save("resized_image.png")

        # convert image to numpy array
        _image_array = np.array(_resized_image)

        prediction = digit_knn.predict([_image_array.flatten()]).tolist()[0]
        probability = digit_knn.predict_proba([_image_array.flatten()]).tolist()[0][prediction]



        result = {
            "prediction": prediction,
            "probability": probability
        }
        return result
    except Exception as e:
        logging.error(f"Error predicting digit: {e}")
        return {"error": "Error predicting digit"}

