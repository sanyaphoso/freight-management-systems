import { Request, Response } from 'express';
import { generateToken, getBodyToken, validateToken } from '~/packages/api/util/jwt'; // Adjust import path as necessary
import { User } from '~/packages/database/models/models';

// Mock User object
const user = new User();
(user.id = 123), (user.username = 'testUser');

describe('Auth Middleware', () => {
  describe('generateToken', () => {
    it('should generate a token', () => {
      const token = generateToken({ ...user } as any);
      expect(token);
    });
  });

  describe('getBodyToken', () => {
    it('should return decoded token body', () => {
      const token = generateToken({ ...user } as any);
      const decoded = getBodyToken(token);
      console.log(decoded);
      expect(decoded).toHaveProperty('username');
    });
  });

  describe('validateToken', () => {
    const mockRequest = (token?: string) =>
      ({
        headers: {
          authorization: token ? `Bearer ${token}` : undefined,
        },
      }) as Request;

    const mockRequestNoneAuth = () =>
      ({
        headers: {},
      }) as Request;

    const mockResponse = () => {
      const res = {} as Response;
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };

    const nextFunction = jest.fn();

    it('should call next if token is valid', () => {
      const token = generateToken({ ...user } as any);
      const req = mockRequest(token);
      const res = mockResponse();
      validateToken(req, res, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should call next if token is in valid', () => {
      const req = mockRequest(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      );
      const res = mockResponse();
      const result = validateToken(req, res, () => {
        console.log('CALLL');
      });
      console.log('ssssss', result);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 401 if no token is provided', () => {
      const req = mockRequest();
      const res = mockResponse();
      validateToken(req, res, nextFunction);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Access denied. No token provided.',
        }),
      );
    });

    it('should return 401 if no token is provided non auth', () => {
      const req = mockRequestNoneAuth();
      const res = mockResponse();
      validateToken(req, res, nextFunction);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Access denied. No token provided.',
        }),
      );
    });

    it('should return 401 if no token is provided', () => {
      const req = mockRequest();
      const res = mockResponse();
      validateToken(req, res, nextFunction);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Access denied. No token provided.',
        }),
      );
    });
  });
});
