import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entity/product.entity';
import { LoggerModule } from '../../../helpers/logger/logger.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as mockProduct from "./mock.test"

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockProduct.productEntityList[0]),
            upsert: jest.fn().mockResolvedValue(mockProduct.newProductEntity),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('test should return a user entity successfuly', async () => {
      const result = await service.findOne({ where: { id: '1' } });

      expect(result).toEqual(mockProduct.productEntityList[0]);
      expect(productRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('test should throw an exception when internal error server', async () => {
      jest.spyOn(productRepository, 'findOne').mockRejectedValueOnce(new Error());

      expect(
        service.findOne({ where: { id: '1' } }),

      ).rejects.toThrowError();
    });
  });

  describe('createOrUpdate', () => {
    it('test should create a new user entity successfuly', async () => {
      const result = await service.createOrUpdate(mockProduct.createBody);

      expect(result).toEqual(mockProduct.productEntityList[0]);

    });

    it('test should throw an exception when internal error server', async () => {
      jest.spyOn(productRepository, 'upsert').mockRejectedValueOnce(new Error());

      expect(
        service.createOrUpdate(mockProduct.createBody)
      ).rejects.toThrowError();
    });
  });

});
