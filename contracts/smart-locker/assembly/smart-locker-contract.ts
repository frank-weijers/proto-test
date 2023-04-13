import { authority, System } from '@koinos/sdk-as';
import { common } from './proto/common';
import { smart_locker } from './proto/smart_locker';
import { SmartLocker } from './smart-locker/smart-locker';

export class SmartLockerContract {
  callArgs: System.getArgumentsReturn | null;

  protected smartLocker: SmartLocker;

  constructor() {
    this.smartLocker = new SmartLocker();
  }

  /**
   * Authorize function
   * @external
   */
  authorize(args: authority.authorize_arguments): common.boole {
    return new common.boole(true);
  }

  add_release(args: smart_locker.add_release_arguments): common.boole {
    this.smartLocker.addRelease(
      args.name,
      args.token_id,
      args.amount,
      args.allocation_type,
      args.guards
    );

    return new common.boole(true);
  }
}
