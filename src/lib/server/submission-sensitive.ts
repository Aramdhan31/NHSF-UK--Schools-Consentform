import "server-only";
import {
  encryptSubmissionPlaintext,
  tryDecryptSubmissionCiphertext,
} from "@/lib/server/submission-field-crypto";

export type SubmissionPlaintextSensitive = {
  parentEmail: string;
  parentPhone: string;
  emergencyContact: string;
  medicalNotes: string;
};

export type SubmissionEncryptedColumns = {
  parentEmailEncrypted: string;
  parentPhoneEncrypted: string;
  emergencyContactEncrypted: string;
  medicalNotesEncrypted: string;
};

export function encryptSubmissionSensitiveFields(
  input: SubmissionPlaintextSensitive,
): SubmissionEncryptedColumns {
  return {
    parentEmailEncrypted: encryptSubmissionPlaintext(input.parentEmail),
    parentPhoneEncrypted: encryptSubmissionPlaintext(input.parentPhone),
    emergencyContactEncrypted: encryptSubmissionPlaintext(
      input.emergencyContact,
    ),
    medicalNotesEncrypted: encryptSubmissionPlaintext(input.medicalNotes),
  };
}

export type SubmissionDecryptedSensitive = {
  parentEmail: string;
  parentPhone: string;
  emergencyContact: string;
  medicalNotes: string;
};

/** Decrypt DB columns for admin server-rendered views only. */
export function decryptSubmissionSensitiveColumns(row: {
  parentEmailEncrypted: string;
  parentPhoneEncrypted: string;
  emergencyContactEncrypted: string;
  medicalNotesEncrypted: string;
}): SubmissionDecryptedSensitive {
  const fallback = "—";
  return {
    parentEmail:
      tryDecryptSubmissionCiphertext(row.parentEmailEncrypted) ?? fallback,
    parentPhone:
      tryDecryptSubmissionCiphertext(row.parentPhoneEncrypted) ?? fallback,
    emergencyContact:
      tryDecryptSubmissionCiphertext(row.emergencyContactEncrypted) ??
      fallback,
    medicalNotes:
      tryDecryptSubmissionCiphertext(row.medicalNotesEncrypted) ?? fallback,
  };
}
