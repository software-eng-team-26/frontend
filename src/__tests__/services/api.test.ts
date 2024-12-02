import axios from 'axios';
import { api } from '../../services/api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sends requests with correct base URL', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: {} });
    await api.get('/test');
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/api/test'));
  });

  test('handles successful GET requests', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });
    const response = await api.get('/test');
    expect(response.data).toEqual(mockData);
  });

  test('handles successful POST requests', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockedAxios.post.mockResolvedValueOnce({ data: mockData });
    const response = await api.post('/test', mockData);
    expect(response.data).toEqual(mockData);
  });

  test('handles API errors', async () => {
    const errorMessage = 'Network Error';
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));
    await expect(api.get('/test')).rejects.toThrow(errorMessage);
  });

  test('includes authorization header when token exists', async () => {
    const token = 'test-token';
    localStorage.setItem('token', token);
    mockedAxios.get.mockResolvedValueOnce({ data: {} });
    await api.get('/test');
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${token}`,
        }),
      })
    );
  });

  test('handles 401 unauthorized responses', async () => {
    const error = {
      response: {
        status: 401,
        data: { message: 'Unauthorized' },
      },
    };
    mockedAxios.get.mockRejectedValueOnce(error);
    await expect(api.get('/test')).rejects.toMatchObject(error);
  });
}); 