// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger 설정 정의
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FMDS API 문서',
      version: '1.0.0',
      description: '플러그인 기반 대시보드 시스템의 백엔드 API 명세서',
    },
    servers: [
      {
        url: 'http://localhost:3000', // 배포 환경에 따라 변경해야함.
      },
    ],
  },
  apis: ['./server.js'], // API 주석을 읽을 파일 경로
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };