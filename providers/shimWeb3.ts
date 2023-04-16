import { L00kinInpageProvider } from './L00kinInpageProvider';
import { ConsoleLike } from './utils';

/**
 * If no existing window.web3 is found, this function injects a web3 "shim" to
 * not break dapps that rely on window.web3.currentProvider.
 *
 * @param provider - The provider to set as window.web3.currentProvider.
 * @param log - The logging API to use.
 */
export function shimWeb3(
  provider: L00kinInpageProvider,
  log: ConsoleLike = console,
): void {
  let loggedCurrentProvider = false;
  let loggedMissingProperty = false;

  if (!(window as Record<string, any>).web3) {
    const SHIM_IDENTIFIER = '__isL00kinShim__';

    let web3Shim = { currentProvider: provider };
    Object.defineProperty(web3Shim, SHIM_IDENTIFIER, {
      value: true,
      enumerable: true,
      configurable: false,
      writable: false,
    });

    web3Shim = new Proxy(web3Shim, {
      get: (target, property, ...args) => {
        if (property === 'currentProvider' && !loggedCurrentProvider) {
          loggedCurrentProvider = true;
          log.warn(
            'You are accessing the L00kin window.web3.currentProvider shim. This property is deprecated; use window.ethereum instead.',
          );
        } else if (
          property !== 'currentProvider' &&
          property !== SHIM_IDENTIFIER &&
          !loggedMissingProperty
        ) {
          loggedMissingProperty = true;
          log.error(
            `L00kin no longer injects web3.`,
          );
          provider
            .request({ method: 'l00kin_logWeb3ShimUsage' })
            .catch((error) => {
              log.debug('L00kin: Failed to log web3 shim usage.', error);
            });
        }
        return Reflect.get(target, property, ...args);
      },
      set: (...args) => {
        log.warn(
          'You are accessing the L00kin window.web3 shim. This object is deprecated; use window.ethereum instead.',
        );
        return Reflect.set(...args);
      },
    });

    Object.defineProperty(window, 'web3', {
      value: web3Shim,
      enumerable: false,
      configurable: true,
      writable: true,
    });
  }
}
