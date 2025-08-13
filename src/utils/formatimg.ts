// 工具函数：将图片地址转换为File对象
export async function urlToFile(
  url: string,
  filename: string
): Promise<File | null> {
  try {
    // 1. 下载图片
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('图片下载失败')
    }

    // 2. 转换为Blob
    const blob = await response.blob()

    // 3. 从Blob创建File对象（推断MIME类型）
    const mimeType = blob.type || 'image/jpeg' // 默认JPEG类型
    const file = new File([blob], filename, { type: mimeType })

    return file
  } catch (error) {
    console.error('地址转File失败:', error)
    return null
  }
}
