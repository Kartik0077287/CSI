import { PrismaClient, Importance } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SKILLS: Array<{ name: string; category: string }> = [
  { name: "JavaScript", category: "Programming" },
  { name: "TypeScript", category: "Programming" },
  { name: "Python", category: "Programming" },
  { name: "Java", category: "Programming" },
  { name: "React", category: "Web Development" },
  { name: "Node.js", category: "Web Development" },
  { name: "HTML/CSS", category: "Web Development" },
  { name: "SQL", category: "Data" },
  { name: "Data Structures", category: "Programming" },
  { name: "Algorithms", category: "Programming" },
  { name: "Database Design", category: "Data" },
  { name: "Machine Learning", category: "AI/ML" },
  { name: "Deep Learning", category: "AI/ML" },
  { name: "Pandas", category: "Data" },
  { name: "Statistics", category: "Data" },
  { name: "AWS", category: "Cloud" },
  { name: "Docker", category: "Cloud" },
  { name: "Kubernetes", category: "Cloud" },
  { name: "Networking", category: "Cybersecurity" },
  { name: "Ethical Hacking", category: "Cybersecurity" },
  { name: "Figma", category: "Design" },
  { name: "UI Design", category: "Design" },
  { name: "UX Research", category: "Design" },
  { name: "Unity", category: "Game Development" },
  { name: "C++", category: "Game Development" },
  { name: "Git", category: "Programming" },
  { name: "Communication", category: "Soft Skills" },
  { name: "Teamwork", category: "Soft Skills" },
  { name: "Problem Solving", category: "Soft Skills" },
];

const CAREERS: Array<{
  name: string;
  description: string;
  industry: string;
  difficulty: string;
  skills: Array<{ name: string; required: number; importance: Importance }>;
}> = [
  {
    name: "Full Stack Developer",
    description: "Builds and maintains both the frontend and backend of web applications end to end.",
    industry: "Software",
    difficulty: "Medium",
    skills: [
      { name: "JavaScript", required: 85, importance: "HIGH" },
      { name: "React", required: 80, importance: "HIGH" },
      { name: "Node.js", required: 75, importance: "HIGH" },
      { name: "SQL", required: 80, importance: "MEDIUM" },
      { name: "Git", required: 75, importance: "MEDIUM" },
      { name: "HTML/CSS", required: 70, importance: "MEDIUM" },
    ],
  },
  {
    name: "Frontend Developer",
    description: "Specializes in building performant, accessible, and beautiful user interfaces.",
    industry: "Software",
    difficulty: "Easy",
    skills: [
      { name: "JavaScript", required: 85, importance: "HIGH" },
      { name: "React", required: 85, importance: "HIGH" },
      { name: "HTML/CSS", required: 85, importance: "HIGH" },
      { name: "TypeScript", required: 65, importance: "MEDIUM" },
      { name: "Git", required: 60, importance: "LOW" },
    ],
  },
  {
    name: "Backend Developer",
    description: "Designs APIs, services, and databases that power applications at scale.",
    industry: "Software",
    difficulty: "Medium",
    skills: [
      { name: "Node.js", required: 85, importance: "HIGH" },
      { name: "SQL", required: 85, importance: "HIGH" },
      { name: "Database Design", required: 80, importance: "HIGH" },
      { name: "Java", required: 60, importance: "MEDIUM" },
      { name: "Docker", required: 55, importance: "LOW" },
    ],
  },
  {
    name: "Data Scientist",
    description: "Extracts insights from data using statistics, machine learning, and visualization.",
    industry: "Data & AI",
    difficulty: "Hard",
    skills: [
      { name: "Python", required: 85, importance: "HIGH" },
      { name: "Machine Learning", required: 80, importance: "HIGH" },
      { name: "Statistics", required: 80, importance: "HIGH" },
      { name: "Pandas", required: 75, importance: "MEDIUM" },
      { name: "SQL", required: 65, importance: "MEDIUM" },
    ],
  },
  {
    name: "Data Analyst",
    description: "Turns raw data into dashboards and reports that guide business decisions.",
    industry: "Data & AI",
    difficulty: "Easy",
    skills: [
      { name: "SQL", required: 80, importance: "HIGH" },
      { name: "Pandas", required: 70, importance: "HIGH" },
      { name: "Statistics", required: 65, importance: "MEDIUM" },
      { name: "Python", required: 60, importance: "MEDIUM" },
    ],
  },
  {
    name: "Machine Learning Engineer",
    description: "Builds and deploys production machine learning systems.",
    industry: "Data & AI",
    difficulty: "Hard",
    skills: [
      { name: "Python", required: 85, importance: "HIGH" },
      { name: "Machine Learning", required: 85, importance: "HIGH" },
      { name: "Deep Learning", required: 80, importance: "HIGH" },
      { name: "Docker", required: 65, importance: "MEDIUM" },
      { name: "AWS", required: 60, importance: "MEDIUM" },
    ],
  },
  {
    name: "UI/UX Designer",
    description: "Researches user needs and designs intuitive, delightful product experiences.",
    industry: "Design",
    difficulty: "Easy",
    skills: [
      { name: "Figma", required: 85, importance: "HIGH" },
      { name: "UI Design", required: 85, importance: "HIGH" },
      { name: "UX Research", required: 75, importance: "HIGH" },
      { name: "Communication", required: 70, importance: "MEDIUM" },
    ],
  },
  {
    name: "Game Developer",
    description: "Builds interactive game systems, mechanics, and experiences.",
    industry: "Gaming",
    difficulty: "Hard",
    skills: [
      { name: "Unity", required: 80, importance: "HIGH" },
      { name: "C++", required: 75, importance: "HIGH" },
      { name: "Algorithms", required: 70, importance: "MEDIUM" },
      { name: "Problem Solving", required: 70, importance: "MEDIUM" },
    ],
  },
  {
    name: "Cybersecurity Analyst",
    description: "Protects systems and networks from security threats and vulnerabilities.",
    industry: "Security",
    difficulty: "Medium",
    skills: [
      { name: "Networking", required: 80, importance: "HIGH" },
      { name: "Ethical Hacking", required: 75, importance: "HIGH" },
      { name: "Python", required: 55, importance: "MEDIUM" },
      { name: "Problem Solving", required: 65, importance: "MEDIUM" },
    ],
  },
  {
    name: "Cloud Engineer",
    description: "Designs and manages scalable cloud infrastructure and deployments.",
    industry: "Infrastructure",
    difficulty: "Medium",
    skills: [
      { name: "AWS", required: 85, importance: "HIGH" },
      { name: "Docker", required: 80, importance: "HIGH" },
      { name: "Kubernetes", required: 70, importance: "MEDIUM" },
      { name: "Networking", required: 60, importance: "MEDIUM" },
    ],
  },
];

async function main() {
  console.log("Seeding database...");

  // Skills
  const skillMap = new Map<string, string>();
  for (const s of SKILLS) {
    const skill = await prisma.skill.upsert({
      where: { name: s.name },
      update: {},
      create: { name: s.name, category: s.category },
    });
    skillMap.set(s.name, skill.id);
  }

  // Careers + required skills
  const careerMap = new Map<string, string>();
  for (const c of CAREERS) {
    const career = await prisma.career.upsert({
      where: { name: c.name },
      update: { description: c.description, industry: c.industry, difficulty: c.difficulty },
      create: { name: c.name, description: c.description, industry: c.industry, difficulty: c.difficulty },
    });
    careerMap.set(c.name, career.id);
    for (const rs of c.skills) {
      const skillId = skillMap.get(rs.name)!;
      await prisma.careerSkill.upsert({
        where: { careerId_skillId: { careerId: career.id, skillId } },
        update: { requiredProficiency: rs.required, importance: rs.importance },
        create: { careerId: career.id, skillId, requiredProficiency: rs.required, importance: rs.importance },
      });
    }
  }

  // Admin user
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Platform Admin",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Demo student
  const studentPassword = await bcrypt.hash("Student@123", 10);
  const studentUser = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      name: "Aarav Sharma",
      email: "student@example.com",
      password: studentPassword,
      role: "STUDENT",
    },
  });

  const fullStackId = careerMap.get("Full Stack Developer")!;

  const studentProfile = await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      college: "Indian Institute of Technology",
      degree: "B.Tech",
      branch: "Computer Science",
      graduationYear: 2026,
      cgpa: 8.4,
      bio: "Third-year CS student passionate about full-stack development and building products that matter.",
      preferredIndustry: "Software",
      experienceLevel: "Student / Intern",
      targetCareerId: fullStackId,
    },
  });

  const demoSkillProficiency: Array<{ name: string; proficiency: number; level: any; experience: number }> = [
    { name: "JavaScript", proficiency: 75, level: "ADVANCED", experience: 2 },
    { name: "React", proficiency: 60, level: "INTERMEDIATE", experience: 1.5 },
    { name: "Node.js", proficiency: 40, level: "BEGINNER", experience: 0.5 },
    { name: "SQL", proficiency: 70, level: "ADVANCED", experience: 1 },
    { name: "Git", proficiency: 80, level: "ADVANCED", experience: 2 },
    { name: "HTML/CSS", proficiency: 85, level: "EXPERT", experience: 2.5 },
    { name: "Python", proficiency: 55, level: "INTERMEDIATE", experience: 1 },
    { name: "Communication", proficiency: 78, level: "ADVANCED", experience: 3 },
    { name: "Teamwork", proficiency: 82, level: "EXPERT", experience: 3 },
    { name: "Problem Solving", proficiency: 74, level: "ADVANCED", experience: 2 },
    { name: "Data Structures", proficiency: 68, level: "INTERMEDIATE", experience: 1.5 },
    { name: "Database Design", proficiency: 62, level: "INTERMEDIATE", experience: 1 },
  ];

  for (const s of demoSkillProficiency) {
    const skillId = skillMap.get(s.name)!;
    await prisma.studentSkill.upsert({
      where: { studentId_skillId: { studentId: studentProfile.id, skillId } },
      update: {},
      create: {
        studentId: studentProfile.id,
        skillId,
        proficiency: s.proficiency,
        level: s.level,
        experience: s.experience,
        verified: s.proficiency > 70,
      },
    });
  }

  // Some progress history so the Progress page has data to chart
  const progressSeed = [
    { name: "Node.js", old: 20, next: 40, daysAgo: 20 },
    { name: "React", old: 40, next: 60, daysAgo: 12 },
    { name: "SQL", old: 55, next: 70, daysAgo: 5 },
  ];
  for (const p of progressSeed) {
    const skillId = skillMap.get(p.name)!;
    const date = new Date();
    date.setDate(date.getDate() - p.daysAgo);
    await prisma.progress.create({
      data: {
        studentId: studentProfile.id,
        skillId,
        oldProficiency: p.old,
        newProficiency: p.next,
        updatedAt: date,
      },
    });
  }

  console.log("Seeding complete.");
  console.log("Admin login:   admin@example.com / Admin@123");
  console.log("Student login: student@example.com / Student@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
