import { isStr, QueueManager } from '../src';

describe('队列管理器', () => {
    let channel = 'file-test';
    let addConsumerUuid = null;
    let queueManager = new QueueManager();
    queueManager.push({ channel }, 'init');

    test('添加空消费者', () => {
        expect(() => {
            addConsumerUuid = queueManager.addConsumer({
                callback: null,
                options: { channel }
            });
        }).toThrow();
    });

    test('添加消费者', () => {
        const addNullUuid = queueManager.addConsumer({
            callback: () => {},
            options: { channel }
        });
        expect(isStr(addNullUuid)).toBe(true);
    });

    test('启动队列监听', () => {
        expect(() => {
            queueManager.start(null);
        }).not.toThrow();
    });

    test('发送消费着', () => {
        expect(() => {
            queueManager.push({ channel }, '测试消息');
        }).not.toThrow();
    });

    test('关闭队列监听', () => {
        expect(() => {
            queueManager.stop();
        }).not.toThrow();
    });

    test('移除消费着', () => {
        expect(() => {
            queueManager.removeConsumer(addConsumerUuid);
        }).not.toThrow();
    });
});
