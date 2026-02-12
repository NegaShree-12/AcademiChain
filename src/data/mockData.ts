import { Credential, VerificationResult } from "@/types/credential";

export const mockCredentials: Credential[] = [
  {
    id: "1",
    title: "Bachelor of Computer Science",
    type: "degree",
    institution: "Massachusetts Institute of Technology",
    issueDate: "2023-06-15",
    txHash:
      "0x8f7d3a2c1e4b5d6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
    blockNumber: 18234567,
    status: "verified",
    description: "Awarded with Honors, GPA: 3.85/4.0",
  },
  {
    id: "2",
    title: "Master of Data Science",
    type: "degree",
    institution: "Stanford University",
    issueDate: "2024-05-20",
    txHash:
      "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    blockNumber: 19456789,
    status: "verified",
    description: "Specialization in Machine Learning",
  },
  {
    id: "3",
    title: "AWS Solutions Architect Professional",
    type: "certificate",
    institution: "Amazon Web Services",
    issueDate: "2024-01-10",
    txHash:
      "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
    blockNumber: 18987654,
    status: "verified",
    description: "Valid until January 2027",
  },
  {
    id: "4",
    title: "Official Academic Transcript",
    type: "transcript",
    institution: "Massachusetts Institute of Technology",
    issueDate: "2023-06-20",
    txHash:
      "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
    blockNumber: 18234890,
    status: "verified",
    description: "Complete academic record 2019-2023",
  },
  {
    id: "5",
    title: "Blockchain Developer Certification",
    type: "certificate",
    institution: "Ethereum Foundation",
    issueDate: "2024-03-05",
    txHash:
      "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
    blockNumber: 19123456,
    status: "pending",
    description: "Pending blockchain confirmation",
  },
];

export const mockVerificationResult: VerificationResult = {
  isValid: true,
  credential: mockCredentials[0],
  blockConfirmations: 145678,
  verifiedAt: new Date().toISOString(),
  issuer: {
    name: "Massachusetts Institute of Technology",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD45",
    verified: true,
  },
};

export const mockStats = {
  totalCredentials: 5,
  verifiedCredentials: 4,
  pendingVerifications: 1,
  totalTransactions: 12,
  sharedLinks: 8,
  verificationRequests: 23,
};

export const mockRecentActivity = [
  {
    id: "1",
    type: "verification",
    message: "Employer verified your Bachelor's degree",
    timestamp: "2024-01-15T10:30:00Z",
    txHash: "0x8f7d3a2c1e4b5d6f...",
  },
  {
    id: "2",
    type: "share",
    message: "Generated share link for transcript",
    timestamp: "2024-01-14T15:45:00Z",
  },
  {
    id: "3",
    type: "issue",
    message: "New certificate issued by AWS",
    timestamp: "2024-01-10T09:00:00Z",
    txHash: "0x2b3c4d5e6f7a8b9c...",
  },
  {
    id: "4",
    type: "verification",
    message: "Background check service verified credentials",
    timestamp: "2024-01-08T14:20:00Z",
    txHash: "0x1a2b3c4d5e6f7a8b...",
  },
  {
    id: "6",
    title: "Blockchain Developer Certification",
    type: "certificate",
    institution: "Ethereum Foundation",
    issueDate: "2024-03-05",
    txHash: "0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d",
    blockNumber: 19123456,
    status: "pending",
    description: "Pending blockchain confirmation",
  },
];

export const partnerInstitutions = [
  { name: "MIT", logo: "MIT" },
  { name: "Stanford", logo: "Stanford" },
  { name: "Harvard", logo: "Harvard" },
  { name: "Oxford", logo: "Oxford" },
  { name: "Cambridge", logo: "Cambridge" },
  { name: "ETH Zurich", logo: "ETH" },
];
