import { Test, TestingModule } from '@nestjs/testing';
import { FlightsService } from './flights.service';

describe('FlightService', () => {
    let service: FlightsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FlightsService],
        }).compile();

        service = module.get<FlightsService>(FlightsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
