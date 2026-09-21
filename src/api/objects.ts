import { ObjectsResponse } from '../types';
import { httpClient } from './http';

export const objectsApi = {
  async getObjects(): Promise<string[]> {
    const response = await httpClient.get<ObjectsResponse>('/objects');
    if (response.data.status !== 'ok' || !Array.isArray(response.data.data)) {
      throw new Error(response.data.message ?? '1С вернула некорректный список объектов');
    }
    return response.data.data;
  }
};
