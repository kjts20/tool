import { isStr, Event } from '../src';

describe('事件管理器', () => {
    let channel = 'on-event-test';
    let event = null;
    let addListerUuid;
    beforeAll(() => {
        event = new Event();
    });

    test('添加消费者', () => {
        addListerUuid = event.on(channel, () => {});
        expect(isStr(addListerUuid)).toBe(true);
    });

    test('发送消息', () => {
        expect(() => {
            event.emit(channel, { name: 'wkj' });
        }).not.toThrow();
    });

    jest.setTimeout(400);

    test('去除一个消费者', () => {
        expect(() => {
            event.off(channel, addListerUuid);
        }).not.toThrow();
    });

    test('去除所有消费者', () => {
        expect(() => {
            event.off(channel);
        }).not.toThrow();
    });
});
