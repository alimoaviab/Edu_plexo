/**
 * Certificate API service.
 */

import { serviceRequest } from "@/services/service-client";
import type { ServiceResult } from "@/types/core";
import type {
  CertificateTemplate,
  GeneratedCertificate,
  CertificateFormInput,
  GenerateCertificateInput,
} from "../types/certificate.types";

// ─── Templates ───────────────────────────────────────────────────────────

export function listTemplates(): Promise<ServiceResult<CertificateTemplate[]>> {
  return serviceRequest<CertificateTemplate[]>("/api/certificates/templates");
}

export function getTemplate(id: string): Promise<ServiceResult<CertificateTemplate>> {
  return serviceRequest<CertificateTemplate>(`/api/certificates/templates/${id}`);
}

export function createTemplate(input: CertificateFormInput): Promise<ServiceResult<CertificateTemplate>> {
  return serviceRequest<CertificateTemplate>("/api/certificates/templates", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTemplate(id: string, input: Partial<CertificateFormInput>): Promise<ServiceResult<CertificateTemplate>> {
  return serviceRequest<CertificateTemplate>(`/api/certificates/templates/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteTemplate(id: string): Promise<ServiceResult<void>> {
  return serviceRequest<void>(`/api/certificates/templates/${id}`, {
    method: "DELETE",
  });
}

export function duplicateTemplate(id: string): Promise<ServiceResult<CertificateTemplate>> {
  return serviceRequest<CertificateTemplate>(`/api/certificates/templates/${id}/duplicate`, {
    method: "POST",
  });
}

// ─── Generated Certificates ──────────────────────────────────────────────

export function listCertificates(params?: {
  student_id?: string;
  class_id?: string;
  type?: string;
}): Promise<ServiceResult<GeneratedCertificate[]>> {
  const query = new URLSearchParams();
  if (params?.student_id) query.set("student_id", params.student_id);
  if (params?.class_id) query.set("class_id", params.class_id);
  if (params?.type) query.set("type", params.type);
  const qs = query.toString();
  return serviceRequest<GeneratedCertificate[]>(`/api/certificates${qs ? `?${qs}` : ""}`);
}

export function generateCertificates(input: GenerateCertificateInput): Promise<ServiceResult<GeneratedCertificate[]>> {
  return serviceRequest<GeneratedCertificate[]>("/api/certificates/generate", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function revokeCertificate(id: string): Promise<ServiceResult<GeneratedCertificate>> {
  return serviceRequest<GeneratedCertificate>(`/api/certificates/${id}/revoke`, {
    method: "POST",
  });
}

export function verifyCertificate(code: string): Promise<ServiceResult<GeneratedCertificate>> {
  return serviceRequest<GeneratedCertificate>(`/api/certificates/verify/${code}`);
}
