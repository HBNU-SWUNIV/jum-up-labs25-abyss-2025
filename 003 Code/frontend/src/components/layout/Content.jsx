// src/components/layout/Content.jsx
import React from "react";
import clsx from "clsx";

/**
 * 전체 페이지 공통 content 래퍼
 * - 상단바 아래에서 시작하도록 padding-top: 0 (상단 여백 없음)
 * - 배경/텍스트는 전역 토큰 사용 (frontend/src/index.css)
 */
export default function Content({ children, className }) {
  return (
    <main className={clsx("layout-content", className)}>
      {children}
    </main>
  );
}
