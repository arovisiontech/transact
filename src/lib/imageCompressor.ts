/**
 * Client-Side Image Compression & Optimization Utility
 * 
 * Compresses camera and device photos down to crisp ~40-80KB WebP/JPEG images.
 * Eliminates 413 Payload Too Large errors, eliminates localStorage QuotaExceeded errors,
 * and speeds up page loading dramatically.
 */

export interface CompressedImageResult {
  dataUrl: string
  file: File
  width: number
  height: number
  sizeKb: number
}

export async function compressImage(
  file: File,
  maxDimension = 1200,
  quality = 0.82
): Promise<CompressedImageResult> {
  return new Promise((resolve) => {
    // If it's an SVG, preserve vector quality directly
    if (file.type.includes('svg') || file.name.endsWith('.svg')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = (e.target?.result as string) || ''
        resolve({
          dataUrl,
          file,
          width: 0,
          height: 0,
          sizeKb: Math.round(file.size / 1024),
        })
      }
      reader.onerror = () => {
        resolve({
          dataUrl: '',
          file,
          width: 0,
          height: 0,
          sizeKb: 0,
        })
      }
      reader.readAsDataURL(file)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const rawDataUrl = (e.target?.result as string) || ''
      if (typeof window === 'undefined') {
        resolve({
          dataUrl: rawDataUrl,
          file,
          width: 0,
          height: 0,
          sizeKb: Math.round(file.size / 1024),
        })
        return
      }

      const img = new window.Image()
      img.onload = () => {
        let width = img.width
        let height = img.height

        // Calculate aspect-ratio scale for maximum resolution constraint
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          } else {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve({
            dataUrl: rawDataUrl,
            file,
            width: img.width,
            height: img.height,
            sizeKb: Math.round(file.size / 1024),
          })
          return
        }

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        let dataUrl = ''
        try {
          dataUrl = canvas.toDataURL('image/webp', quality)
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality)
          }
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', quality)
        }

        canvas.toBlob(
          (blob) => {
            const finalBlob = blob || file
            const finalFile = new File([finalBlob], file.name.replace(/\.[^.]+$/, '.webp'), {
              type: blob?.type || 'image/webp',
            })
            resolve({
              dataUrl,
              file: finalFile,
              width,
              height,
              sizeKb: Math.round((dataUrl.length * 0.75) / 1024),
            })
          },
          'image/webp',
          quality
        )
      }

      img.onerror = () => {
        resolve({
          dataUrl: rawDataUrl,
          file,
          width: 0,
          height: 0,
          sizeKb: Math.round(file.size / 1024),
        })
      }

      img.src = rawDataUrl
    }

    reader.onerror = () => {
      resolve({
        dataUrl: '',
        file,
        width: 0,
        height: 0,
        sizeKb: 0,
      })
    }

    reader.readAsDataURL(file)
  })
}
