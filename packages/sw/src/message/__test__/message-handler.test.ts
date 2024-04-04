/* eslint-disable no-void */
/* eslint-disable dot-notation */
/// <reference lib="WebWorker" />

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { logger } from '../../logger/logger';
import { MessageHandler } from '../MessageHandler';

describe('MessageHandler Testing Suite', () => {
  beforeEach(() => {
    MessageHandler['messageHandlers'] = {};
  });

  test('constructor correctly assigns eventName', () => {
    const eventName = 'test';
    const messageHandler = new MessageHandler(eventName);

    expect(messageHandler['eventName']).toBe(eventName);
  });

  test('bind correctly assigns handler', () => {
    const eventName = 'test';
    const mockHandler = vi.fn().mockResolvedValue(void 0);

    class MockMessageHandler extends MessageHandler {
      constructor() {
        super('test');
        this.bind(mockHandler.bind(this));
      }
    }

    const _mockInstance = new MockMessageHandler();

    expect(MessageHandler['messageHandlers'][eventName]).toBeDefined();
    expect(MessageHandler['messageHandlers'][eventName]).toBeInstanceOf(Function);

    mockHandler.mockClear();
  });

  test('handleMessage processes registered event correctly', async () => {
    const eventName = 'test';
    const mockHandler = vi.fn().mockResolvedValue(void 0);

    class MockMessageHandler extends MessageHandler {
      constructor() {
        super('test');
        this.bind(mockHandler.bind(this));
      }
    }

    const _mockInstance = new MockMessageHandler();

    await _mockInstance.handleMessage({
      data: { type: eventName },
    } as ExtendableMessageEvent);

    expect(mockHandler).toHaveBeenCalledTimes(1);

    mockHandler.mockClear();
  });

  test('handleMessage ignores un-registered events', () => {
    const mockHandler = vi.fn().mockResolvedValue(void 0);

    class MockMessageHandler extends MessageHandler {
      constructor() {
        super('test');
        this.bind(mockHandler.bind(this));
      }
    }

    const _mockInstance = new MockMessageHandler();

    _mockInstance.handleMessage({
      data: { type: 'other' },
    } as ExtendableMessageEvent);

    expect(mockHandler).not.toHaveBeenCalled();

    mockHandler.mockClear();
  });

  test('handleMessage catches and logs errors from event handlers successfully', async () => {
    const eventName = 'test';
    const mockHandler = vi.fn().mockRejectedValue(new Error('Test Error'));
    const spiedOnLogger = vi.spyOn(logger, 'error');

    class MockMessageHandler extends MessageHandler {
      constructor() {
        super('test');
        this.bind(mockHandler.bind(this));
      }
    }

    const _mockInstance = new MockMessageHandler();

    await _mockInstance.handleMessage({
      data: { type: eventName },
    } as ExtendableMessageEvent);

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(spiedOnLogger).toHaveBeenCalledTimes(1);
    expect(spiedOnLogger).toHaveBeenCalledWith('Error handling message of type test:', new Error('Test Error'));

    mockHandler.mockClear();
    spiedOnLogger.mockRestore();
  });
});
