// src/pages/Unauthorized/Unauthorized.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./unauthorized.css";

export default function Unauthorized() {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-card" role="alert">
        <h2>접근 권한이 없습니다</h2>
        <p>
          해당 페이지에 접근할 권한이 없습니다.
          <br />
          관리자에게 문의하세요.
        </p>
        <Link to="/home" className="back-home-btn" aria-label="홈으로 돌아가기">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
