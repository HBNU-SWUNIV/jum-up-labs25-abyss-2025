// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; 
// (직접 구현한 AuthContext 훅, 또는 Zustand/Recoil 훅)

/**
 * roles: 접근을 허용할 역할 배열 (예: ['admin', 'manager'])
 */
const ProtectedRoute = ({ roles = [] }) => {
  const { isLoggedIn, userRole } = useAuth();

  // 1) 로그인 안 되어 있으면 → 로그인 페이지
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 2) roles 지정 시 권한 체크
  if (roles.length > 0 && !roles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3) 통과 → 중첩 라우트 렌더링
  return <Outlet />;
};

export default ProtectedRoute;
