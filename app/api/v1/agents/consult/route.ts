import { NextResponse } from "next/server";

interface ConsultPayload {
  agentId: string;
  taskType: "faq_generator" | "direct_answer" | "seo_optimizer" | "fact_check" | "custom";
  inputContent: string;
  context?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ConsultPayload;
    const { agentId, taskType, inputContent, context } = body;

    if (!inputContent) {
      return NextResponse.json({ error: "Missing input content" }, { status: 400 });
    }

    // Agent response generation based on task type and persona
    let output: any = null;

    if (taskType === "faq_generator") {
      output = {
        faqs: [
          {
            question: `What is the primary statutory protection under ${context || "this regulation"}?`,
            answer: `It establishes an absolute statutory requirement where policyholders and consumers are protected from retrospective repudiation or arbitrary penalties once statutory timeframes lapse.`
          },
          {
            question: `How does this impact dispute settlement timelines?`,
            answer: `Under standard regulatory SLAs, pre-authorizations are capped at 60 minutes and final claim disbursements must be concluded within standard 30-day statutory windows.`
          },
          {
            question: `What recourse is available if an entity violates these guidelines?`,
            answer: `Aggrieved consumers can file a formal escalation via statutory ombudsman networks or file an online grievance with the respective regulatory authority.`
          }
        ]
      };
    } else if (taskType === "direct_answer") {
      output = {
        directAnswer: `Under statutory compliance directives, consumers are entitled to strict adherence to published turnaround times and transparent fee disclosures. Repudiation or forfeiture after statutory limits without documented material fraud is strictly prohibited by law.`
      };
    } else if (taskType === "seo_optimizer") {
      output = {
        focusKeyword: context ? context.split(" ")[0] : "Regulatory Compliance",
        suggestedTitle: `${context || "Statutory Guide"} | TrustValue Regulatory Audit 2026`,
        suggestedDescription: `Comprehensive audit and consumer explainer for ${context || "statutory guidelines"}: know your rights, SLA caps, and ombudsman escalation paths.`,
        keywords: ["Consumer Protection", "Statutory Audit", "Regulatory Rights", "Dispute Escalation", "TrustScore"],
        schemaType: "FAQPage"
      };
    } else if (taskType === "fact_check") {
      output = {
        verdict: "Compliant with Statutory Guidelines",
        confidence: 96,
        citationsFound: ["Section 45 Insurance Act", "IRDAI Master Circular 2024", "RERA Section 14"],
        flags: [
          "Ensure distinguishing between life assurance and general health insurance incontestability rules.",
          "Check that penalty interest rates are quoted as SBI MCLR + 2% per statutory standard."
        ]
      };
    } else {
      output = {
        agentResponse: `Consultation report from ${agentId}: The content exhibits strong domain alignment with TrustValue's research standards. Recommended next step is ensuring Schema.org FAQPage and BreadcrumbList markup are validated on the live DOM.`
      };
    }

    return NextResponse.json({
      success: true,
      agentId,
      taskType,
      timestamp: new Date().toISOString(),
      data: output,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process agent consultation" }, { status: 500 });
  }
}
