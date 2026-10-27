import { listAuditLogs } from "../../../lib/storage";
import { ChainClient } from "./ChainClient";

export default function GovernanceChainPage() {
  const auditLogs = listAuditLogs();
  return <ChainClient auditLogs={auditLogs} />;
}
