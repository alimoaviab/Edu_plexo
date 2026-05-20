/**
 * Certificate module hook — manages templates and generated certificates.
 */

import { useCallback, useEffect } from "react";
import { useSafeAsync } from "@/hooks/useSafeAsync";
import { showToast } from "@/utils/toast";
import { bindRefresh, publish } from "@/services/data-bus";
import * as service from "../services/certificate.service";
import type {
  CertificateTemplate,
  GeneratedCertificate,
  CertificateFormInput,
  GenerateCertificateInput,
} from "../types/certificate.types";

export function useCertificateTemplates() {
  const { state, run } = useSafeAsync<CertificateTemplate[]>();

  const loadTemplates = useCallback(() => {
    return run(async () => {
      const result = await service.listTemplates();
      if (!result.ok) throw new Error(result.error?.message || "Failed to load templates");
      return result.data ?? [];
    });
  }, [run]);

  const createTemplate = useCallback(
    async (input: CertificateFormInput) => {
      const result = await service.createTemplate(input);
      if (!result.ok) {
        showToast(result.error?.message || "Failed to create template.", "error");
        return result;
      }
      showToast("Certificate template created.", "success");
      await loadTemplates();
      publish("certificates" as any);
      return result;
    },
    [loadTemplates]
  );

  const updateTemplate = useCallback(
    async (id: string, input: Partial<CertificateFormInput>) => {
      const result = await service.updateTemplate(id, input);
      if (!result.ok) {
        showToast(result.error?.message || "Failed to update template.", "error");
        return result;
      }
      showToast("Template updated.", "success");
      await loadTemplates();
      publish("certificates" as any);
      return result;
    },
    [loadTemplates]
  );

  const deleteTemplate = useCallback(
    async (id: string) => {
      const result = await service.deleteTemplate(id);
      if (!result.ok) {
        showToast(result.error?.message || "Failed to delete template.", "error");
        return result;
      }
      showToast("Template deleted.", "success");
      await loadTemplates();
      publish("certificates" as any);
      return result;
    },
    [loadTemplates]
  );

  const duplicateTemplate = useCallback(
    async (id: string) => {
      const result = await service.duplicateTemplate(id);
      if (!result.ok) {
        showToast(result.error?.message || "Failed to duplicate template.", "error");
        return result;
      }
      showToast("Template duplicated.", "success");
      await loadTemplates();
      return result;
    },
    [loadTemplates]
  );

  useEffect(() => {
    void loadTemplates().catch(() => {});
  }, [loadTemplates]);

  return { state, createTemplate, updateTemplate, deleteTemplate, duplicateTemplate, refresh: loadTemplates };
}

export function useGeneratedCertificates(filters?: { student_id?: string; class_id?: string; type?: string }) {
  const { state, run } = useSafeAsync<GeneratedCertificate[]>();

  const loadCertificates = useCallback(() => {
    return run(async () => {
      const result = await service.listCertificates(filters);
      if (!result.ok) throw new Error(result.error?.message || "Failed to load certificates");
      return result.data ?? [];
    });
  }, [run, JSON.stringify(filters)]);

  const generateCertificates = useCallback(
    async (input: GenerateCertificateInput) => {
      const result = await service.generateCertificates(input);
      if (!result.ok) {
        showToast(result.error?.message || "Failed to generate certificates.", "error");
        return result;
      }
      const count = result.data?.length || 0;
      showToast(`${count} certificate${count > 1 ? "s" : ""} generated.`, "success");
      await loadCertificates();
      return result;
    },
    [loadCertificates]
  );

  const revokeCertificate = useCallback(
    async (id: string) => {
      const result = await service.revokeCertificate(id);
      if (!result.ok) {
        showToast(result.error?.message || "Failed to revoke certificate.", "error");
        return result;
      }
      showToast("Certificate revoked.", "success");
      await loadCertificates();
      return result;
    },
    [loadCertificates]
  );

  useEffect(() => {
    void loadCertificates().catch(() => {});
  }, [loadCertificates]);

  return { state, generateCertificates, revokeCertificate, refresh: loadCertificates };
}
