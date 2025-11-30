// FMDS_2.0/frontend/src/components/topbar/Topbar.jsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import "./topbar.css";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import ThemeToggle from "components/ThemeToggle";

// ⬇️ 로고 추가
import LogoFmds from "assets/logo.svg";

/**
 * Topbar: 로고 + 알림 + 사용자 드롭다운 + 다크모드 토글
 */
export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 알림/메뉴 패널 토글 상태
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  // 임시 알림 데이터
  const [notifs, setNotifs] = useState([
    { id: 1, text: "대시보드 템플릿이 저장되었습니다.", ts: "방금 전", unread: true },
    { id: 2, text: "새 플러그인(LineChart2) 등록 완료.", ts: "1시간 전", unread: true },
    { id: 3, text: "시스템 점검 예정 23:00 ~ 24:00", ts: "어제", unread: false },
  ]);

  const unreadCount = useMemo(
    () => notifs.filter((n) => n.unread).length,
    [notifs]
  );

  // 외부 클릭 닫힘
  const rightRef = useRef(null);
  useEffect(() => {
    const onClick = (e) => {
      if (!rightRef.current) return;
      if (!rightRef.current.contains(e.target)) {
        setNotifOpen(false);
        setUserOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setUserOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));

  // 이니셜 생성
  const initials = useMemo(() => {
    const name = (user?.name || "User").trim();
    const parts = name.split(/\s+/);
    const first = parts[0]?.[0] || "U";
    const last = parts[1]?.[0] || "";
    return (first + last).toUpperCase();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true, state: { from: location } });
  };

  return (
    <header className="topbar" role="banner">
      <div className="topbarWrapper">
        {/* ⬇️ 좌측 로고 (이미지) */}
        <div className="topLeft">
          <Link to="/home" className="brandLogo" aria-label="Go to Home">
            <img src={LogoFmds} alt="FMDS" className="logoImg" />
            {/* <span className="logoText">FMDS</span> */}
          </Link>
        </div>

        <div className="topRight" ref={rightRef}>
          {/* 알림 */}
          <button
            className="topbarIconContainer"
            aria-label="Notifications"
            aria-expanded={notifOpen}
            aria-controls="notif-panel"
            onClick={(e) => {
              e.stopPropagation();
              setNotifOpen((v) => !v);
              setUserOpen(false);
            }}
          >
            <NotificationsNoneIcon />
            {unreadCount > 0 && <span className="topIconBadge">{unreadCount}</span>}
          </button>

          {/* 알림 패널 */}
          {notifOpen && (
            <div id="notif-panel" className="popup" style={{ right: 88 }}>
              <div className="notifHeader">
                <span>알림</span>
                <button className="menuItem" onClick={markAllRead}>
                  모두 읽음 처리
                </button>
              </div>
              <div className="notifList" role="list">
                {notifs.length === 0 && <div className="notifEmpty">알림이 없습니다.</div>}
                {notifs.map((n) => (
                  <div key={n.id} className="notifItem" role="listitem">
                    <div>
                      <div>{n.text}</div>
                      <div className="notifMeta">{n.ts}</div>
                    </div>
                    {n.unread && <span className="notifUnreadDot" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 설정 */}
          <Link
            to="/setting"
            className="topbarIconContainer"
            aria-label="Settings"
            title="Settings"
          >
            <SettingsIcon />
          </Link>

          {/* 다크모드 토글 */}
          <ThemeToggle />

          {/* 사용자 아바타(이니셜) */}
          <button
            className="topbarIconContainer avatarBtn"
            aria-label="User menu"
            aria-expanded={userOpen}
            aria-controls="user-menu"
            onClick={(e) => {
              e.stopPropagation();
              setUserOpen((v) => !v);
              setNotifOpen(false);
            }}
            title={user?.name || "User"}
          >
            {initials}
          </button>

          {/* 사용자 드롭다운 */}
          {userOpen && (
            <div id="user-menu" className="popup userMenu">
              <div className="menuList">
                <Link to="/user" className="menuItem">
                  <PersonIcon fontSize="small" />
                  <span>My Profile</span>
                </Link>
                <Link to="/setting" className="menuItem">
                  <SettingsIcon fontSize="small" />
                  <span>Settings</span>
                </Link>
                <div className="menuDivider" />
                <button className="menuItem danger" onClick={handleLogout}>
                  <LogoutIcon fontSize="small" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
