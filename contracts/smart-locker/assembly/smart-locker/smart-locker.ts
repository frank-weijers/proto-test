import { guardian } from '../proto/guardian';

export class SmartLocker {
  addRelease(
    name: string,
    tokenId: Uint8Array,
    amount: u64,
    allocationType: string,
    guards: Array<guardian.guard>
  ): void {
    //
  }
}
