require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect } = require('./db/connection');

(async () => {
  const db = await connect();
  await db.collection('users').deleteMany({});
  await db.collection('projects').deleteMany({});
  await db.collection('tasks').deleteMany({});
  await db.collection('notes').deleteMany({});
  await db.collection('users').createIndex({ email: 1 }, { unique: true });

  const hash1 = await bcrypt.hash('password123', 10);
  const hash2 = await bcrypt.hash('securepass', 10);

  const u1 = await db.collection('users').insertOne({
    email: 'alishay@example.com',
    passwordHash: hash1,
    name: 'Alishay Khan',
    createdAt: new Date()
  });

  const u2 = await db.collection('users').insertOne({
    email: 'burhan@example.com',
    passwordHash: hash2,
    name: 'Burhan Sheikh',
    createdAt: new Date()
  });

  const alishayId = u1.insertedId;
  const burhanId = u2.insertedId;


  const p1 = await db.collection('projects').insertOne({
    ownerId: alishayId,
    name: 'Final Year Project',
    description: 'ML-based attendance system',
    archived: false,
    createdAt: new Date('2025-01-10')
  });

  const p2 = await db.collection('projects').insertOne({
    ownerId: alishayId,
    name: 'Personal Website',
    description: 'Portfolio site rebuild',
    archived: false,
    createdAt: new Date('2025-02-01')
  });

  const p3 = await db.collection('projects').insertOne({
    ownerId: burhanId,
    name: 'E-Commerce App',
    description: 'Online store for local business',
    archived: false,
    createdAt: new Date('2025-01-20')
  });

  const p4 = await db.collection('projects').insertOne({
    ownerId: burhanId,
    name: 'Old Blog',
    archived: false,
    createdAt: new Date('2024-11-05')
  });

  const fyp = p1.insertedId;
  const web = p2.insertedId;
  const ecom = p3.insertedId;
  const blog = p4.insertedId;

  await db.collection('tasks').insertMany([
    {
      ownerId: alishayId,
      projectId: fyp,
      title: 'Write literature review',
      status: 'done',
      priority: 3,
      tags: ['writing', 'research'],
      subtasks: [
        { title: 'Find 10 papers', done: true },
        { title: 'Summarise each paper', done: true }
      ],
      dueDate: new Date('2025-03-01'),
      createdAt: new Date('2025-01-11')
    },
    {
      ownerId: alishayId,
      projectId: fyp,
      title: 'Train ML model',
      status: 'in-progress',
      priority: 5,
      tags: ['ml', 'urgent'],
      subtasks: [
        { title: 'Prepare dataset', done: true },
        { title: 'Run training loop', done: false },
        { title: 'Evaluate accuracy', done: false }
      ],
      dueDate: new Date('2025-04-15'),
      createdAt: new Date('2025-02-01')
    },
    {
      ownerId: alishayId,
      projectId: web,
      title: 'Design homepage mockup',
      status: 'todo',
      priority: 2,
      tags: ['design', 'ui'],
      subtasks: [
        { title: 'Sketch wireframe', done: false },
        { title: 'Pick color palette', done: false }
      ],
      createdAt: new Date('2025-02-05')
    },
    {
      ownerId: burhanId,
      projectId: ecom,
      title: 'Set up payment gateway',
      status: 'todo',
      priority: 4,
      tags: ['backend', 'urgent'],
      subtasks: [
        { title: 'Create Stripe account', done: true },
        { title: 'Integrate API', done: false }
      ],
      dueDate: new Date('2025-05-01'),
      createdAt: new Date('2025-01-25')
    },
    {
      ownerId: burhanId,
      projectId: blog,
      title: 'Write first blog post',
      status: 'done',
      priority: 1,
      tags: ['writing'],
      subtasks: [
        { title: 'Choose topic', done: true },
        { title: 'Draft post', done: true },
        { title: 'Publish', done: true }
      ],
      createdAt: new Date('2024-11-10')
    },
    {
      ownerId: alishayId,
      projectId: fyp,
      title: 'Prepare final presentation',
      status: 'todo',
      priority: 4,
      tags: ['presentation', 'urgent'],
      subtasks: [
        { title: 'Make slides', done: false },
        { title: 'Rehearse talk', done: false }
      ],
      dueDate: new Date('2025-05-20'),
      createdAt: new Date('2025-03-01')
    },
    {
      ownerId: burhanId,
      projectId: ecom,
      title: 'Build product listing page',
      status: 'in-progress',
      priority: 3,
      tags: ['frontend'],
      subtasks: [
        { title: 'Create product card component', done: true },
        { title: 'Add pagination', done: false }
      ],
      createdAt: new Date('2025-02-10')
    }
  ]);

  await db.collection('notes').insertMany([
    {
      ownerId: alishayId,
      projectId: fyp,
      title: 'FYP Research Ideas',
      body: 'Consider using ResNet for feature extraction. Look into transfer learning.',
      tags: ['research', 'ml'],
      createdAt: new Date('2025-01-12')
    },
    {
      ownerId: alishayId,
      projectId: web,
      title: 'Website Color Palette',
      body: 'Primary: #2563eb, Secondary: #7c3aed, Neutral: #f3f4f6',
      tags: ['design', 'ui'],
      createdAt: new Date('2025-02-06')
    },
    {
      ownerId: alishayId,
      title: 'Books to Read',
      body: 'Designing Data-Intensive Applications, Clean Code, The Pragmatic Programmer',
      tags: ['personal', 'reading'],
      createdAt: new Date('2025-01-20')
    },
    {
      ownerId: burhanId,
      projectId: ecom,
      title: 'Stripe Integration Notes',
      body: 'Use stripe.paymentIntents.create(), webhook endpoint at /api/stripe/webhook',
      tags: ['backend', 'payments'],
      createdAt: new Date('2025-01-26')
    },
    {
      ownerId: burhanId,
      title: 'Daily Standup Notes',
      body: 'Remember to update Jira tickets before standup. Send weekly summary on Fridays.',
      tags: ['work', 'productivity'],
      createdAt: new Date('2025-02-01')
    },
    {
      ownerId: alishayId,
      title: 'Meeting Notes - Supervisor',
      body: 'Supervisor approved topic. Next meeting in 2 weeks. Submit draft by March.',
      tags: ['research', 'meeting'],
      createdAt: new Date('2025-01-15')
    }
  ]);

  console.log('Database seeded');
  process.exit(0);
})();