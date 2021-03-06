/**
 * 
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0.2
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as models from "./models"

export class PatientDto  {
  constructor(json: JSON | any) {
    Object.assign(this as PatientDto, json)
  }
  id?: string

  rev?: string

  deletionDate?: number

  created?: number

  modified?: number

  endOfLife?: number

  author?: string

  responsible?: string

  medicalLocationId?: string

  encryptedSelf?: string

  codes?: Array<models.CodeDto>

  tags?: Array<models.CodeDto>

  secretForeignKeys?: Array<string>

  cryptedForeignKeys?: { [key: string]: Array<models.DelegationDto> }

  delegations?: { [key: string]: Array<models.DelegationDto> }

  encryptionKeys?: { [key: string]: Array<models.DelegationDto> }

  mergeToPatientId?: string

  mergedIds?: Array<string>

  nonDuplicateIds?: Array<string>

  firstName?: string

  lastName?: string

  alias?: string

  active?: boolean

  deactivationReason?: PatientDto.DeactivationReasonEnum

  chronicalDisease?: string

  ssin?: string

  civility?: string

  gender?: string

  maidenName?: string

  spouseName?: string

  partnerName?: string

  personalStatus?: string

  dateOfBirth?: number

  dateOfDeath?: number

  timestampOfLatestEidReading?: number

  placeOfBirth?: string

  placeOfDeath?: string

  education?: string

  profession?: string

  note?: string

  administrativeNote?: string

  warning?: string

  nationality?: string

  preferredUserId?: string

  comment?: string

  encryptedAdministrativesDocuments?: Array<string>

  picture?: string

  userId?: string

  externalId?: string

  hcPartyKeys?: { [key: string]: Array<string> }

  publicKey?: string

  addresses?: Array<models.AddressDto>

  insurabilities?: Array<models.InsurabilityDto>

  languages?: Array<string>

  partnerships?: Array<models.PartnershipDto>

  patientHealthCareParties?: Array<models.PatientHealthCarePartyDto>

  medicalHouseContracts?: Array<models.MedicalHouseContractDto>

  financialInstitutionInformation?: Array<models.FinancialInstitutionInformationDto>

  parameters?: { [key: string]: Array<string> }

  patientProfessions?: Array<models.CodeDto>

  fatherBirthCountry?: models.CodeStub

  birthCountry?: models.CodeStub

  nativeCountry?: models.CodeStub

  socialStatus?: models.CodeStub

  mainSourceOfIncome?: models.CodeStub

  schoolingInfos?: Array<models.SchoolingInfoDto>

  employementInfos?: Array<models.EmploymentInfoDto>

  properties?: Array<models.PropertyDto>
}
export namespace PatientDto {
  export enum DeactivationReasonEnum {
    Deceased = <any>"deceased",
    Moved = <any>"moved",
    OtherDoctor = <any>"other_doctor",
    Retired = <any>"retired",
    NoContact = <any>"no_contact",
    Unknown = <any>"unknown",
    None = <any>"none"
  }
}
