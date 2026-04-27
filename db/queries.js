const { ObjectId } = require('mongodb');

async function signupUser(db, userData) {
  const result = await db.collection('users').insertOne({
    email: userData.email,
    passwordHash: userData.passwordHash,
    name: userData.name,
    createdAt: new Date()
  });
  return result;
}

async function loginFindUser(db, email) {
  return await db.collection('users').findOne({ email: email });
}

async function listUserProjects(db, ownerId) {
 return await db.collection('projects')
   .find({ ownerId: ownerId, archived: false })
   .sort({ createdAt: -1 })
   .toArray();
}

async function createProject(db, projectData) {
 const result = await db.collection('projects').insertOne({
   ownerId: projectData.ownerId,
   name: projectData.name,
   description: projectData.description || '',
   archived: false,
   createdAt: new Date()
 });
 return result;
}

async function archiveProject(db, projectId) {
  const result = await db.collection('projects').updateOne(
    { _id: projectId },
    { $set: { archived: true } }
  );

  return {
    matchedCount: result.matchedCount, modifiedCount: result.modifiedCount
  };
}

async function listProjectTasks(db, projectId, status) {
 const filter = { projectId: projectId };
 if (status) {
   filter.status = status;
 }
 return await db.collection('tasks')
   .find(filter)
   .sort({ priority: -1, createdAt: -1 })
   .toArray();
}
