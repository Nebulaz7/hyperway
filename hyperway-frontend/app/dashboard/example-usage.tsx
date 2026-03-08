// In your Submit Job page component:

import { useUploadJobSpec } from "@/hooks/useIPFS";
import { useSubmitJob } from "@/hooks/useMarketplace";
import type { JobSpec } from "@/lib/ipfs";

function SubmitJobForm() {
  const { uploadSpec, isUploading, error: ipfsError } = useUploadJobSpec();
  const { submitJob, isPending, isConfirming, isSuccess } = useSubmitJob();

  const handleSubmit = async () => {
    // 1. Build the job spec
    const spec: JobSpec = {
      name: "SDXL Image Generation",
      description: "Generate 100 images from text prompts",
      model: "stabilityai/sdxl-turbo",
      framework: "pytorch",
      parameters: { num_images: 100, resolution: "1024x1024" },
      requirements: { minVRAM: 16, minComputeUnits: 3600 },
      version: "1.0.0",
      createdAt: new Date().toISOString(),
    };

    // 2. Upload spec to IPFS → get bytes32
    const ipfsResult = await uploadSpec(spec);
    //    ipfsResult.cid     = "QmX7b..."
    //    ipfsResult.bytes32 = "0xabcd..."

    // 3. Submit to contract with the bytes32 CID + payment
    await submitJob(ipfsResult.bytes32, 3600, "0.5");
    //    → Calls contract.submitJob(bytes32, 3600) with 0.5 DOT

    // 4. Indexer picks up JobSubmitted event → writes to Supabase
    //    (stores both bytes32 AND full CID for lookup)

    // 5. Dashboard auto-updates via Supabase realtime subscription
  };
}
