/* tslint:disable:quotemark indent ter-indent */

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
