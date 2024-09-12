export function removeFileExt(fileName: string){ 
    return fileName.replace(/\.[^/.]+$/, "")
}
