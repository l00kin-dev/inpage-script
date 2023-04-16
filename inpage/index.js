const { initializeProvider, shimWeb3 } = require('../providers/dist');
const ObjectMultiplex = require('@metamask/object-multiplex');
const pump = require('pump');
const MobilePortStream = require('./MobilePortStream');
const ReactNativePostMessageStream = require('./ReactNativePostMessageStream');

const INPAGE = 'l00kin-inpage';
const CONTENT_SCRIPT = 'l00kin-contentscript';
const PROVIDER = 'l00kin-provider';

// Setup stream for content script communication
const l00kinStream = new ReactNativePostMessageStream({
  name: INPAGE,
  target: CONTENT_SCRIPT,
});

// Initialize provider object (window.ethereum)
initializeProvider({
  connectionStream: l00kinStream,
  shouldSendMetadata: false,
});

domIsReady()

function domIsReady() {
  if (['interactive', 'complete'].includes(document.readyState)) {
    setContentScript()
    return;
  }

  window.addEventListener('DOMContentLoaded', setContentScript(), { once: true })
}

// Set content script post-setup function
export function setContentScript() {
  Object.defineProperty(window, '_l00kinSetupProvider', {
    value: () => {
      console.log('SETUP!!!!')
      setupProviderStreams();
      delete window._l00kinSetupProvider;
      console.log('DELETE')
    },
    configurable: true,
    enumerable: false,
    writable: false,
  });

  window._l00kinSetupProvider()
}

// Functions

/**
 * Setup function called from content script after the DOM is ready.
 */
function setupProviderStreams() {
  // the transport-specific streams for communication between inpage and background
  const pageStream = new ReactNativePostMessageStream({
    name: CONTENT_SCRIPT,
    target: INPAGE,
  });

  const appStream = new MobilePortStream({
    name: CONTENT_SCRIPT,
  });

  // create and connect channel muxes
  // so we can handle the channels individually
  const pageMux = new ObjectMultiplex();
  pageMux.setMaxListeners(25);
  const appMux = new ObjectMultiplex();
  appMux.setMaxListeners(25);

  pump(pageMux, pageStream, pageMux, (err) =>
    logStreamDisconnectWarning('L00kin Inpage Multiplex', err),
  );
  pump(appMux, appStream, appMux, (err) => {
    logStreamDisconnectWarning('L00kin Background Multiplex', err);
    notifyProviderOfStreamFailure();
  });

  // forward communication across inpage-background for these channels only
  forwardTrafficBetweenMuxes(PROVIDER, pageMux, appMux);

  // add web3 shim
  shimWeb3(window.ethereum);
}

/**
 * Set up two-way communication between muxes for a single, named channel.
 *
 * @param {string} channelName - The name of the channel.
 * @param {ObjectMultiplex} muxA - The first mux.
 * @param {ObjectMultiplex} muxB - The second mux.
 */
function forwardTrafficBetweenMuxes(channelName, muxA, muxB) {
  const channelA = muxA.createStream(channelName);
  const channelB = muxB.createStream(channelName);
  pump(channelA, channelB, channelA, (err) =>
    logStreamDisconnectWarning(
      `Amgo muxed traffic for channel "${channelName}" failed.`,
      err,
    ),
  );
}

/**
 * Error handler for page to extension stream disconnections
 *
 * @param {string} remoteLabel - Remote stream name
 * @param {Error} err - Stream connection error
 */
function logStreamDisconnectWarning(remoteLabel, err) {
  let warningMsg = `AmgoContentscript - lost connection to ${remoteLabel}`;
  if (err) {
    warningMsg += `\n${err.stack}`;
  }
  console.warn(warningMsg);
  console.error(err);
}

/**
 * This function must ONLY be called in pump destruction/close callbacks.
 * Notifies the inpage context that streams have failed, via window.postMessage.
 */
function notifyProviderOfStreamFailure() {
  window.postMessage(
    {
      target: INPAGE, // the post-message-stream "target"
      data: {
        // this object gets passed to object-multiplex
        name: PROVIDER, // the object-multiplex channel name
        data: {
          jsonrpc: '2.0',
          method: 'L00kin_STREAM_FAILURE',
        },
      },
    },
    window.location.origin,
  );
}
