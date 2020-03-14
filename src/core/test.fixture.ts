import { Repository } from '.'

const mockRepo = {
  save: jest.fn(),
  get: jest.fn(),
  getByWeek: jest.fn(),
  getByCommitter: jest.fn(),
}

export const mockRepoFactory = <T>(p?: Partial<Repository<T>>) => ({
  ...mockRepo,
  ...p,
})
