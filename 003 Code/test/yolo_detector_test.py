# yolo_detector.py
from ultralytics import YOLO
import cv2

class YoloPersonDetector:
    def __init__(self, weights="yolov8n.pt", conf=0.25, imgsz=640):
        self.model = YOLO(weights)
        self.conf = conf
        self.imgsz = imgsz

    def detect_and_draw(self, frame):
        # 사람(class=0)만 추론
        results = self.model(
            frame,
            classes=[0],        # <- person만
            conf=self.conf,     # 필요시 0.15~0.35로 튜닝
            imgsz=self.imgsz,
            verbose=False
        )

        for r in results:
            if r.boxes is None:
                continue
            for box in r.boxes:
                # 여기까지 오면 이미 person만
                x1, y1, x2, y2 = box.xyxy[0].int().tolist()
                conf = float(box.conf[0])
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 3)
                cv2.putText(frame, "Person", (x1, y1-10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,0), 2)
        return frame