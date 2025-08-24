import { IPFSUploadResult } from '@/types/blockchain';

export class IPFSService {
  async uploadFile(file: File): Promise<IPFSUploadResult & { success: boolean }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/ipfs/file', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      return {
        success: true,
        cid: result.cid,
        url: result.url,
        size: result.size,
        name: result.name
      };
    } catch (error) {
      console.error('IPFS file upload error:', error);
      return {
        success: false,
        cid: '',
        url: '',
        error: error.message
      };
    }
  }

  async uploadJSON(data: any): Promise<IPFSUploadResult & { success: boolean }> {
    try {
      const response = await fetch('/api/ipfs/json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      return {
        success: true,
        cid: result.cid,
        url: result.url
      };
    } catch (error) {
      console.error('IPFS JSON upload error:', error);
      return {
        success: false,
        cid: '',
        url: '',
        error: error.message
      };
    }
  }
}
```
