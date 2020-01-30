/* tslint:disable:quotemark indent ter-indent */

/*
ICC-API web worker PoC.

Usage: this should be compiled using the webpack config at the top level of this
repository. It creates a single file, icc-api.worker.js, which can be placed in
the static files of a front-end app and used with the standard browser web
worker API.

Two types of payload are supported:
 - ["rsa", rsaKeyChainObject] which populates local storage for the RSA module,
   where rsaKeyChainObject maps localStorage rsa-related keys to the
   corresponding localStorage values.
 - An array containing arguments for
   iccContactXApi.findByHCPartyPatientSecretFKeys, in which case the worker
   emits the value from the returned Promise as soon as it resolves. There is no
   error handling for this PoC.
*/

import { IccContactXApi } from "./icc-contact-x-api"
import { IccCryptoXApi } from "./icc-crypto-x-api"
import { iccHcpartyApi, iccPatientApi } from "../icc-api/iccApi"

// alternative to configuring typescript for a Web Worker environment, easier for this PoC
const ctx: any = self as any

const host = "https://backendb.svc.icure.cloud/rest/v1"
// type assertion to "any" because ICC-API header typings are incorrect
const headers = { header: "Content-Type", data: "application/json" } as any

// Stub localStorage for RSA.
// We just need Storage to not be undefined to bypass the compatibility checks in RSA.ts.
ctx.Storage = function() {
  return {}
}

/** read-only, PoC localStorage stub */
ctx.localStorage = {
  _store: {},
  getItem(key: string) {
    return this._store[key]
  },
  setItem(...args: any[]) {
    throw new Error("setItem not implemented in localStorage stub")
  }
}

const hcpApi = new iccHcpartyApi(host, headers, ctx.fetch)
const patientApi = new iccPatientApi(host, headers, ctx.fetch)

const cryptoApi = new IccCryptoXApi(host, headers, hcpApi, patientApi)

const contactApi = new IccContactXApi(host, headers, cryptoApi, ctx.fetch)

ctx.onmessage = function({ data: payload }: any) {
  console.debug("received payload", payload)
  if (Array.isArray(payload) && payload[0] === "rsa") {
    console.debug("filling up localStorage stub")
    ctx.localStorage._store = payload[1]
  } else {
    console.debug("requesting and decrypting contacts")
    sendCtcs(payload)
  }
}

/** Send decrypted contacts to main threads asynchronously. PoC; no error handling. */
function sendCtcs(payload: any) {
  const ctcsPromise = contactApi.findByHCPartyPatientSecretFKeys.apply(contactApi, payload)
  ctcsPromise.then((ctcs: any) => ctx.postMessage(ctcs))
}
