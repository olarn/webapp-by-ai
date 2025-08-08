class ImageCache {
  private cache = new Map<string, string>();

  // Utility function to get full image URL from relative path
  getImageUrl(relativePath: string): string {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    
    // If it's already a full URL, return as is
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath;
    }
    
    // If it's a relative path, construct full URL
    if (relativePath.startsWith('/')) {
      return `${API_BASE_URL}${relativePath}`;
    }
    
    // If it doesn't start with /, assume it's relative to images
    return `${API_BASE_URL}/images/${relativePath}`;
  }

  async getImage(url: string): Promise<string> {
    // Check if image is already cached
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    try {
      // Fetch the image and convert to base64
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const blob = await response.blob();
      const base64 = await this.blobToBase64(blob);

      // Cache the base64 data
      this.cache.set(url, base64);

      return base64;
    } catch (error) {
      console.error('Error caching image:', error);
      // Return a placeholder image if fetch fails
      return this.getImageUrl('/images/placeholder-course.svg');
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

export const imageCache = new ImageCache();
