from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
from ultralytics import YOLO
import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)
logging.getLogger('ultralytics').setLevel(logging.CRITICAL)
app = Flask(__name__)
CORS(app)
model = YOLO("best.pt",verbose=False)
class_colors = {  
    0: (0, 255, 238),          
    1: (0, 0, 255),             
    2: (0, 0, 0),         
    3: (58, 129, 183),          
    4: (109, 45,198),             
    5: (29, 255, 0),           
}  

def detect_image(img):
         
         results = model.predict(source=img, stream=True)  
         for r in results:
          boxes=r.boxes
          for box in boxes:
              x1, y1, x2, y2 = box.xyxy[0]
              x1, y1, x2, y2 = int(x1), int(y1), int(x2),int(y2)  
              class_index=int(box.cls[0])
              class_name=model.names[class_index]
              color= class_colors.get(class_index)
              cv2.rectangle(img,(x1,y1),(x2,y2),color,2)
              label=f"{class_name}{box.conf[0]:2f}"
              cv2.putText(img,label,(x1,y1-10),cv2.FONT_HERSHEY_SIMPLEX,0.5,color,2)
     
         _, buffer = cv2.imencode('.jpg', img)
            
         return base64.b64encode(buffer).decode("utf-8")
        

@app.route("/process_image_upload", methods=["POST"])  
def process_upload():  
   data = request.get_json()  
   if "image" not in data:  
        return jsonify({'error': 'No image data provided'}), 400  
   try:
        image_data = data["image"].split(",")[1]  # Remove 'data:image/jpeg;base64,'  
        img_bytes = base64.b64decode(image_data)  
        nparr = np.frombuffer(img_bytes, np.uint8)  
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)  

        if img is None:  
            return jsonify({'error': 'Could not decode image'}), 400  

        # Process the image  
        processed_image = detect_image(img)  
        if processed_image:
             return jsonify({"processed_image": f"data:image/jpeg;base64,{processed_image}"}) 
        else:
            return jsonify({'error': 'Image processing failed'}), 500
   except Exception as e:
        logging.error(f"Error in process_image: {e}")
        return jsonify({'error': 'Server error'}), 500 
    

@app.route("/process_image_live", methods=["POST"])
def process_image():
    data = request.get_json()
    image_data = data["image"]
    # Decode the base64 image
    image_data = image_data.split(",")[1]
    img_bytes = base64.b64decode(image_data)
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    processed_image_base64= detect_image(img);
    return jsonify({"processed_image": f"data:image/jpeg;base64,{processed_image_base64}"})

if __name__ == "__main__":
    app.run(debug=True,port=8080)
