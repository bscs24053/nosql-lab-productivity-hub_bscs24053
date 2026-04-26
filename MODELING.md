# Schema Design — Personal Productivity Hub

> Fill in every section below. Keep answers concise.

---

## 1. Collections Overview

Briefly describe each collection (1–2 sentences each):

- **users** — Stores registered user accounts with hashed passwords. Each user owns projects and notes.
- **projects** — Represents a workspace container owned by a user. Projects can be archived but not deleted.
- **tasks** — Represents individual to-do items belonging to a project. Each task embeds its subtasks and tags directly.
- **notes** — Stores freeform text notes owned by a user. A note may optionally be linked to a project.

---

## 2. Document Shapes

For each collection, write the document shape (field name + type + required/optional):

### users
```
{
  _id: ObjectId,
  email: string (required, unique),
  passwordHash: string (required),
  name: string (required),
  createdAt: Date (required)
}
```

### projects
```
{
_id: ObjectId,
ownerId: ObjectId (required, ref: users),
name: string (required),
description: string (optional),
archived: boolean (required, default: false),
createdAt: Date (required)
}
```

### tasks
```
{
_id: ObjectId,
ownerId: ObjectId (required, ref: users),
projectId: ObjectId (required, ref: projects),
title: string (required),
status: string (required, enum: todo|in-progress|done),
priority: number (required, default: 1),
tags: string[] (required, default: []),
subtasks: [ { title: string, done: boolean } ] (required, default: []),
dueDate: Date (optional),
createdAt: Date (required)
}
```

### notes
```
{
_id: ObjectId,
ownerId: ObjectId (required, ref: users),
projectId: ObjectId (optional, ref: projects),
title: string (required),
body: string (required),
tags: string[] (required, default: []),
createdAt: Date (required)
}
```

---

## 3. Embed vs Reference — Decisions

For each relationship, state whether you embedded or referenced, and **why** (one sentence):

| Relationship                       | Embed or Reference? | Why? |
|-----------------------------------|---------------------|------|
| Subtasks inside a task            |Embed                |Subtasks are always read and written together with their parent task and have no independent existence. |
| Tags on a task                    |Embed                |Tags are simple strings owned by the task; embedding avoids a separate collection lookup.       |
| Project → Task ownership          |Reference            |asks are queried independently by project or status, so storing a projectId reference allows flexible filtering.      |
| Note → optional Project link      |Reference            |A note may or may not belong to a project. Storing an optional projectId reference keeps notes self-contained. |

---

## 4. Schema Flexibility Example

Name one field that exists on **some** documents but not **all** in the same collection. Explain why this is acceptable (or even useful) in MongoDB.

> The dueDate field exists on some task documents but not all. In MongoDB this is acceptable because documents in the same collection do not need identical fields. Tasks without a deadline simply omit the field entirely rather than storing a null, which keeps documents clean and reflects real-world data naturally.








