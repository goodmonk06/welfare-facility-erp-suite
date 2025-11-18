import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create facilities
  const facility1 = await prisma.facility.upsert({
    where: { code: 'FAC001' },
    update: {},
    create: {
      name: 'さくら介護センター',
      code: 'FAC001',
      type: '特別養護老人ホーム',
      address: '東京都渋谷区example-street 1-2-3',
      phone: '03-1234-5678',
      email: 'info@sakura-care.example.com',
      capacity: 50,
      licenseNumber: '1234567890',
    },
  });

  const facility2 = await prisma.facility.upsert({
    where: { code: 'FAC002' },
    update: {},
    create: {
      name: 'ひまわりデイサービス',
      code: 'FAC002',
      type: 'デイサービス',
      address: '東京都新宿区example-road 5-6-7',
      phone: '03-9876-5432',
      email: 'contact@himawari-day.example.com',
      capacity: 30,
      licenseNumber: '0987654321',
    },
  });

  console.log('✅ Created facilities:', facility1.name, facility2.name);

  // Create staff
  const staff1 = await prisma.staff.upsert({
    where: { employeeNumber: 'EMP001' },
    update: {},
    create: {
      facilityId: facility1.id,
      employeeNumber: 'EMP001',
      lastName: '田中',
      firstName: '健一',
      lastNameKana: 'タナカ',
      firstNameKana: 'ケンイチ',
      email: 'tanaka@example.com',
      phone: '090-1234-5678',
      position: '施設長',
      employmentType: '正社員',
      hireDate: new Date('2020-04-01'),
      qualifications: ['介護福祉士', '社会福祉士'],
      status: 'active',
    },
  });

  const staff2 = await prisma.staff.upsert({
    where: { employeeNumber: 'EMP002' },
    update: {},
    create: {
      facilityId: facility1.id,
      employeeNumber: 'EMP002',
      lastName: '高橋',
      firstName: '美咲',
      lastNameKana: 'タカハシ',
      firstNameKana: 'ミサキ',
      email: 'takahashi@example.com',
      phone: '090-2345-6789',
      position: '介護職員',
      employmentType: '正社員',
      hireDate: new Date('2021-06-15'),
      qualifications: ['介護福祉士'],
      status: 'active',
    },
  });

  const staff3 = await prisma.staff.upsert({
    where: { employeeNumber: 'EMP003' },
    update: {},
    create: {
      facilityId: facility1.id,
      employeeNumber: 'EMP003',
      lastName: '伊藤',
      firstName: '翔太',
      lastNameKana: 'イトウ',
      firstNameKana: 'ショウタ',
      email: 'ito@example.com',
      phone: '090-3456-7890',
      position: '介護職員',
      employmentType: 'パート',
      hireDate: new Date('2022-09-01'),
      qualifications: ['ヘルパー2級'],
      status: 'active',
    },
  });

  console.log('✅ Created staff:', staff1.lastName, staff2.lastName, staff3.lastName);

  // Create residents
  const resident1 = await prisma.resident.create({
    data: {
      facilityId: facility1.id,
      lastName: '山田',
      firstName: '太郎',
      lastNameKana: 'ヤマダ',
      firstNameKana: 'タロウ',
      dateOfBirth: new Date('1941-05-15'),
      gender: 'male',
      careLevel: 3,
      admissionDate: new Date('2023-04-01'),
      status: 'active',
      hasMedicalNeeds: true,
      hasAllergies: false,
      emergencyContact: '山田花子（娘）',
      emergencyPhone: '090-1111-2222',
    },
  });

  const resident2 = await prisma.resident.create({
    data: {
      facilityId: facility1.id,
      lastName: '佐藤',
      firstName: '花子',
      lastNameKana: 'サトウ',
      firstNameKana: 'ハナコ',
      dateOfBirth: new Date('1948-08-20'),
      gender: 'female',
      careLevel: 2,
      admissionDate: new Date('2023-06-15'),
      status: 'active',
      hasMedicalNeeds: false,
      hasAllergies: true,
      emergencyContact: '佐藤一郎（息子）',
      emergencyPhone: '090-3333-4444',
    },
  });

  const resident3 = await prisma.resident.create({
    data: {
      facilityId: facility1.id,
      lastName: '鈴木',
      firstName: '一郎',
      lastNameKana: 'スズキ',
      firstNameKana: 'イチロウ',
      dateOfBirth: new Date('1935-11-03'),
      gender: 'male',
      careLevel: 4,
      admissionDate: new Date('2022-11-20'),
      status: 'active',
      hasMedicalNeeds: true,
      hasAllergies: false,
      emergencyContact: '鈴木美咲（孫）',
      emergencyPhone: '090-5555-6666',
    },
  });

  const resident4 = await prisma.resident.create({
    data: {
      facilityId: facility2.id,
      lastName: '中村',
      firstName: '良子',
      lastNameKana: 'ナカムラ',
      firstNameKana: 'リョウコ',
      dateOfBirth: new Date('1950-03-12'),
      gender: 'female',
      careLevel: 1,
      admissionDate: new Date('2024-01-10'),
      status: 'active',
      hasMedicalNeeds: false,
      hasAllergies: false,
      emergencyContact: '中村健太（息子）',
      emergencyPhone: '090-7777-8888',
    },
  });

  console.log('✅ Created residents:', resident1.lastName, resident2.lastName, resident3.lastName, resident4.lastName);

  // Create tasks
  await prisma.task.create({
    data: {
      facilityId: facility1.id,
      title: '介護記録の提出',
      description: '本日締切の介護記録を提出してください',
      status: 'todo',
      priority: 'urgent',
      assigneeId: staff1.id,
      dueDate: new Date(),
    },
  });

  await prisma.task.create({
    data: {
      facilityId: facility1.id,
      title: 'ケアプラン更新',
      description: '山田太郎様のケアプランを更新する',
      status: 'in_progress',
      priority: 'high',
      assigneeId: staff2.id,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.task.create({
    data: {
      facilityId: facility1.id,
      title: '備品発注',
      description: '介護用品の在庫確認と発注',
      status: 'todo',
      priority: 'medium',
      assigneeId: staff3.id,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('✅ Created tasks');

  // Create incident reports
  await prisma.incidentReport.create({
    data: {
      facilityId: facility1.id,
      residentId: resident1.id,
      reporterId: staff2.id,
      incidentType: '転倒',
      severity: 'medium',
      occurredAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      location: '居室内',
      description: 'ベッドから起き上がる際にバランスを崩し転倒。打撲あり。',
      actionTaken: '看護師が確認、医師に報告。湿布処置実施。',
      preventiveMeasure: 'ベッド周りの環境整備、見守り強化',
      status: 'reported',
    },
  });

  await prisma.incidentReport.create({
    data: {
      facilityId: facility1.id,
      residentId: resident2.id,
      reporterId: staff3.id,
      incidentType: 'ヒヤリハット',
      severity: 'low',
      occurredAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      location: '食堂',
      description: '食事介助中、むせこみがあったが誤嚥には至らず。',
      actionTaken: '様子観察、水分補給を少量ずつ実施。',
      preventiveMeasure: '食事形態の再検討',
      status: 'reviewed',
    },
  });

  console.log('✅ Created incident reports');

  // Create claims
  await prisma.claim.create({
    data: {
      facilityId: facility1.id,
      yearMonth: '2024-01',
      amount: 4280000,
      status: 'submitted',
      billingDate: new Date('2024-02-10'),
    },
  });

  await prisma.claim.create({
    data: {
      facilityId: facility1.id,
      yearMonth: '2023-12',
      amount: 4150000,
      status: 'paid',
      billingDate: new Date('2024-01-10'),
      paymentDate: new Date('2024-01-31'),
    },
  });

  console.log('✅ Created claims');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
