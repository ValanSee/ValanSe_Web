// 백엔드 R2StorageService의 업로드 제약과 동일하게 유지해야 합니다.
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]

// 업로드 가능한 이미지면 null, 아니면 사용자에게 보여줄 에러 메시지를 반환합니다.
export const validateImageFile = (file: File): string | null => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'JPG, PNG, WEBP, GIF 형식의 이미지만 업로드할 수 있어요.'
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return '이미지 크기는 5MB 이하여야 해요.'
  }
  return null
}
