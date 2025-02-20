import { Test, TestingModule } from '@nestjs/testing';
import { ListenrsService } from './listenrs.service';

describe('ListenrsService', () => {
  let service: ListenrsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListenrsService],
    }).compile();

    service = module.get<ListenrsService>(ListenrsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
