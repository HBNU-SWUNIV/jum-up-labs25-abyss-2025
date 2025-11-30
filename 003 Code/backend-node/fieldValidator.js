const allowedFieldsMap = {
  Movie: ['title', 'rating', 'status', 'releaseYear'],
  // 다른 modelType들도 추가 예정
};

function validateFilterFields(modelType, filter) {
  const allowedFields = allowedFieldsMap[modelType];
  if (!allowedFields) throw new Error(`허용되지 않은 모델: ${modelType}`);

  const invalidFields = Object.keys(filter || {}).filter(k => !allowedFields.includes(k));
  if (invalidFields.length > 0) {
    throw new Error(`허용되지 않은 필드 사용: ${invalidFields.join(', ')}`);
  }
}

module.exports = {
  validateFilterFields
};