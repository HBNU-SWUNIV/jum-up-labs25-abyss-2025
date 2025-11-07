import os

# 카메라 URL
CAMERA_URL = os.getenv("CAMERA_URL", "rtsp://admin:12345678abs@192.168.50.114:554/h264Preview_01_main")


YOLO_WEIGHTS = os.getenv("YOLO_WEIGHTS", "yolov8n.pt")
YOLO_CONF = float(os.getenv("YOLO_CONF", "0.35"))
YOLO_IMGSZ = int(os.getenv("YOLO_IMGSZ", "480"))

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://admin:5003@fmds.ydvxk.mongodb.net/?retryWrites=true&w=majority&appName=FMDS")
MONGO_DB  = os.getenv("MONGO_DB", "data")
CAM_ID    = os.getenv("CAM_ID", "cam-1")

POSE_SAVE_HZ = float(os.getenv("POSE_SAVE_HZ", "5"))
