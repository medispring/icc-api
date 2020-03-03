import { iccBeKmehrApi } from "../icc-api/iccApi"

import { XHR } from "../icc-api/api/XHR"
import * as models from "../icc-api/model/models"
import { IccContactXApi } from "./icc-contact-x-api"
import { IccHelementXApi } from "./icc-helement-x-api"
import { ContactDto } from "../icc-api/model/models"

export class IccBekmehrXApi extends iccBeKmehrApi {
  private readonly ctcApi: IccContactXApi
  private readonly helementApi: IccHelementXApi
  private readonly wssHost: string

  constructor(
    host: string,
    headers: { [key: string]: string },
    ctcApi: IccContactXApi,
    helementApi: IccHelementXApi,
    fetchImpl: (input: RequestInfo, init?: RequestInit) => Promise<Response> = typeof window !==
    "undefined"
      ? window.fetch
      : (self.fetch as any)
  ) {
    super(host, headers, fetchImpl)
    this.ctcApi = ctcApi
    this.helementApi = helementApi

    const auth = this.headers.find(h => h.header === "Authorization")
    this.wssHost = new URL(this.host, window.location.href).href
      .replace(/^http/, "ws")
      .replace(/\/rest\/v.+/, "/ws")
  }

  socketEventListener(
    socket: WebSocket,
    healthcarePartyId: string,
    resolve: (value?: Promise<Blob>) => void,
    reject: (reason?: any) => void,
    progressCallback?: (progress: number) => void,
    servicesPatcher?: (response: any[]) => Promise<any[]>,
    contactsPatcher?: (response: any[]) => Promise<any[]>,
    healthElementsPatcher?: (response: any[]) => Promise<any[]>
  ) {
    const that = this
    return (event: MessageEvent) => {
      if (typeof event.data === "string") {
        const msg = JSON.parse(event.data)

        if (msg.command === "decrypt") {
          if (msg.type === "ContactDto") {
            that.ctcApi
              .decrypt(healthcarePartyId, msg.body)
              .then(res => (contactsPatcher ? contactsPatcher(res) : Promise.resolve(res)))
              .then(res =>
                socket.send(
                  JSON.stringify({ command: "decryptResponse", uuid: msg.uuid, body: res })
                )
              )
          } else if (msg.type === "HealthElementDto") {
            that.helementApi
              .decrypt(healthcarePartyId, msg.body)
              .then(
                res => (healthElementsPatcher ? healthElementsPatcher(res) : Promise.resolve(res))
              )
              .then(res =>
                socket.send(
                  JSON.stringify({ command: "decryptResponse", uuid: msg.uuid, body: res })
                )
              )
          } else {
            that.ctcApi
              .decryptServices(healthcarePartyId, msg.body)
              .then(res => (servicesPatcher ? servicesPatcher(res) : Promise.resolve(res)))
              .then(res =>
                socket.send(
                  JSON.stringify({ command: "decryptResponse", uuid: msg.uuid, body: res })
                )
              )
          }
        } else if (msg.command === "progress") {
          if (progressCallback && msg.body && msg.body[0]) {
            progressCallback(msg.body[0].progress)
          }
        } else {
          console.error("error received from backend:" + event.data)
          reject("websocket error: " + event.data)
          socket.close(4000, "backend error")
        }
      } else {
        resolve(event.data)
        socket.close(1000, "Ok")
      }
    }
  }

  generateSmfExportWithEncryptionSupport(
    patientId: string,
    healthcarePartyId: string,
    language: string,
    body: models.SoftwareMedicalFileExportDto,
    progressCallback?: (progress: number) => void,
    sessionId?: string,
    contactsPatcher?: (response: ContactDto[]) => Promise<ContactDto[]>
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(
        `${this.wssHost}/be_kmehr/generateSmf${sessionId ? `;jsessionid=${sessionId}` : ""}`
      )
      socket.addEventListener("open", function() {
        socket.send(
          JSON.stringify({ parameters: { patientId: patientId, language: language, info: body } })
        )
      })

      // Listen for messages
      socket.addEventListener(
        "message",
        this.socketEventListener(
          socket,
          healthcarePartyId,
          resolve,
          reject,
          progressCallback,
          undefined,
          contactsPatcher
        )
      )
    })
  }

  generateSumehrExportWithEncryptionSupport(
    patientId: string,
    healthcarePartyId: string,
    language: string,
    body: models.SumehrExportInfoDto,
    sessionId?: string
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(
        `${this.wssHost}/be_kmehr/generateSumehr${sessionId ? `;jsessionid=${sessionId}` : ""}`
      )
      socket.addEventListener("open", function() {
        socket.send(
          JSON.stringify({ parameters: { patientId: patientId, language: language, info: body } })
        )
      })
      // Listen for messages
      socket.addEventListener(
        "message",
        this.socketEventListener(socket, healthcarePartyId, resolve, reject)
      )
    })
  }

  generateSumehrV2ExportWithEncryptionSupport(
    patientId: string,
    healthcarePartyId: string,
    language: string,
    body: models.SumehrExportInfoDto,
    sessionId?: string
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(
        `${this.wssHost}/be_kmehr/generateSumehrV2${sessionId ? `;jsessionid=${sessionId}` : ""}`
      )
      socket.addEventListener("open", function() {
        socket.send(
          JSON.stringify({ parameters: { patientId: patientId, language: language, info: body } })
        )
      })
      // Listen for messages
      socket.addEventListener(
        "message",
        this.socketEventListener(socket, healthcarePartyId, resolve, reject)
      )
    })
  }

  generateDiaryNoteExportWithEncryptionSupport(
    patientId: string,
    healthcarePartyId: string,
    language: string,
    body: models.SumehrExportInfoDto,
    sessionId?: string
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(
        `${this.wssHost}/be_kmehr/generateDiaryNote${sessionId ? `;jsessionid=${sessionId}` : ""}`
      )
      socket.addEventListener("open", function() {
        socket.send(
          JSON.stringify({ parameters: { patientId: patientId, language: language, info: body } })
        )
      })
      // Listen for messages
      socket.addEventListener(
        "message",
        this.socketEventListener(socket, healthcarePartyId, resolve, reject)
      )
    })
  }

  generateMedicationSchemeWithEncryptionSupport(
    patientId: string,
    healthcarePartyId: string,
    language: string,
    recipientSafe: string,
    version: number,
    body: models.MedicationSchemeExportInfoDto,
    patcher: (response: ContactDto[]) => Promise<ContactDto[]>,
    sessionId?: string
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(
        `${this.wssHost}/be_kmehr/generateMedicationScheme${
          sessionId ? `;jsessionid=${sessionId}` : ""
        }`
      )
      socket.addEventListener("open", function() {
        socket.send(
          JSON.stringify({
            parameters: {
              patientId: patientId,
              language: language,
              recipientSafe: recipientSafe,
              version: version,
              info: body
            }
          })
        )
      })
      // Listen for messages
      socket.addEventListener(
        "message",
        this.socketEventListener(socket, healthcarePartyId, resolve, reject, undefined, patcher)
      )
    })
  }
}
