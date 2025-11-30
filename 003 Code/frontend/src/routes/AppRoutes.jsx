// frontend/src/routes/AppRoutes.jsx
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DefaultLayout from "layouts/DefaultLayout";
import { routes } from './routeConfig';

const AppRoutes = () => {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
      <Routes>
        {/* Public routes */}
        {routes.filter(r => r?.meta?.public).map(r => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}

        {/* Layout wrapper */}
        <Route element={<DefaultLayout />}>
          {/* 로그인 필요 (roles 미지정) */}
          <Route element={<ProtectedRoute />}>
            {routes
              .filter(r => !r?.meta?.public && !r?.meta?.roles)
              .map(r => (
                <Route key={r.path} path={r.path} element={r.element} />
              ))}
            {/* 루트 인덱스 → /home */}
            <Route index element={<Navigate to="/home" replace />} />
          </Route>

          {/* roles 제한 라우트 (예: admin) */}
          {routes
            .filter(r => r?.meta?.roles && !r?.meta?.public)
            .map(r => (
              <Route key={r.path} element={<ProtectedRoute roles={r.meta.roles} />}>
                <Route path={r.path} element={r.element} />
              </Route>
            ))}

          {/* 기타 → /home */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
