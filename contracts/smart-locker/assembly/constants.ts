import { System } from '@koinos/sdk-as';

export namespace Constants {
  let contractId: Uint8Array | null = null;

  export function ContractId(): Uint8Array {
    if (contractId == null) {
      contractId = System.getContractId();
    }

    return contractId!;
  }
}
