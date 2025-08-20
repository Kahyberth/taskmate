import { apiClient } from './client-gateway';

export interface ImageUploadResponse {
  success: boolean;
  imageUrl: string;
  message: string;
}

export const uploadImage = async (file: File): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post('/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      imageUrl: response.data.url,
      message: 'Image uploaded successfully',
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

export const uploadProfilePicture = async (file: File, userId: string): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await apiClient.post(`/images/upload/profile-picture/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw new Error('Failed to upload profile picture');
  }
};

export const uploadProfileBanner = async (file: File, userId: string): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await apiClient.post(`/images/upload/profile-banner/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading profile banner:', error);
    throw new Error('Failed to upload profile banner');
  }
};

export const uploadTeamImage = async (file: File, teamId: string): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await apiClient.post(`/images/upload/team-image/${teamId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading team image:', error);
    throw new Error('Failed to upload team image');
  }
};

export const deleteImage = async (imageUrl: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete('/images/delete', {
      data: { imageUrl },
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
};
