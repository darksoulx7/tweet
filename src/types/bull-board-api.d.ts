declare module '@bull-board/api';

declare module '@bull-board/api/bullMQAdapter' {
    export class BullMQAdapter {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(queue: any);
    }
}
