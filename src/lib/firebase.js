// Firebase Configuration
import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage'
import { config } from './config'

// Initialize Firebase
const app = initializeApp(config.firebase)
const storage = getStorage(app)

// Document storage functions
const DOCUMENTS_PATH = 'eli-dashboard/documents'

export async function uploadDocument(file, onProgress) {
  const timestamp = Date.now()
  const fileName = `${timestamp}_${file.name}`
  const storageRef = ref(storage, `${DOCUMENTS_PATH}/${fileName}`)
  
  const snapshot = await uploadBytes(storageRef, file)
  const downloadUrl = await getDownloadURL(snapshot.ref)
  
  return {
    id: fileName,
    name: file.name,
    size: file.size,
    type: getFileType(file.name),
    mimeType: file.type,
    url: downloadUrl,
    uploadedAt: new Date().toISOString(),
  }
}

export async function listDocuments() {
  const listRef = ref(storage, DOCUMENTS_PATH)
  const result = await listAll(listRef)
  
  const documents = await Promise.all(
    result.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef)
      const name = itemRef.name.replace(/^\d+_/, '') // Remove timestamp prefix
      
      return {
        id: itemRef.name,
        name,
        type: getFileType(name),
        url,
        path: itemRef.fullPath,
      }
    })
  )
  
  return documents
}

export async function deleteDocument(id) {
  const docRef = ref(storage, `${DOCUMENTS_PATH}/${id}`)
  await deleteObject(docRef)
}

export async function getDocumentUrl(id) {
  const docRef = ref(storage, `${DOCUMENTS_PATH}/${id}`)
  return getDownloadURL(docRef)
}

function getFileType(fileName) {
  const ext = fileName.split('.').pop()?.toLowerCase()
  
  const typeMap = {
    pdf: 'pdf',
    doc: 'document',
    docx: 'document',
    xls: 'spreadsheet',
    xlsx: 'spreadsheet',
    csv: 'spreadsheet',
    png: 'image',
    jpg: 'image',
    jpeg: 'image',
    gif: 'image',
    webp: 'image',
    txt: 'text',
    md: 'text',
  }
  
  return typeMap[ext] || 'file'
}

export { storage }
