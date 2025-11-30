package caps.fmds.item.WebSocket;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class DataWebSocketHandler extends TextWebSocketHandler {
    // JSON 문자열, Java 객체 간의 변환을 돕는 도구
    private final ObjectMapper objectMapper = new ObjectMapper();

    // modelType을 키로, 해당 데이터를 구독한 WebSocket 세션들을 값으로 저장함 => 특정 모델 타입을 구독한 클라이언트 세션들이 이 안에 있는거임.
    private final Map<String, Set<WebSocketSession>> subscriptions = new ConcurrentHashMap<>();

    // 웹소켓이 열릴 때
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("WebSocket 연결됨: {}", session.getId());
    }

    // 웹소켓이 닫힐 때
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        log.info("WebSocket 연결 종료: {}", session.getId());
        // 모든 모델타입에 있는 세션 목룍에서 이 세션을 제거함
        subscriptions.values().forEach(set -> set.remove(session));
    }

    // 클라이언트가 웹소켓을 통해 메시지를 보냈을 때 호출되는 함수
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            JsonNode node = objectMapper.readTree(message.getPayload());
            String type = node.get("type").asText();
            String modelType = node.path("modelType").asText(null);

            switch (type) {
                case "subscribe" -> {
                    subscriptions.computeIfAbsent(modelType, k -> ConcurrentHashMap.newKeySet()).add(session);
                    session.sendMessage(new TextMessage(objectMapper.writeValueAsString(
                            Map.of("event","subscribed","modelType", modelType))));
                }
                case "unsubscribe" -> {
                    if (modelType != null) {
                        var set = subscriptions.get(modelType);
                        if (set != null) {
                            set.remove(session);
                            if (set.isEmpty()) subscriptions.remove(modelType); // 비면 room 정리
                        }
                    }
                    session.sendMessage(new TextMessage(objectMapper.writeValueAsString(
                            Map.of("event","unsubscribed","modelType", modelType))));
                }
                case "disconnect" -> {
                    session.close(CloseStatus.NORMAL); // 정상 종료
                }
                case "ping" -> {
                    session.sendMessage(new TextMessage("{\"event\":\"pong\"}"));
                }
            }
        }
        catch (Exception e) {
            log.error("메시지 처리 중 예외 발생: {}", e.getMessage());
        }
    }

    // 서버에서 데이터 변경 시 알림 전송
    // 특정 모델타입 데이터가 변경되었을 때 이 메소드를 호출해서 해당 모델타입을 구독한 클라이언트들에게 실시간 알림을 전송함.
    public void notifyModelChanged(String modelType) {
        Set<WebSocketSession> sessions = subscriptions.get(modelType);
        if (sessions != null) {
            for (WebSocketSession session : sessions) {
                try {
                    session.sendMessage(new TextMessage(
                            objectMapper.writeValueAsString(Map.of(
                                    "event", "update",
                                    "modelType", modelType
                            ))
                    ));
                } catch (IOException e) {
                    log.error("알림 전송 실패", e);
                }
            }
        }
        try {
            String nodeUrl = "http://localhost:3000/cache/event"; // 프론트 서버
            HttpClient client = HttpClient.newHttpClient();

            String jsonPayload = objectMapper.writeValueAsString(Map.of(
                    "modelType", modelType
            ));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(nodeUrl))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            client.sendAsync(request, HttpResponse.BodyHandlers.discarding());
            log.info("노드 서버에 캐시 삭제 요청 전송 완료: {}", modelType);
        } catch (Exception e) {
            log.error("노드 서버 캐시 삭제 요청 실패", e);
        }
    }



}

