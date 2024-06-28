import { datasource } from '~/ormconfig';
import { User } from '~/packages/database/models/models';
import { generate, verify } from 'password-hash';
import { generateToken } from '../util/jwt';
import { CustomError } from '../errors/customerError';

class UserService {
  private userRepository = datasource.getRepository(User);

  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const user = this.userRepository.create(userData);
      user.password = await this.hashPassword(user.password);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw new CustomError('A user with the provided details already exists.', 400);
      }
      console.error('An error occurred: ', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async getUserAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return null;
    }
    this.userRepository.merge(user, userData);
    await this.userRepository.save(user);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ username: username });
  }

  async login(username: string, password: string): Promise<string | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;

    if (!this.verifyPassword(user.password, password)) return null;

    return generateToken(user);
  }

  async hashPassword(password: string): Promise<string> {
    return generate(password, { algorithm: 'sha512', saltLength: 9, iterations: 11 });
  }

  async verifyPassword(password: string, hashPassword: string): Promise<boolean> {
    return verify(password, hashPassword);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  private isDuplicateKeyError(error: any): boolean {
    // duplicate error postgresql code 23505
    return error.code === '23505';
  }
}

export const userService = new UserService();
