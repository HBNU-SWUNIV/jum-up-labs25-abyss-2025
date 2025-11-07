# # test2.py
# import os
# import time
# import argparse
# import cv2

# # OpenCV가 RTSP 스트림을 받을 때 옵션을 지정
# # - rtsp_transport=tcp : TCP 방식으로 RTSP를 받음 (UDP보다 안정적)
# # - stimeout=5000000   : 타임아웃 5초 (단위: 마이크로초)
# os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;tcp|stimeout;5000000"

# def open_stream(url):
#     # RTSP 스트림 열기 (FFMPEG 백엔드 사용)
#     cap = cv2.VideoCapture(url, cv2.CAP_FFMPEG)
#     if not cap.isOpened():
#         # 열리지 않으면 에러 발생
#         raise RuntimeError(f"Cannot open RTSP stream: {url}")
#     return cap

# def main():
#     # 명령어 인자 처리
#     parser = argparse.ArgumentParser()
#     parser.add_argument("--url", default="rtsp://192.168.50.203:8554/live.sdp", help="RTSP url from iPhone")
#     parser.add_argument("--title", default="iPhone RTSP", help="Window title")
#     args = parser.parse_args()

#     cap = None             # 비디오 캡처 객체

#     # 연결 함수 (연결 실패 시 재연결 처리)
#     def reconnect():
#         nonlocal cap
#         if cap is not None:
#             cap.release()  # 기존 스트림 닫기
#         time.sleep(1.0)    # 1초 대기 후 재연결
#         cap = open_stream(args.url)

#     try:
#         reconnect()   # 처음 실행 시 연결
#         while True:
#             # 프레임 읽기
#             ok, frame = cap.read()
#             if not ok or frame is None:
#                 print("❗ Stream read failed. Reconnecting...")
#                 reconnect()
#                 continue


#             # 프레임 띄우기
#             cv2.imshow(args.title, frame)

#             # 'q' 키 누르면 종료
#             key = cv2.waitKey(1) & 0xFF
#             if key == ord('q'):
#                 break

#     except Exception as e:
#         print(f"Error: {e}")
#     finally:
#         # 자원 해제
#         if cap is not None:
#             cap.release()
#         cv2.destroyAllWindows()

# if __name__ == "__main__":
#     main()






# test2.py  —  RTSP(아이폰/네트워크 카메라) + YOLO 사람 감지 오버레이 (안정화 버전)
import os
import time
import argparse
import cv2
import threading
import collections

from yolo_detector_test import YoloPersonDetector  # 사람만 감지하는 YOLO 래퍼

# OpenCV FFMPEG 백엔드가 RTSP를 받을 때의 안정화 옵션
# - rtsp_transport=tcp : TCP로 수신(UDP보다 안정적)
# - stimeout=5000000   : 5초(마이크로초 단위) 타임아웃
os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;tcp|stimeout;5000000"


class RTSPReader:
    """
    별도 스레드에서 RTSP 프레임을 계속 읽어 최신 프레임 1장만 유지하는 리더.
    - 메인 스레드는 최신 프레임만 꺼내와서 추론/표시에 집중 -> 지연 누적 방지
    - 끊김 발생 시 자동 재연결
    """
    def __init__(self, url: str):
        self.url = url
        self.cap = None
        self.q = collections.deque(maxlen=1)  # 최신 프레임 1장만 보관 (지연 최소화)
        self.alive = False
        self.th = None  # 백그라운드 리더 스레드 핸들

    def _open(self):
        """RTSP 스트림을 연다(FFMPEG 백엔드 사용). 실패 시 예외."""
        cap = cv2.VideoCapture(self.url, cv2.CAP_FFMPEG)
        if not cap.isOpened():
            raise RuntimeError(f"Cannot open RTSP stream: {self.url}")
        return cap

    def start(self):
        """리더 스레드를 시작한다."""
        self.alive = True
        self.cap = self._open()
        self.th = threading.Thread(target=self._loop, daemon=True)
        self.th.start()

    def _loop(self):
        """계속 프레임을 읽어 최신 프레임만 큐에 보관. 실패 시 자동 재연결."""
        while self.alive:
            ok, frame = self.cap.read()
            if not ok or frame is None:
                self._reconnect()
                continue
            self.q.append(frame)

    def _reconnect(self):
        """끊김 시 캡처를 닫고 잠시 대기 후 재연결."""
        try:
            if self.cap:
                self.cap.release()
        except:
            pass
        time.sleep(1.0)
        self.cap = self._open()

    def read_latest(self):
        """가장 최신 프레임을 반환. 아직 없으면 None."""
        return self.q[-1] if self.q else None

    def stop(self):
        """리더 종료 및 자원 해제."""
        self.alive = False
        try:
            if self.cap:
                self.cap.release()
        except:
            pass


def main():
    # 실행 인자 정의
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default="rtsp://192.168.50.203:8554/live.sdp", help="RTSP URL")
    ap.add_argument("--title", default="RTSP + YOLO", help="Window title")
    ap.add_argument("--weights", default="yolov8n.pt", help="YOLO weights path")
    ap.add_argument("--conf", type=float, default=0.35, help="YOLO confidence threshold (0~1)")
    ap.add_argument("--imgsz", type=int, default=480, help="YOLO inference image size")
    args = ap.parse_args()

    # RTSP 프레임 리더 시작
    reader = RTSPReader(args.url)
    reader.start()

    # YOLO 사람 감지기 (클래스 내부에서 classes=[0]으로 person만)
    det = YoloPersonDetector(weights=args.weights, conf=args.conf, imgsz=args.imgsz)

    try:
        while True:
            frame = reader.read_latest()
            if frame is None:
                # 아직 수신 전이거나 잠시 끊김 -> 아주 짧게 대기 후 재시도
                time.sleep(0.005)
                continue

            # YOLO로 사람 감지 후 박스/라벨 오버레이된 프레임 반환
            frame = det.detect_and_draw(frame)

            # 화면 표시
            cv2.imshow(args.title, frame)
            if (cv2.waitKey(1) & 0xFF) == ord('q'):
                break

    finally:
        reader.stop()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()