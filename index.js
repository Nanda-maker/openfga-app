import express from "express";
import path from "path";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middlewares/auth.js";
import {
  createFileRecord,
  getAllFileRecords,
  getFileRecordById,
} from "./db.js";
import { fgaClient } from "./openfga.js";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(express.static(path.resolve("./public")));
app.use(authMiddleware);

app.get("/files", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Please login" });

  const allowedFiles = await fgaClient.listObjects({
    user: `user:${req.user.username}`,
    relation: "can_view",
    type: "file",
  });

  const allowedFileIds = allowedFiles.objects.map((obj) => obj.split(":")[1]);

  const files = await getAllFileRecords();
  const allowed = files.filter((e) => allowedFileIds.includes(e.id));

  return res.status(200).json({ files: allowed });
});

app.post("/share-file", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Please login" });

  const { id, username } = req.body;
  // Check if the current user is the owner of the file
  const checkResult = await fgaClient.check({
    user: `user:${req.user.username}`,
    relation: "owner",
    object: `file:${id}`,
  });

  if (!checkResult.allowed) {
    return res
      .status(403)
      .json({ error: "Only the owner can share this file." });
  }
  l;
  await fgaClient.write({
    writes: [
      {
        user: `user:${username}`,
        relation: "viewer",
        object: `file:${id}`,
      },
    ],
  });

  return res.status(200).json({ message: "Access Added" });
});

app.post("/create-file", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Please login" });

  const { id, filename } = req.body;

  const existingFile = await getFileRecordById(id);

  if (existingFile) {
    return res
      .status(400)
      .json({ error: `file with id ${id} already exists!` });
  }

  await createFileRecord({ id, filename });
  await fgaClient.write({
    writes: [
      {
        user: `user:${req.user.username}`,
        relation: "owner",
        object: `file:${id}`,
      },
    ],
  });

  return res.status(201).json({ message: "File created success!" });
});

app.post("/signup", (req, res) => {
  const { username, email } = req.body;

  const token = jwt.sign({ username, email }, "mysupersecret");

  return res.json({ username, token });
});

// Expose available types and relations for clients
app.get("/relations", (req, res) => {
  res.json({
    types: ["file"],
    relations: ["owner", "viewer", "can_view"],
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT :${PORT}`);
});
