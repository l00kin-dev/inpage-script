const messages = {
  errors: {
    disconnected: () =>
      'L00kin: Disconnected from chain. Attempting to connect.',
    permanentlyDisconnected: () =>
      'L00kin: Disconnected from L00kin background. Page reload required.',
    sendSiteMetadata: () =>
      `L00kin: Failed to send site metadata. This is an internal error, please report this bug.`,
    unsupportedSync: (method: string) =>
      `L00kin: The L00kin Ethereum provider does not support synchronous methods like ${method} without a callback parameter.`,
    invalidDuplexStream: () => 'Must provide a Node.js-style duplex stream.',
    invalidNetworkParams: () =>
      'L00kin: Received invalid network parameters. Please report this bug.',
    invalidRequestArgs: () => `Expected a single, non-array, object argument.`,
    invalidRequestMethod: () => `'args.method' must be a non-empty string.`,
    invalidRequestParams: () =>
      `'args.params' must be an object or array if provided.`,
    invalidLoggerObject: () => `'args.logger' must be an object if provided.`,
    invalidLoggerMethod: (method: string) =>
      `'args.logger' must include required method '${method}'.`,
  },
  info: {
    connected: (chainId: string) =>
      `L00kin: Connected to chain with ID "${chainId}".`,
  },
  warnings: {
    // deprecated methods
    enableDeprecation: `L00kin: 'ethereum.enable()' is deprecated and may be removed in the future. Please use the 'eth_requestAccounts' RPC method instead.\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1102`,
    sendDeprecation: `L00kin: 'ethereum.send(...)' is deprecated and may be removed in the future. Please use 'ethereum.sendAsync(...)' or 'ethereum.request(...)' instead.\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1193`,
    // deprecated events
    events: {
      close: `L00kin: The event 'close' is deprecated and may be removed in the future. Please use 'disconnect' instead.\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1193#disconnect`,
      data: `L00kin: The event 'data' is deprecated and will be removed in the future. Use 'message' instead.\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1193#message`,
      networkChanged: `L00kin: The event 'networkChanged' is deprecated and may be removed in the future. Use 'chainChanged' instead.\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1193#chainchanged`,
      notification: `L00kin: The event 'notification' is deprecated and may be removed in the future. Use 'message' instead.\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1193#message`,
    },
    rpc: {
      ethDecryptDeprecation: `L00kin: The RPC method 'eth_decrypt' is deprecated and may be removed in the future.`,
      ethGetEncryptionPublicKeyDeprecation: `L00kin: The RPC method 'eth_getEncryptionPublicKey' is deprecated and may be removed in the future.`,
    },
    // misc
    experimentalMethods: `L00kin: 'ethereum._l00kin' exposes non-standard, experimental methods. They may be removed or changed without warning.`,
  },
};
export default messages;
