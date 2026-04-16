import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash("password123");

  const owner = await prisma.user.upsert({
    where: { email: "owner@acme.test" },
    update: {},
    create: { email: "owner@acme.test", passwordHash, name: "Acme Owner" },
  });

  const tenant = await prisma.tenant.upsert({
    where: { slug: "acme" },
    update: {},
    create: {
      name: "Acme",
      slug: "acme",
      memberships: { create: { userId: owner.id, role: "OWNER" } },
    },
  });

  await prisma.plan.upsert({
    where: { code: "free" },
    update: {},
    create: {
      code: "free",
      name: "Free",
      priceCents: 0,
      interval: "MONTH",
      limits: { agents: 3, nodes: 3, tokensPerMonth: 100_000 },
    },
  });
  await prisma.plan.upsert({
    where: { code: "pro" },
    update: {},
    create: {
      code: "pro",
      name: "Pro",
      priceCents: 9900,
      interval: "MONTH",
      limits: { agents: 25, nodes: 20, tokensPerMonth: 5_000_000 },
    },
  });

  await prisma.node.createMany({
    data: [
      {
        tenantId: tenant.id,
        name: "gpu-eu-01",
        endpoint: "https://gpu-eu-01.example.com",
        status: "ACTIVE",
        capacity: { cpu: 32, ramGb: 128, gpu: "A100x2" },
        tags: ["production", "eu"],
      },
      {
        tenantId: tenant.id,
        name: "cpu-us-01",
        endpoint: "https://cpu-us-01.example.com",
        status: "BUSY",
        capacity: { cpu: 16, ramGb: 64 },
        tags: ["production", "us"],
      },
    ],
    skipDuplicates: true,
  });

  const roles = [
    { name: "Marketing Strategist", role: "marketing" },
    { name: "Sales Copilot", role: "sales" },
    { name: "Dev Helper", role: "programming" },
    { name: "Support Agent", role: "support" },
    { name: "Data Analyst", role: "analyst" },
  ];
  for (const r of roles) {
    await prisma.agent.upsert({
      where: { tenantId_name: { tenantId: tenant.id, name: r.name } },
      update: {},
      create: {
        tenantId: tenant.id,
        name: r.name,
        role: r.role,
        systemPrompt: `You are a helpful ${r.role} assistant.`,
        model: "anthropic:claude-sonnet-4-6",
        temperature: 0.4,
        tools: [],
      },
    });
  }

  console.log("seed complete");
}

main().finally(() => prisma.$disconnect());
