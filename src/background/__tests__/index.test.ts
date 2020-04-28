import { mocked } from 'ts-jest/utils';
import Processor from '../Processor';

jest.mock('../Processor');

const ProcessorMocked = mocked(Processor, false);

describe('background/index', () => {
  it('Processor is initialized', async () => {
    await import('../index');
    expect(ProcessorMocked.mock.calls).toHaveLength(1);
  });
});
