import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding comprehensive dataset for Phase 3...');

  // Create facilities (3 facilities)
  const facility1 = await prisma.facility.upsert({
    where: { code: 'FAC001' },
    update: {},
    create: {
      name: 'さくら介護センター',
      code: 'FAC001',
      type: '特別養護老人ホーム',
      address: '東京都渋谷区桜町1-2-3',
      phone: '03-1234-5678',
      email: 'info@sakura-care.example.com',
      capacity: 50,
      licenseNumber: '1334567890',
    },
  });

  const facility2 = await prisma.facility.upsert({
    where: { code: 'FAC002' },
    update: {},
    create: {
      name: 'ひまわりデイサービス',
      code: 'FAC002',
      type: 'デイサービス',
      address: '東京都新宿区向日葵5-6-7',
      phone: '03-9876-5432',
      email: 'contact@himawari-day.example.com',
      capacity: 30,
      licenseNumber: '0987654321',
    },
  });

  const facility3 = await prisma.facility.upsert({
    where: { code: 'FAC003' },
    update: {},
    create: {
      name: 'もみじグループホーム',
      code: 'FAC003',
      type: 'グループホーム',
      address: '東京都世田谷区紅葉8-9-10',
      phone: '03-5555-6666',
      email: 'info@momiji-gh.example.com',
      capacity: 18,
      licenseNumber: '1122334455',
    },
  });

  console.log('✅ Created 3 facilities');

  // Create staff (12 staff members with updated enums)
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
      position: 'facility_manager',
      employmentType: 'full_time',
      hireDate: new Date('2020-04-01'),
      qualifications: ['certified_care_worker', 'certified_social_worker'],
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
      position: 'care_worker',
      employmentType: 'full_time',
      hireDate: new Date('2021-06-15'),
      qualifications: ['certified_care_worker', 'first_aid'],
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
      position: 'care_worker',
      employmentType: 'part_time',
      hireDate: new Date('2022-09-01'),
      qualifications: ['care_helper_2'],
      status: 'active',
    },
  });

  const staff4 = await prisma.staff.upsert({
    where: { employeeNumber: 'EMP004' },
    update: {},
    create: {
      facilityId: facility1.id,
      employeeNumber: 'EMP004',
      lastName: '山本',
      firstName: '優子',
      lastNameKana: 'ヤマモト',
      firstNameKana: 'ユウコ',
      email: 'yamamoto@example.com',
      phone: '090-4567-8901',
      position: 'nurse',
      employmentType: 'full_time',
      hireDate: new Date('2019-10-01'),
      qualifications: ['registered_nurse', 'first_aid'],
      status: 'active',
    },
  });

  const staff5 = await prisma.staff.upsert({
    where: { employeeNumber: 'EMP005' },
    update: {},
    create: {
      facilityId: facility1.id,
      employeeNumber: 'EMP005',
      lastName: '佐々木',
      firstName: '健',
      lastNameKana: 'ササキ',
      firstNameKana: 'ケン',
      email: 'sasaki@example.com',
      phone: '090-5678-9012',
      position: 'social_worker',
      employmentType: 'full_time',
      hireDate: new Date('2021-03-15'),
      qualifications: ['certified_social_worker'],
      status: 'active',
    },
  });

  const staff6 = await prisma.staff.upsert({
    where: { employeeNumber: 'EMP006' },
    update: {},
    create: {
      facilityId: facility2.id,
      employeeNumber: 'EMP006',
      lastName: '渡辺',
      firstName: '真理',
      lastNameKana: 'ワタナベ',
      firstNameKana: 'マリ',
      email: 'watanabe@example.com',
      phone: '090-6789-0123',
      position: 'administrator',
      employmentType: 'full_time',
      hireDate: new Date('2020-08-01'),
      qualifications: ['care_manager', 'certified_care_worker'],
      status: 'active',
    },
  });

  console.log('✅ Created 6 staff members');

  // Create residents (10 residents)
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

  const resident5 = await prisma.resident.create({
    data: {
      facilityId: facility1.id,
      lastName: '小林',
      firstName: '正子',
      lastNameKana: 'コバヤシ',
      firstNameKana: 'マサコ',
      dateOfBirth: new Date('1945-07-22'),
      gender: 'female',
      careLevel: 3,
      admissionDate: new Date('2023-09-01'),
      status: 'active',
      hasMedicalNeeds: true,
      hasAllergies: true,
      emergencyContact: '小林太郎（息子）',
      emergencyPhone: '090-9999-1111',
    },
  });

  console.log('✅ Created 5 residents');

  // Create certifications for staff
  await prisma.certification.create({
    data: {
      staffId: staff2.id,
      name: '介護福祉士',
      certificationNumber: 'CFW-123456',
      issuedBy: '日本介護福祉士会',
      issuedDate: new Date('2021-03-15'),
      expiryDate: null, // No expiry
      status: 'active',
    },
  });

  await prisma.certification.create({
    data: {
      staffId: staff4.id,
      name: '看護師免許',
      certificationNumber: 'RN-789012',
      issuedBy: '厚生労働省',
      issuedDate: new Date('2015-04-01'),
      expiryDate: null,
      status: 'active',
    },
  });

  await prisma.certification.create({
    data: {
      staffId: staff3.id,
      name: '普通救命講習',
      certificationNumber: 'BLS-345678',
      issuedBy: '東京消防庁',
      issuedDate: new Date('2023-06-01'),
      expiryDate: new Date('2026-06-01'),
      status: 'active',
    },
  });

  console.log('✅ Created staff certifications');

  // Create family members
  await prisma.familyMember.create({
    data: {
      residentId: resident1.id,
      lastName: '山田',
      firstName: '花子',
      relationship: 'child',
      phone: '03-1234-5678',
      mobilePhone: '090-1111-2222',
      email: 'hanako.yamada@example.com',
      isPrimaryContact: true,
      canMakeDecisions: true,
      shouldNotify: true,
      preferredContactMethod: 'phone',
      preferredContactTime: 'evening',
    },
  });

  await prisma.familyMember.create({
    data: {
      residentId: resident2.id,
      lastName: '佐藤',
      firstName: '一郎',
      relationship: 'child',
      phone: '03-2345-6789',
      mobilePhone: '090-3333-4444',
      email: 'ichiro.sato@example.com',
      isPrimaryContact: true,
      canMakeDecisions: true,
      shouldNotify: true,
      preferredContactMethod: 'email',
      preferredContactTime: 'afternoon',
    },
  });

  console.log('✅ Created family members');

  // Create medication schedules
  await prisma.medicationSchedule.create({
    data: {
      residentId: resident1.id,
      medicationName: 'アリセプト',
      dosage: '5',
      unit: 'mg',
      frequency: 'daily',
      administrationTimes: ['08:00'],
      startDate: new Date('2023-04-01'),
      purpose: '認知症治療',
      isActive: true,
    },
  });

  await prisma.medicationSchedule.create({
    data: {
      residentId: resident3.id,
      medicationName: 'ノルバスク',
      dosage: '5',
      unit: 'mg',
      frequency: 'daily',
      administrationTimes: ['08:00'],
      startDate: new Date('2022-11-20'),
      purpose: '高血圧治療',
      isActive: true,
    },
  });

  console.log('✅ Created medication schedules');

  // Create vital records
  const now = new Date();
  await prisma.vitalRecord.create({
    data: {
      residentId: resident1.id,
      recordedBy: staff2.id,
      recordedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      bloodPressureSystolic: 128,
      bloodPressureDiastolic: 78,
      pulseRate: 72,
      temperature: 36.5,
      oxygenSaturation: 97,
      flaggedAbnormal: false,
    },
  });

  await prisma.vitalRecord.create({
    data: {
      residentId: resident3.id,
      recordedBy: staff4.id,
      recordedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      bloodPressureSystolic: 145,
      bloodPressureDiastolic: 92,
      pulseRate: 85,
      temperature: 36.8,
      oxygenSaturation: 95,
      flaggedAbnormal: true,
      notes: '血圧が高め。経過観察。',
    },
  });

  console.log('✅ Created vital records');

  // Create incident categories
  const categoryFall = await prisma.incidentCategory.create({
    data: {
      facilityId: facility1.id,
      name: '転倒',
      code: 'FALL',
      description: '転倒事故',
      severity: 'medium',
      requiresFollowUp: true,
      isActive: true,
    },
  });

  const categoryMedError = await prisma.incidentCategory.create({
    data: {
      facilityId: facility1.id,
      name: '誤薬',
      code: 'MEDERROR',
      description: '投薬ミス',
      severity: 'high',
      requiresFollowUp: true,
      isActive: true,
    },
  });

  console.log('✅ Created incident categories');

  // Create incident reports (using new enums)
  const incident1 = await prisma.incidentReport.create({
    data: {
      facilityId: facility1.id,
      residentId: resident1.id,
      reporterId: staff2.id,
      categoryId: categoryFall.id,
      incidentType: 'fall',
      severity: 'medium',
      occurredAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      location: '居室内',
      description: 'ベッドから起き上がる際にバランスを崩し転倒。右腕に打撲あり。',
      actionTaken: '看護師が確認、医師に報告済み。湿布処置実施。経過観察中。',
      preventiveMeasure: 'ベッド周りの環境整備、見守り強化、ベッド高さ調整',
      status: 'reported',
    },
  });

  const incident2 = await prisma.incidentReport.create({
    data: {
      facilityId: facility1.id,
      residentId: resident2.id,
      reporterId: staff3.id,
      incidentType: 'near_miss',
      severity: 'low',
      occurredAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      location: '食堂',
      description: '食事介助中、むせこみがあったが誤嚥には至らず。',
      actionTaken: '様子観察、水分補給を少量ずつ実施。',
      preventiveMeasure: '食事形態の再検討、とろみ剤使用検討',
      status: 'under_review',
    },
  });

  console.log('✅ Created incident reports');

  // Create follow-up actions for incidents
  await prisma.incidentFollowUpAction.create({
    data: {
      incidentId: incident1.id,
      actionType: 'investigation',
      description: '転倒原因の詳細調査とリスク評価',
      status: 'in_progress',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.incidentFollowUpAction.create({
    data: {
      incidentId: incident1.id,
      actionType: 'training',
      description: '全職員向け転倒予防研修の実施',
      status: 'pending',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('✅ Created follow-up actions');

  // Create care records
  await prisma.careRecord.create({
    data: {
      residentId: resident1.id,
      caregiverId: staff2.id,
      recordedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      careType: 'bathing',
      description: '入浴介助実施。特に問題なし。',
      residentCondition: 'good',
      moodBehavior: 'cheerful',
    },
  });

  await prisma.careRecord.create({
    data: {
      residentId: resident2.id,
      caregiverId: staff3.id,
      recordedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      careType: 'meal_assistance',
      description: '昼食介助。全量摂取。',
      residentCondition: 'good',
      moodBehavior: 'calm',
      mealType: 'lunch',
      intakePercentage: 100,
    },
  });

  console.log('✅ Created care records');

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

  console.log('✅ Created tasks');

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

  // Create vendors
  const vendor1 = await prisma.vendor.create({
    data: {
      facilityId: facility1.id,
      name: '介護用品サプライ株式会社',
      code: 'VEN001',
      type: 'supplier',
      contactPerson: '営業部 鈴木',
      phone: '03-1111-2222',
      email: 'suzuki@care-supply.example.com',
      paymentTerms: 'net_30',
      isActive: true,
    },
  });

  console.log('✅ Created vendors');

  // Create inventory items
  await prisma.inventoryItem.create({
    data: {
      facilityId: facility1.id,
      name: '大人用紙おむつ（Mサイズ）',
      sku: 'DIAPER-M-001',
      category: 'supplies',
      currentStock: 120,
      unit: '枚',
      minimumStock: 50,
      reorderPoint: 75,
      unitCost: 85,
      storageLocation: '倉庫A-1',
      preferredVendorId: vendor1.id,
      isActive: true,
    },
  });

  await prisma.inventoryItem.create({
    data: {
      facilityId: facility1.id,
      name: 'ウェットティッシュ',
      sku: 'WIPE-001',
      category: 'supplies',
      currentStock: 45,
      unit: '箱',
      minimumStock: 20,
      reorderPoint: 30,
      unitCost: 280,
      storageLocation: '倉庫A-2',
      preferredVendorId: vendor1.id,
      isActive: true,
    },
  });

  console.log('✅ Created inventory items');

  // Create communication
  await prisma.communication.create({
    data: {
      facilityId: facility1.id,
      authorId: staff1.id,
      type: 'announcement',
      channel: 'internal',
      title: '月次ミーティングのお知らせ',
      content: '来週水曜日14:00より月次全体ミーティングを実施します。全職員の参加をお願いします。',
      targetAudience: ['all_staff'],
      publishedAt: new Date(),
      priority: 'normal',
      requiresAcknowledgment: true,
      isActive: true,
    },
  });

  console.log('✅ Created communications');

  // Create activity event
  await prisma.activityEvent.create({
    data: {
      facilityId: facility1.id,
      title: '春のお花見イベント',
      description: '近隣の公園でお花見を楽しみます',
      activityType: 'recreation',
      scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      startTime: '10:00',
      endTime: '15:00',
      location: '代々木公園',
      maxParticipants: 15,
      registeredCount: 8,
      status: 'scheduled',
    },
  });

  console.log('✅ Created activity events');

  console.log('🎉 Phase 3 comprehensive seeding completed!');
  console.log('📊 Summary:');
  console.log('   - 3 Facilities');
  console.log('   - 6 Staff members with certifications');
  console.log('   - 5 Residents with family members');
  console.log('   - Medication schedules, vital records, care records');
  console.log('   - Incident reports with categories and follow-up actions');
  console.log('   - Tasks, claims, inventory, vendors');
  console.log('   - Communications and activity events');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
